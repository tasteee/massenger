'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { Bookmark, Pen, Share, Play, Image as ImageIcon, Music, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'

type TextMessagePropsT = {
	message: MessageT
	isGroup: boolean
	showTimestamp?: boolean
}

type AttachmentPropsT = {
	attachment: AttachmentT
	isFromMe: boolean
	className?: string
}

const MemoizedAttachment = memo(({ attachment, isFromMe, className }: AttachmentPropsT) => {
	const type = attachment.mimeType || ''
	let icon = <Paperclip className="w-8 h-8 opacity-50" />
	let label = 'Attachment'

	if (type.startsWith('image/')) {
		icon = <ImageIcon className="w-8 h-8 opacity-50" />
		label = 'Image'
	} else if (type.startsWith('video/')) {
		icon = <Play className="w-8 h-8 opacity-50 ml-1" />
		label = 'Video'
	} else if (type.startsWith('audio/')) {
		icon = <Music className="w-8 h-8 opacity-50" />
		label = 'Audio'
	}

	return (
		<div className={cn('MemoizedAttachment relative group/attachment', className)}>
			<div
				className={cn(
					'flex flex-col items-center justify-center gap-2 p-6 rounded-xl w-[150px] h-[150px] border select-none',
					isFromMe
						? 'bg-brand-primary/10 dark:bg-white/10 border-brand-primary/25 dark:border-white/20 text-foreground'
						: 'bg-surface-active border-border text-foreground'
				)}
			>
				{icon}
				<span className="text-xs font-medium truncate max-w-full px-2">{attachment.transferName || label}</span>
			</div>

			{/* Attachment Reactions */}
			{attachment.reactions && attachment.reactions.length > 0 && (
				<div
					className={cn(
						'absolute top-1 z-30 flex -space-x-1 transition-transform hover:scale-110 cursor-help',
						isFromMe ? 'left-1' : 'right-1'
					)}
				>
					{attachment.reactions.map((reaction, i) => (
						<div
							key={i}
							className={cn(
								'flex items-center justify-center h-[24px] min-w-[24px] px-1 bg-surface-elevated border border-border rounded-full shadow-md text-xs select-none',
								reaction.isFromMe ? 'z-20' : 'z-10'
							)}
							title={reaction.isFromMe ? 'Reacted by you' : 'Reacted by them'}
						>
							{reaction.emoji}
						</div>
					))}
				</div>
			)}
		</div>
	)
})
MemoizedAttachment.displayName = 'MemoizedAttachment'

