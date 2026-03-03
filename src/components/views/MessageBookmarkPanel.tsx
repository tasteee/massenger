'use client'

import React, { useState, useEffect } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { store, CURRENT_USER_ID } from '@/lib/store'
import { cn } from '@/lib/utils'

type MessageBookmarkPanelPropsT = {
	message: MessageT
	onClose: () => void
}

export const MessageBookmarkPanel = ({ message, onClose }: MessageBookmarkPanelPropsT) => {
	const currentBookmark = message.bookmarks?.find((b) => b.userId === CURRENT_USER_ID)
	const [title, setTitle] = useState(currentBookmark?.title || '')

	const handleSave = () => {
		if (!title.trim()) return
		store.addBookmark(message.id, title)
		onClose()
	}

	const handleDelete = () => {
		store.removeBookmark(message.id)
		onClose()
	}

	return (
		<div className="w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
			<div className="flex items-center gap-2 p-2 bg-surface-base border border-border rounded-lg shadow-sm">
				<input
					autoFocus
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Bookmark title..."
					className="flex-1 bg-transparent border-none text-sm focus:outline-none px-2 text-foreground placeholder:text-muted-foreground"
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSave()
						if (e.key === 'Escape') onClose()
					}}
				/>

				<div className="flex items-center gap-1 border-l border-border pl-2">
					<button
						onClick={handleSave}
						className="p-1.5 rounded-md hover:bg-surface-active text-muted-foreground hover:text-foreground transition-colors"
						title="Save Bookmark"
					>
						<Check className="w-4 h-4" />
					</button>

					{currentBookmark && (
						<button
							onClick={handleDelete}
							className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
							title="Delete Bookmark"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					)}

					<button
						onClick={onClose}
						className="p-1.5 rounded-md hover:bg-surface-active text-muted-foreground hover:text-foreground transition-colors"
						title="Cancel"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	)
}
