import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import Database from 'better-sqlite3'

export const runtime = 'nodejs'

/* ----------------------------- helpers ----------------------------- */

const getAppDataPath = () => process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')

const APPLE_EPOCH_MS = Date.UTC(2001, 0, 1)

const appleDateToISO = (appleDate: number | null): string | null => {
	if (!appleDate) return null
	return new Date(APPLE_EPOCH_MS + appleDate / 1_000_000).toISOString()
}

const getEmojiFromType = (type: number): string | null => {
	switch (type) {
		case 2000:
			return '❤️'
		case 2001:
			return '👍'
		case 2002:
			return '👎'
		case 2003:
			return '😂'
		case 2004:
			return '!!'
		case 2005:
			return '❓'
		default:
			return null
	}
}

/* ------------------------------ route ------------------------------ */

export async function POST(req: Request) {
	try {
		const { backupId } = await req.json()

		if (!backupId) {
			return NextResponse.json({ error: 'Missing backupId' }, { status: 400 })
		}

		/* -------- locate backup + manifest -------- */

		const backupRoot = path.join(getAppDataPath(), 'Apple Computer', 'MobileSync', 'Backup')

		const backupPath = path.join(backupRoot, backupId)
		const manifestPath = path.join(backupPath, 'Manifest.db')

		if (!fs.existsSync(manifestPath)) {
			return NextResponse.json({ error: 'Invalid backupId' }, { status: 404 })
		}

		/* -------- find sms.db hash -------- */

		const manifestDb = new Database(manifestPath, { readonly: true })

		const manifestRow = manifestDb
			.prepare(
				`
        SELECT fileID
        FROM Files
        WHERE relativePath = 'Library/SMS/sms.db'
        LIMIT 1
      `
			)
			.get() as { fileID: string } | undefined

		manifestDb.close()

		if (!manifestRow) {
			return NextResponse.json({ error: 'sms.db not found in backup' }, { status: 404 })
		}

		const fileID = manifestRow.fileID
		const subdir = fileID.slice(0, 2)

		let smsPath = path.join(backupPath, subdir, fileID)
		if (!fs.existsSync(smsPath)) {
			smsPath = path.join(backupPath, fileID)
		}

		if (!fs.existsSync(smsPath)) {
			return NextResponse.json({ error: 'sms.db file missing' }, { status: 404 })
		}

		/* -------- open sms.db -------- */

		const smsDb = new Database(smsPath, { readonly: true })

		/* -------- load handles -------- */

		const handles = smsDb.prepare(`SELECT ROWID, id FROM handle`).all() as { ROWID: number; id: string }[]

		const handleMap = new Map<number, string>()
		for (const h of handles) handleMap.set(h.ROWID, h.id)

		/* -------- load chats -------- */

		const chats = smsDb
			.prepare(
				`
				SELECT
					ROWID AS chatId,
					chat_identifier,
					display_name,
					style,
					group_id,
					room_name
				FROM chat
				`
			)
			.all() as {
			chatId: number
			chat_identifier: string
			display_name: string | null
			style: number | null
			group_id: string | null
			room_name: string | null
		}[]

		/* -------- participants per chat -------- */

		const chatHandles = smsDb
			.prepare(
				`
        SELECT chat_id, handle_id
        FROM chat_handle_join
      `
			)
			.all() as { chat_id: number; handle_id: number }[]

		const participantsByChat = new Map<number, ParticipantT[]>()

		for (const row of chatHandles) {
			const address = handleMap.get(row.handle_id)
			if (!address) continue

			const arr = participantsByChat.get(row.chat_id) ?? []
			arr.push({ handleId: row.handle_id, address })
			participantsByChat.set(row.chat_id, arr)
		}

		/* -------- messages -------- */

		const messages = smsDb
			.prepare(
				`
        SELECT
          m.ROWID           AS id,
          m.guid            AS guid,
          m.text            AS text,
          m.date            AS date,
          m.is_from_me      AS is_from_me,
          m.handle_id       AS handle_id,
          m.service         AS service,
          m.associated_message_guid AS associated_message_guid,
          m.associated_message_type AS associated_message_type,
          cmj.chat_id       AS chat_id
        FROM message m
        JOIN chat_message_join cmj
          ON cmj.message_id = m.ROWID
        ORDER BY m.date ASC
      `
			)
			.all() as {
			id: number
			guid: string
			text: string | null
			date: number | null
			is_from_me: number
			handle_id: number | null
			service: string
			chat_id: number
			associated_message_guid: string | null
			associated_message_type: number | null
		}[]

		/* -------- attachments -------- */

		const attachments = smsDb
			.prepare(
				`
        SELECT
          maj.message_id,
          a.filename,
          a.mime_type,
          a.transfer_name,
          a.total_bytes
        FROM message_attachment_join maj
        JOIN attachment a
          ON a.ROWID = maj.attachment_id
      `
			)
			.all() as {
			message_id: number
			filename: string | null
			mime_type: string | null
			transfer_name: string | null
			total_bytes: number | null
		}[]

		smsDb.close()

		const attachmentsByMessage = new Map<number, AttachmentT[]>()

		for (const a of attachments) {
			const arr = attachmentsByMessage.get(a.message_id) ?? []
			arr.push({
				filename: a.filename,
				mimeType: a.mime_type,
				transferName: a.transfer_name,
				size: a.total_bytes
			})
			attachmentsByMessage.set(a.message_id, arr)
		}

		/* -------- build conversations -------- */

		const conversations: ThreadT[] = []

		for (const chat of chats) {
			const chatMessages = messages.filter((m) => m.chat_id === chat.chatId)

			if (chatMessages.length === 0) continue

			const msgMap = new Map<string, MessageT>()
			const reactions: any[] = []

			for (const m of chatMessages) {
				if (m.associated_message_guid) {
					reactions.push(m)
					continue
				}

				const msgText = m.text ? m.text.replace(/\uFFFC/g, '') : null
				const msgAttachments = (attachmentsByMessage.get(m.id) ?? []).map((a) => ({ ...a, reactions: [] }))

				if (msgText === null && msgAttachments.length === 0) continue

				const msg: MessageT = {
					id: m.id,
					guid: m.guid,
					timestamp: appleDateToISO(m.date)!,
					sender: m.is_from_me
						? { isMe: true }
						: {
								isMe: false,
								handle: m.handle_id ? handleMap.get(m.handle_id) : undefined
							},
					text: msgText,
					service: m.service,
					attachments: msgAttachments,
					flags: {
						isFromMe: !!m.is_from_me
					},
					hasBookmarks: false,
					hasNotes: false,
					bookmarks: [],
					notes: [],
					reactions: []
				}

				msgMap.set(m.guid, msg)
			}

			// Apply reactions
			for (const r of reactions) {
				const rawGuid = r.associated_message_guid
				const clean = rawGuid.replace(/^p:\d+\//, '').replace(/^bp:/, '')
				const target = msgMap.get(rawGuid) ?? msgMap.get(clean)

				if (target) {
					let emoji = r.associated_message_type ? getEmojiFromType(r.associated_message_type) : null

					if (!emoji && r.text) {
						// Parsing "Reacted [emoji] to [message]"
						const match = r.text.match(/^Reacted\s+(.*?)\s+to\s+/)
						if (match && match[1]) {
							emoji = match[1]
						}
						// Fallback for text-based reaction descriptions (older iOS or missing types)
						else if (r.text.startsWith('Loved “')) emoji = '❤️'
						else if (r.text.startsWith('Liked “')) emoji = '👍'
						else if (r.text.startsWith('Disliked “')) emoji = '👎'
						else if (r.text.startsWith('Laughed at “')) emoji = '😂'
						else if (r.text.startsWith('Emphasized “')) emoji = '!!'
						else if (r.text.startsWith('Questioned “')) emoji = '❓'
					}

					if (emoji) {
						// Logic to determine if reaction targets an attachment
						const partMatch = r.associated_message_guid.match(/^p:(\d+)\//)
						const partIndex = partMatch ? parseInt(partMatch[1], 10) : null

						// If there is a part index and attachments exist, check if it maps to an attachment
						// Note: This is a simplifying assumption. Often index 0 is first attachment if only attachment exists,
						// or if text exists, it might be index 0.
						// If user explicitly asks for attachment reactions, we can try to map p:0 to attachment 0.
						if (partIndex !== null && target.attachments.length > partIndex) {
							target.attachments[partIndex].reactions?.push({
								emoji: emoji,
								isFromMe: !!r.is_from_me
							})
						} else {
							// Default to message reaction
							target.reactions.push({
								emoji: emoji,
								isFromMe: !!r.is_from_me
							})
						}
					}
				}
			}

			const conv: ThreadT = {
				chatId: chat.chatId,
				chatIdentifier: chat.chat_identifier,
				displayName: chat.display_name,
				isGroup: chat.style === 43 || !!chat.group_id || !!chat.room_name,
				participants: participantsByChat.get(chat.chatId) ?? [],
				exportedAt: new Date().toISOString(),
				source: 'sms.db',
				messages: Array.from(msgMap.values())
			}

			conversations.push(conv)
		}

		/* -------- dev dump -------- */

		const dumpPath = path.join(process.cwd(), 'extracted-data.json')
		fs.writeFileSync(dumpPath, JSON.stringify(conversations, null, 2))

		console.log(`Extracted ${conversations.length} conversations from backup ${backupId}`)
		return NextResponse.json(conversations)
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Failed to extract conversations' }, { status: 500 })
	}
}
