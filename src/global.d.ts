type BackupT = {
	id: string
	path: string
	createdAt: string
	displayName: string
}

type AttachmentT = {
	filename: string | null
	mimeType: string | null
	transferName?: string | null
	size?: number | null
	reactions?: {
		emoji: string
		isFromMe: boolean
	}[]
}

type MessageT = {
	id: number
	guid: string
	timestamp: string // ISO-8601
	text: string | null
	service: 'iMessage' | 'SMS' | 'MMS' | string
	attachments: AttachmentT[]

	sender: {
		isMe: boolean
		handle?: string // undefined if isMe === true
	}

	flags: {
		isFromMe: boolean
		isRead?: boolean
		isDelivered?: boolean
		isSent?: boolean
		isDeleted?: boolean
	}

	reactions: {
		emoji: string
		isFromMe: boolean
	}[]
}

type ParticipantT = {
	handleId: number
	address: string // phone number or Apple ID
}

type ThreadT = {
	chatId: number
	chatIdentifier: string
	displayName: string | null
	isGroup: boolean
	participants: ParticipantT[]
	exportedAt: string // ISO
	source: 'sms.db'
	messages: MessageT[]
}