const TextMessage = memo((props: TextMessagePropsT) => {
	const isFromMe = props.message.flags.isFromMe
	const hoverRotateClass = isFromMe ? 'hover:rotate-0.75' : 'hover:-rotate-0.75'

	return (
		<div className={cn('relative flex w-full mb-1', isFromMe ? 'justify-end' : 'justify-start')}>
			<div
				className={cn(
					'group relative max-w-[70%] px-4 py-2 pl-[14px] rounded-2xl text-sm leading-relaxed transition-all duration-200 ease-out transform-gpu will-change-transform hover:scale-[1.02] shadow-sm cursor-default hover:z-10',
					hoverRotateClass,
					isFromMe
						? 'bg-brand-primary/15 dark:bg-brand-primary/[0.75] border border-brand-primary/20 dark:border-brand-primary/25 text-foreground rounded-br-sm origin-bottom-right'
						: 'bg-surface-elevated border border-border text-foreground rounded-bl-sm origin-bottom-left'
				)}
			>
				{false && !isFromMe && props.isGroup && props.message.sender.handle && (
					<p className="text-xs font-medium text-brand-accent mb-1 truncate">{props.message.sender.handle}</p>
				)}

				{props.message.attachments && props.message.attachments.length > 0 && (
					<div className="pt-2 w-full mb-3">
						{props.message.attachments.length === 1 ? (
							<MemoizedAttachment attachment={props.message.attachments[0]} isFromMe={isFromMe} />
						) : (
							<Carousel opts={{ align: 'start' }} className="AttachmentCarousel w-full">
								<CarouselContent className="-ml-2">
									{props.message.attachments.map((attachment, index) => (
										<CarouselItem key={index} className="pl-2 basis-auto">
											<MemoizedAttachment attachment={attachment} isFromMe={isFromMe} />
										</CarouselItem>
									))}
								</CarouselContent>
								{props.message.attachments.length > 1 && (
									<>
										<CarouselPrevious className="AttachmentCarouselPrevious left-[-0.75rem] h-6 w-6 disabled:opacity-100 disabled:text-muted-foreground/75" />
										<CarouselNext className="AttachmentCarouselNext right-[-0.75rem] h-6 w-6 disabled:opacity-100 disabled:text-muted-foreground/75" />
									</>
								)}
							</Carousel>
						)}
					</div>
				)}

				{props.message.text && <p className="whitespace-pre-wrap break-words">{props.message.text}</p>}

				{!props.message.text && (!props.message.attachments || props.message.attachments.length === 0) && (
					<p className={cn('TextMessageText', 'italic text-xs', isFromMe ? 'text-white/50' : 'text-muted-foreground')}>
						(empty message)
					</p>
				)}

				{/* Reaction Badge */}
				{props.message.reactions && props.message.reactions.length > 0 && (
					<div
						className={cn(
							'TextMessageReactions',
							'absolute -top-3 z-30 transition-transform hover:scale-110 cursor-help flex -space-x-1',
							isFromMe ? '-left-2' : '-right-2'
						)}
					>
						{props.message.reactions.map((reaction, i) => (
							<div
								key={i}
								className={cn(
									'TextMessageReaction',
									'flex items-center justify-center h-[28px] min-w-[28px] px-1 bg-surface-elevated border border-border rounded-full shadow-md text-sm select-none',
									reaction.isFromMe ? 'z-20' : 'z-10'
								)}
								title={reaction.isFromMe ? 'Reacted by you' : 'Reacted by them'}
							>
								{reaction.emoji}
							</div>
						))}
					</div>
				)}

				{/* Timestamp — slides out from behind the bubble on hover */}
				<div
					className={cn(
						'absolute top-1/2 -translate-y-1/2 overflow-hidden w-max pointer-events-none',
						isFromMe ? 'right-full mr-3' : 'left-full ml-3'
					)}
				>
					<div
						className={cn(
							'transition-transform duration-300 ease-out',
							isFromMe
								? 'translate-x-full group-hover:translate-x-0 text-right'
								: '-translate-x-full group-hover:translate-x-0 text-left'
						)}
					>
						<p className="text-[10px] text-muted-foreground whitespace-nowrap leading-tight">
							{format(new Date(props.message.timestamp), 'MMMM d, yyyy')}
						</p>
						<p className="text-[10px] text-muted-foreground whitespace-nowrap leading-tight">
							{format(new Date(props.message.timestamp), 'h:mm a')}
						</p>
					</div>
				</div>

				{/* Action icons — vertically stacked on the outside edge, fade in on hover */}
				<div
					className={cn(
						'absolute top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out z-10 pointer-events-none group-hover:pointer-events-auto',
						isFromMe ? 'right-0 translate-x-full pl-2' : 'left-0 -translate-x-full pr-2'
					)}
				>
					<button className="p-1.5 rounded-full bg-surface-base border border-border text-muted-foreground hover:text-foreground hover:bg-surface-active shadow-sm transition-colors hover:scale-110 active:scale-95">
						<Bookmark className="w-3.5 h-3.5" />
					</button>
					<button className="p-1.5 rounded-full bg-surface-base border border-border text-muted-foreground hover:text-foreground hover:bg-surface-active shadow-sm transition-colors hover:scale-110 active:scale-95">
						<Pen className="w-3.5 h-3.5" />
					</button>
					<button className="p-1.5 rounded-full bg-surface-base border border-border text-muted-foreground hover:text-foreground hover:bg-surface-active shadow-sm transition-colors hover:scale-110 active:scale-95">
						<Share className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>
		</div>
	)
})

TextMessage.displayName = 'TextMessage'

export { TextMessage }
