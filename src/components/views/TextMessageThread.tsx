'use client'

import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { format } from 'date-fns'
import { Search, User, Users, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getConversationDisplayName } from '@/lib/conversation-utils'
import { TextMessage } from './TextMessage'

interface TextMessageThreadProps {
	conversation: ThreadT
}

const TextMessageThread = ({ conversation }: TextMessageThreadProps) => {
	const parentRef = useRef<HTMLDivElement>(null)
	const messages = conversation.messages
	const count = messages.length

	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<number[]>([]) // Indices of messages
	const [isSearchOpen, setIsSearchOpen] = useState(false)

	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 80, // Estimate row height
		overscan: 10 // Number of items to render outside the viewport
	})

	// Scroll to bottom when conversation changes
	useLayoutEffect(() => {
		if (count > 0) {
			virtualizer.scrollToIndex(count - 1, { align: 'end' })
		}
	}, [conversation.chatId])

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchResults([])
			setIsSearchOpen(false)
			return
		}

		const query = searchQuery.toLowerCase()
		const results: number[] = []

		messages.forEach((msg, index) => {
			if (!msg.text) return

			// Filter out reaction messages like "Loved 'some text'"
			const isReaction = /^(Loved|Liked|Disliked|Laughed at|Emphasized|Questioned) [“"‘'].+[”"’']$/i.test(msg.text)

			if (!isReaction && msg.text.toLowerCase().includes(query)) {
				results.push(index)
			}
		})

		setSearchResults(results)
		setIsSearchOpen(true)
	}, [searchQuery, messages])

	const handleResultClick = (index: number) => {
		virtualizer.scrollToIndex(index, { align: 'center' })
		setIsSearchOpen(false)
	}

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Thread Header */}
			<div className="flex items-center gap-3 px-6 h-14 border-b border-border shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
				<div className="h-8 w-8 rounded-full bg-surface-active border border-border flex items-center justify-center">
					{conversation.isGroup ? (
						<Users className="h-4 w-4 text-muted-foreground" />
					) : (
						<User className="h-4 w-4 text-muted-foreground" />
					)}
				</div>
				<div>
					<p className="text-sm font-semibold text-foreground leading-tight">{getConversationDisplayName(conversation)}</p>
					<p className="text-xs text-muted-foreground">
						{conversation.messages.length.toLocaleString()} messages
						{conversation.isGroup && ` · ${conversation.participants.length} participants`}
					</p>
				</div>

				<div className="ml-auto">
					<Popover open={isSearchOpen && searchResults.length > 0} onOpenChange={setIsSearchOpen}>
						<PopoverTrigger asChild>
							<div className="relative w-[300px]">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
								<Input
									placeholder="Search in conversation..."
									className="pl-9 h-9 bg-surface-elevated border-border focus-visible:ring-1"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onFocus={() => {
										if (searchQuery.trim().length > 0) setIsSearchOpen(true)
									}}
								/>
								{searchQuery && (
									<button
										onClick={(e) => {
											e.stopPropagation()
											setSearchQuery('')
											setIsSearchOpen(false)
										}}
										className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>
						</PopoverTrigger>
						<PopoverContent
							className="w-[300px] p-0 overflow-hidden"
							align="end"
							sideOffset={8}
							onOpenAutoFocus={(e) => e.preventDefault()}
						>
							<div className="max-h-[300px] overflow-y-auto custom-scrollbar">
								<div className="p-2 border-b border-border bg-surface-elevated/50">
									<p className="text-xs font-medium text-muted-foreground px-2">
										{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
									</p>
								</div>
								{searchResults.map((index) => {
									const message = messages[index]
									return (
										<button
											key={index}
											onClick={() => handleResultClick(index)}
											className="w-full text-left px-4 py-3 hover:bg-surface-active transition-colors border-b last:border-0 border-border/50 group"
										>
											<div className="flex justify-between items-start gap-2 mb-1">
												<span className={`text-xs font-medium ${message.flags.isFromMe ? 'text-brand-primary' : 'text-foreground'}`}>
													{message.flags.isFromMe ? 'You' : message.sender.handle || 'Them'}
												</span>
												<span className="text-[10px] text-muted-foreground whitespace-nowrap">
													{format(new Date(message.timestamp), 'MMM d, h:mm a')}
												</span>
											</div>
											<p className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-2 break-words leading-snug">
												{message.text}
											</p>
										</button>
									)
								})}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<div
				ref={parentRef}
				className="flex-1 w-full overflow-y-auto px-16 contain-strict scrollbar-hide"
				// Hide default scrollbar but keep functionality
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none'
				}}
			>
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative'
					}}
				>
					{virtualizer.getVirtualItems().map((virtualItem) => {
						const message = messages[virtualItem.index]
						const previousMessage = virtualItem.index > 0 ? messages[virtualItem.index - 1] : null
						const getMessageTimestamp = () => new Date(message.timestamp).getTime()
						const getPreviousMessageTimestamp = () => (previousMessage ? new Date(previousMessage.timestamp).getTime() : 0)

						// Timestamp logic
						const timeDiff = previousMessage ? getMessageTimestamp() - getPreviousMessageTimestamp() : 0

						const showTimestamp = !previousMessage || timeDiff > 1000 * 60 * 15 // 15 mins

						return (
							<div
								key={virtualItem.key}
								data-index={virtualItem.index}
								ref={virtualizer.measureElement}
								className="absolute top-0 left-0 w-full py-1"
								style={{
									transform: `translateY(${virtualItem.start}px)`
								}}
							>
								{showTimestamp && (
									<div className="flex justify-center my-4">
										<span className="text-xs text-muted-foreground bg-surface-active/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm">
											{format(new Date(message.timestamp), 'MMM d, h:mm a')}
										</span>
									</div>
								)}

								<TextMessage message={message} isGroup={conversation.isGroup} />
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default TextMessageThread
