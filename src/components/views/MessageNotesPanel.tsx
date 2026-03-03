'use client'

import React, { useState } from 'react'
import { Plus, ChevronLeft, Trash2, Pencil, Check, X } from 'lucide-react'
import { store, CURRENT_USER_ID } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

type MessageNotesPanelPropsT = {
	message: MessageT
	onClose: () => void
}

type ViewStateT = 'LIST' | 'DETAIL' | 'CREATE' | 'EDIT'

export const MessageNotesPanel = ({ message, onClose }: MessageNotesPanelPropsT) => {
	const [view, setView] = useState<ViewStateT>('LIST')
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
	const [editText, setEditText] = useState('')

	const notes = message.notes || []
	const selectedNote = notes.find((n) => n.id === selectedNoteId)

	// Handlers

	const handleCreate = () => {
		if (!editText.trim()) return
		store.addNote(message.id, editText)
		setEditText('')
		setView('LIST')
	}

	const handleUpdate = () => {
		if (!selectedNoteId || !editText.trim()) return
		store.editNote(message.id, selectedNoteId, editText)
		setEditText('')
		setView('DETAIL') // Go back to viewing detail
	}

	const handleDelete = () => {
		if (!selectedNoteId) return
		store.removeNote(message.id, selectedNoteId)
		setSelectedNoteId(null)
		setView('LIST')
	}

	const startCreating = () => {
		setEditText('')
		setView('CREATE')
	}

	const startEditing = () => {
		if (!selectedNote) return
		setEditText(selectedNote.text)
		setView('EDIT')
	}

	const openNote = (noteId: string) => {
		setSelectedNoteId(noteId)
		setView('DETAIL')
	}

	const goBack = () => {
		if (view === 'EDIT') {
			setView('DETAIL')
		} else {
			setView('LIST')
			setSelectedNoteId(null)
		}
	}

	// Sub-components

	const renderList = () => (
		<div className="flex flex-col gap-2 p-2">
			{notes.length === 0 ? (
				<div className="text-center py-4 text-muted-foreground text-xs italic">No notes yet.</div>
			) : (
				<div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
					{notes.map((note) => (
						<button
							key={note.id}
							onClick={() => openNote(note.id)}
							className="text-left p-2 rounded-lg bg-surface-base hover:bg-surface-active border border-border transition-colors group"
						>
							<p className="text-sm line-clamp-2 text-foreground mb-1">{note.text}</p>
							<div className="flex items-center justify-between text-[10px] text-muted-foreground">
								<span>{formatDistanceToNow(note.createdDate, { addSuffix: true })}</span>
								{note.userId === CURRENT_USER_ID && (
									<span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">My Note</span>
								)}
							</div>
						</button>
					))}
				</div>
			)}

			<button
				onClick={startCreating}
				className="flex items-center justify-center gap-2 p-2 mt-1 rounded-lg border border-dashed border-border hover:bg-surface-active text-muted-foreground hover:text-foreground text-xs transition-colors"
			>
				<Plus className="w-3 h-3" />
				Add Note
			</button>
		</div>
	)

	const renderDetail = () => {
		if (!selectedNote) return null
		const isMyNote = selectedNote.userId === CURRENT_USER_ID

		return (
			<div className="flex flex-col h-full p-2">
				<div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
					<button
						onClick={goBack}
						className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						<ChevronLeft className="w-3 h-3" />
						Back
					</button>
					<span className="text-[10px] text-muted-foreground">
						{formatDistanceToNow(selectedNote.createdDate, { addSuffix: true })}
					</span>
				</div>

				<div className="flex-1 overflow-y-auto mb-2 text-sm text-foreground whitespace-pre-wrap">{selectedNote.text}</div>

				{isMyNote && (
					<div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
						<button
							onClick={startEditing}
							className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-surface-active text-muted-foreground hover:text-foreground text-xs transition-colors"
						>
							<Pencil className="w-3 h-3" />
							Edit
						</button>
						<button
							onClick={handleDelete}
							className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 text-xs transition-colors"
						>
							<Trash2 className="w-3 h-3" />
							Delete
						</button>
					</div>
				)}
			</div>
		)
	}

	const renderEditor = (isNew: boolean) => (
		<div className="flex flex-col h-full p-2">
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs font-medium text-foreground">{isNew ? 'New Note' : 'Edit Note'}</span>
				<button
					onClick={() => (isNew ? setView('LIST') : setView('DETAIL'))}
					className="p-1 rounded-md hover:bg-surface-active text-muted-foreground hover:text-foreground transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			</div>

			<textarea
				autoFocus
				value={editText}
				onChange={(e) => setEditText(e.target.value)}
				placeholder="Write your note here..."
				className="flex-1 w-full bg-surface-base border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none placeholder:text-muted-foreground mb-2"
				rows={4}
			/>

			<div className="flex justify-end gap-2">
				<button
					onClick={isNew ? handleCreate : handleUpdate}
					disabled={!editText.trim()}
					className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<Check className="w-3 h-3" />
					Save
				</button>
			</div>
		</div>
	)

	return (
		<div className="w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
			<div className="bg-surface-elevated border border-border rounded-xl shadow-sm overflow-hidden">
				{view === 'LIST' && renderList()}
				{view === 'DETAIL' && renderDetail()}
				{view === 'CREATE' && renderEditor(true)}
				{view === 'EDIT' && renderEditor(false)}
			</div>
		</div>
	)
}
