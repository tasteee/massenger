'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquare, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getTotalMessageCount, getConversationDisplayName, getLastMessage, formatTimestamp } from '@/lib/conversation-utils'

type DashboardViewProps = {
	conversations: ConversationT[]
	onBack: () => void
}

const DashboardView = ({ conversations, onBack }: DashboardViewProps) => {
	const [activeConversation, setActiveConversation] = useState<ConversationT | null>(null)

	const sortedConversations = [...conversations].sort((conversationA, conversationB) => {
		const lastMessageA = getLastMessage(conversationA)
		const lastMessageB = getLastMessage(conversationB)
		if (!lastMessageA) return 1
		if (!lastMessageB) return -1
		return new Date(lastMessageB.timestamp).getTime() - new Date(lastMessageA.timestamp).getTime()
	})

	return (
		<div className="w-full h-screen flex flex-col bg-background">
			{/* Top Bar */}
			<div className="flex items-center gap-4 px-6 h-14 border-b border-border shrink-0">
				<Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>
				<div className="h-4 w-px bg-border" />
				<span className="text-sm font-semibold text-foreground">massenger</span>
				<span className="text-xs text-muted-foreground ml-1">
					{conversations.length} conversations · {getTotalMessageCount(conversations).toLocaleString()} messages
				</span>
			</div>

			{/* Main Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Conversation List */}
				<div className="w-[360px] border-r border-border flex flex-col bg-surface-base shrink-0 overflow-hidden">
					<ScrollArea className="ConversationsScrollArea flex-1 w-full">
						<div className="p-2 space-y-0.5">
							{sortedConversations.map((conversation) => {
								const lastMessage = getLastMessage(conversation)
								const isActive = activeConversation?.metadata.chatId === conversation.metadata.chatId
								const displayName = getConversationDisplayName(conversation)

								return (
									<button
										key={conversation.metadata.chatId}
										onClick={() => setActiveConversation(conversation)}
										className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 group ${
											isActive ? 'bg-surface-active' : 'hover:bg-surface-elevated'
										}`}
									>
										{/* Avatar */}
										<div
											className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border ${
												isActive ? 'bg-brand-primary/10 border-brand-primary/20' : 'bg-surface-active border-border'
											}`}
										>
											{conversation.metadata.isGroup ? (
												<Users className="h-4 w-4 text-muted-foreground" />
											) : (
												<User className="h-4 w-4 text-muted-foreground" />
											)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-0.5">
												<span className="text-sm font-medium text-foreground truncate">{displayName}</span>
												{lastMessage && (
													<span className="text-xs text-muted-foreground shrink-0 ml-2">{formatTimestamp(lastMessage.timestamp)}</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground truncate">
												{lastMessage
													? lastMessage.text
														? lastMessage.text
														: lastMessage.attachments.length > 0
															? `📎 ${lastMessage.attachments[0].transferName || 'Attachment'}`
															: '(no content)'
													: `${conversation.messages.length} message${conversation.messages.length === 1 ? '' : 's'}`}
											</p>
										</div>
									</button>
								)
							})}
						</div>
					</ScrollArea>
				</div>

				{/* Message Thread */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{activeConversation === null ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
							<MessageSquare className="h-12 w-12 opacity-20" />
							<div>
								<p className="font-medium">Select a conversation</p>
								<p className="text-sm opacity-60 mt-1">Choose from the list on the left</p>
							</div>
						</div>
					) : (
						<>
							{/* Thread Header */}
							<div className="flex items-center gap-3 px-6 h-14 border-b border-border shrink-0">
								<div className="h-8 w-8 rounded-full bg-surface-active border border-border flex items-center justify-center">
									{activeConversation.metadata.isGroup ? (
										<Users className="h-4 w-4 text-muted-foreground" />
									) : (
										<User className="h-4 w-4 text-muted-foreground" />
									)}
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground leading-tight">
										{getConversationDisplayName(activeConversation)}
									</p>
									<p className="text-xs text-muted-foreground">
										{activeConversation.messages.length.toLocaleString()} messages
										{activeConversation.metadata.isGroup && ` · ${activeConversation.metadata.participants.length} participants`}
									</p>
								</div>
							</div>

							{/* Messages */}
							<ScrollArea className="flex-1 px-6 py-4">
								<div className="flex flex-col gap-1.5 max-w-3xl mx-auto">
									{activeConversation.messages.map((message, index) => {
										const isFromMe = message.flags.isFromMe
										const previousMessage = index > 0 ? activeConversation.messages[index - 1] : null
										const showTimestamp =
											!previousMessage ||
											new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() > 1000 * 60 * 15

										return (
											<div key={message.id}>
												{showTimestamp && (
													<div className="flex justify-center my-4">
														<span className="text-xs text-muted-foreground bg-surface-active px-3 py-1 rounded-full">
															{new Date(message.timestamp).toLocaleString([], {
																month: 'short',
																day: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															})}
														</span>
													</div>
												)}
												<div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
													<div
														className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
															isFromMe
																? 'bg-brand-primary text-white rounded-br-sm'
																: 'bg-surface-elevated border border-border text-foreground rounded-bl-sm'
														}`}
													>
														{!isFromMe && activeConversation.metadata.isGroup && message.sender.handle && (
															<p className="text-xs font-medium text-brand-accent mb-1">{message.sender.handle}</p>
														)}
														{message.text && <p>{message.text}</p>}
														{message.attachments.length > 0 && (
															<div className="mt-1 space-y-1">
																{message.attachments.map((attachment, attachmentIndex) => (
																	<p
																		key={attachmentIndex}
																		className={`text-xs flex items-center gap-1 ${isFromMe ? 'text-white/70' : 'text-muted-foreground'}`}
																	>
																		📎 {attachment.transferName || attachment.mimeType || 'Attachment'}
																	</p>
																))}
															</div>
														)}
														{!message.text && message.attachments.length === 0 && (
															<p className={`italic text-xs ${isFromMe ? 'text-white/50' : 'text-muted-foreground'}`}>(empty message)</p>
														)}
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</ScrollArea>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default DashboardView
