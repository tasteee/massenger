import fs from 'fs'
import path from 'path'
import os from 'os'
import Database from 'better-sqlite3'
import to from 'await-to-js'

// Types
export type Backup = {
	id: string
	path: string
	createdAt: Date
	displayName: string
}

export type ExtractionResult = {
	success: boolean
	path?: string
	error?: string
	stats?: {
		messages: number
		chats: number
		handles: number
	}
}

// Constants
const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
const BACKUP_ROOT = path.join(APPDATA, 'Apple Computer', 'MobileSync', 'Backup')
const EXTRACTED_DIR = path.join(process.cwd(), 'extracted')

// Helper to ensure directory exists
const ensureDir = (dirPath: string) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

export const listBackups = async (): Promise<Backup[]> => {
	const [err, stats] = await to(fs.promises.stat(BACKUP_ROOT))

	if (err || !stats || !stats.isDirectory()) {
		console.error('Backup directory not found:', BACKUP_ROOT)
		return []
	}

	const [readErr, dirs] = await to(fs.promises.readdir(BACKUP_ROOT))

	if (readErr || !dirs) {
		console.error('Error reading backup directory:', readErr)
		return []
	}

	const backups: Backup[] = []

	for (const dir of dirs) {
		const backupPath = path.join(BACKUP_ROOT, dir)
		const manifestPath = path.join(backupPath, 'Manifest.db')

		// Check if Manifest.db exists
		if (fs.existsSync(manifestPath)) {
			const stat = fs.statSync(backupPath)
			backups.push({
				id: dir,
				path: backupPath,
				createdAt: stat.birthtime, // or stat.mtime
				displayName: `iPhone Backup (${dir.substring(0, 8)}...)`
			})
		}
	}

	// Sort by date descending
	return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const extractSmsDb = async (backupId: string): Promise<ExtractionResult> => {
	ensureDir(EXTRACTED_DIR)

	const backupPath = path.join(BACKUP_ROOT, backupId)
	const manifestPath = path.join(backupPath, 'Manifest.db')
	const outputPath = path.join(EXTRACTED_DIR, `sms_${backupId}.db`)

	if (!fs.existsSync(manifestPath)) {
		return { success: false, error: 'Manifest.db not found' }
	}

	try {
		const db = new Database(manifestPath, { readonly: true })

		// Find the fileID for sms.db
		// In newer iOS versions, relativePath is often used.
		// Sometimes files are hashed differently, but standard is Library/SMS/sms.db
		const row = db
			.prepare(
				`
			SELECT fileID
			FROM Files
			WHERE relativePath = 'Library/SMS/sms.db'
			LIMIT 1
		`
			)
			.get() as { fileID: string } | undefined

		db.close()

		if (!row || !row.fileID) {
			return { success: false, error: 'Could not find Library/SMS/sms.db in Manifest' }
		}

		const fileID = row.fileID
		const subdirectory = fileID.substring(0, 2)
		let sourcePath = path.join(backupPath, subdirectory, fileID)

		// Fallback: sometimes files are flat in the backup folder (older versions)
		if (!fs.existsSync(sourcePath)) {
			sourcePath = path.join(backupPath, fileID)
		}

		if (!fs.existsSync(sourcePath)) {
			return { success: false, error: `Physical file not found at ${sourcePath}` }
		}

		fs.copyFileSync(sourcePath, outputPath)

		// Verify extracted DB
		return verifySmsDb(outputPath)
	} catch (error) {
		console.error('Extraction error:', error)
		return { success: false, error: String(error) }
	}
}

const verifySmsDb = (dbPath: string): ExtractionResult => {
	try {
		const db = new Database(dbPath, { readonly: true })

		// Check for required tables
		const tables = db
			.prepare(
				`
			SELECT name FROM sqlite_master 
			WHERE type='table' AND name IN ('message', 'chat', 'handle')
		`
			)
			.all() as { name: string }[]

		const foundTables = tables.map((t) => t.name)
		const hasMessage = foundTables.includes('message')
		const hasChat = foundTables.includes('chat')
		const hasHandle = foundTables.includes('handle')

		if (!hasMessage || !hasChat || !hasHandle) {
			db.close()
			return {
				success: false,
				error: `Missing tables: ${!hasMessage ? 'message ' : ''}${!hasChat ? 'chat ' : ''}${!hasHandle ? 'handle' : ''}`.trim()
			}
		}

		// Get basic stats to verify content
		const messageCount = (db.prepare('SELECT COUNT(*) as count FROM message').get() as { count: number }).count
		const chatCount = (db.prepare('SELECT COUNT(*) as count FROM chat').get() as { count: number }).count
		const handleCount = (db.prepare('SELECT COUNT(*) as count FROM handle').get() as { count: number }).count

		db.close()

		return {
			success: true,
			path: dbPath,
			stats: {
				messages: messageCount,
				chats: chatCount,
				handles: handleCount
			}
		}
	} catch (error) {
		return { success: false, error: `Verification failed: ${String(error)}` }
	}
}
