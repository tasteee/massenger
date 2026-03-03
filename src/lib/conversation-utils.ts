export const getTotalMessageCount = (conversations: ConversationT[]): number => {
	return conversations.reduce((total, conversation) => {
		return total + conversation.messages.length
	}, 0)
}

export const getConversationDisplayName = (conversation: ConversationT): string => {
	if (conversation.metadata.displayName) {
		return conversation.metadata.displayName
	}
	if (conversation.metadata.isGroup) {
		const participantList = conversation.metadata.participants
			.slice(0, 3)
			.map((participant) => participant.address)
			.join(', ')
		return participantList || conversation.metadata.chatIdentifier
	}
	return conversation.metadata.chatIdentifier
}

export const getLastMessage = (conversation: ConversationT): MessageT | null => {
	if (conversation.messages.length === 0) return null
	return conversation.messages[conversation.messages.length - 1]
}

export const formatTimestamp = (isoTimestamp: string): string => {
	const date = new Date(isoTimestamp)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

	if (diffDays === 0) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}
	if (diffDays === 1) {
		return 'Yesterday'
	}
	if (diffDays < 7) {
		return date.toLocaleDateString([], { weekday: 'short' })
	}
	return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
