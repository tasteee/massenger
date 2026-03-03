'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquare, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getTotalMessageCount, getConversationDisplayName, getLastMessage, formatTimestamp } from '@/lib/conversation-utils'
import TextMessageThread from './TextMessageThread'
import { $activeThreadId, $threads, $view, store, useActiveThread } from '@/lib/store'

const DashboardView = () => {
	const threads = $threads.use()
	const activeThread = useActiveThread()

	const sortedThreads = [...threads].sort((threadA, threadB) => {
		const lastMessageA = getLastMessage(threadA)
		const lastMessageB = getLastMessage(threadB)
		if (!lastMessageA) return 1
		if (!lastMessageB) return -1
		return new Date(lastMessageB.timestamp).getTime() - new Date(lastMessageA.timestamp).getTime()
	})

	return (
		<div className="w-full h-screen flex flex-col bg-background">
			{/* Top Bar */}
			<div className="flex items-center gap-4 px-6 h-14 border-b border-border shrink-0">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => $view.set('hero')}
					className="text-muted-foreground hover:text-foreground gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>
				<div className="h-4 w-px bg-border" />
				<span className="text-sm font-semibold text-foreground">massenger</span>
				<span className="text-xs text-muted-foreground ml-1">
					{threads.length} conversations · {getTotalMessageCount(threads).toLocaleString()} messages
				</span>
			</div>

			{/* Main Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Conversation List */}
				<div className="w-[360px] border-r border-border flex flex-col bg-surface-base shrink-0 overflow-hidden">
					<ScrollArea className="ConversationsScrollArea flex-1 w-full">
						<div className="p-2 space-y-0.5">
							{sortedThreads.map((thread) => {
								const lastMessage = getLastMessage(thread)
								const isActive = activeThread?.chatId === thread.chatId
								const displayName = getConversationDisplayName(thread)

								return (
									<button
										key={thread.chatId}
										onClick={() => store.setActiveThread(thread)}
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
											{thread.isGroup ? (
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
													: `${thread.messages.length} message${thread.messages.length === 1 ? '' : 's'}`}
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
					{activeThread === null ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
							<MessageSquare className="h-12 w-12 opacity-20" />
							<div>
								<p className="font-medium">Select a conversation</p>
								<p className="text-sm opacity-60 mt-1">Choose from the list on the left</p>
							</div>
						</div>
					) : (
						<TextMessageThread />
					)}
				</div>
			</div>
		</div>
	)
}

export default DashboardView
