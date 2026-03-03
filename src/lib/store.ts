import { datass } from 'datass'

export const $isSelectingRange = datass.boolean(false)

// State
export const $threads = datass.array<ThreadT>([]) // All threads
export const $messages = datass.array<MessageT>([]) // All messages in active thread
export const $activeThreadId = datass.number(0) // Active thread ID
export const $events = datass.array<any>([]) // Event log
export const $thread = datass.object({}) // Active thread
export const $view = datass.string('hero') // 'hero' | 'scanning' | 'list' | 'extracting' | 'complete' | 'dashboard'
// Track which message has an open panel and which type
// Format: `${messageId}-${type}` e.g. "123-bookmark" or "123-notes"
export const $activePanelId = datass.string('')

export const CURRENT_USER_ID = 'me'

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const setActiveThread = (thread: ThreadT | null) => {
	if (!thread) {
		$thread.set({})
		$messages.set([])
		$activeThreadId.set(0)
		return
	}

	$thread.set(thread)
	$messages.set(thread.messages)
	$activeThreadId.set(thread.chatId)
	$activePanelId.set('') // reset panel state

	console.log(`Active thread set to: ${thread.displayName || thread.chatIdentifier} (${thread.chatId})`)
	console.log(`Loaded ${thread.messages.length} messages into state.`)
}

const populateMessages = (messages: MessageT[]) => {
	$messages.set(messages)
}

export const useActiveThread = () => {
	const activeThreadId = $activeThreadId.use()
	const threads = $threads.use()
	return threads.find((thread) => thread.chatId === activeThreadId) || null
}

// Bookmarks
// -----------------------------------------------------------------------------

const addBookmark = (messageId: number, title: string) => {
	$messages.set.by((draft) => {
		const msg = draft.find((m) => m.id === messageId)
		if (!msg) return

		// Initialize if undefined (safety)
		if (!msg.bookmarks) msg.bookmarks = []

		const existingIndex = msg.bookmarks.findIndex((b) => b.userId === CURRENT_USER_ID)
		const newBookmark: BookmarkT = {
			title,
			userId: CURRENT_USER_ID,
			createdDate: Date.now()
		}

		if (existingIndex >= 0) {
			msg.bookmarks[existingIndex] = newBookmark
		} else {
			msg.bookmarks.push(newBookmark)
		}

		msg.hasBookmarks = msg.bookmarks.length > 0

		// Close panel after saving
		$activePanelId.set('')
	})
}

const removeBookmark = (messageId: number) => {
	$messages.set.by((draft) => {
		const msg = draft.find((m) => m.id === messageId)
		if (!msg) return

		if (!msg.bookmarks) return

		msg.bookmarks = msg.bookmarks.filter((b) => b.userId !== CURRENT_USER_ID)
		msg.hasBookmarks = msg.bookmarks.length > 0

		// Close panel after deleting
		$activePanelId.set('')
	})
}

// Notes
// -----------------------------------------------------------------------------

const addNote = (messageId: number, text: string) => {
	$messages.set.by((draft) => {
		const msg = draft.find((m) => m.id === messageId)
		if (!msg) return

		if (!msg.notes) msg.notes = []

		const newNote: NoteT = {
			id: Math.random().toString(36).substring(2, 9),
			text,
			userId: CURRENT_USER_ID,
			createdDate: Date.now()
		}

		msg.notes.push(newNote)
		msg.hasNotes = msg.notes.length > 0
	})
}

const editNote = (messageId: number, noteId: string, text: string) => {
	$messages.set.by((draft) => {
		const msg = draft.find((m) => m.id === messageId)
		if (!msg) return

		const note = msg.notes?.find((n) => n.id === noteId)
		if (note && note.userId === CURRENT_USER_ID) {
			note.text = text
		}
	})
}

const removeNote = (messageId: number, noteId: string) => {
	$messages.set.by((draft) => {
		const msg = draft.find((m) => m.id === messageId)
		if (!msg) return

		if (!msg.notes) return

		msg.notes = msg.notes.filter((n) => n.id !== noteId)
		msg.hasNotes = msg.notes.length > 0
	})
}

// Panels
// -----------------------------------------------------------------------------

const togglePanel = (messageId: number, type: 'bookmark' | 'notes') => {
	const current = $activePanelId.state
	const target = `${messageId}-${type}`

	if (current === target) {
		$activePanelId.set('')
	} else {
		$activePanelId.set(target)
	}
}

const closePanel = () => {
	$activePanelId.set('')
}

export const store = {
	$messages,
	$threads,
	$events,
	$isSelectingRange,
	$activePanelId,
	$thread,
	$activeThreadId,
	setActiveThread,
	populateMessages,
	addBookmark,
	removeBookmark,
	addNote,
	editNote,
	removeNote,
	togglePanel,
	closePanel
}
