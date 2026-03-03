import { datass } from 'datass'

const $isAddingBookmark = datass.boolean(false)
const $isSelectingRange = datass.boolean(false)
const $isViewingNotes = datass.boolean(false)

// hold alll the json for all of the text messages
// in the active thread. this is what the
// TextMessageThread component will read from
// and write to when messages are updated with
// bookmarks or notes.
const $messages = datass.array([])

// holds all the events that have occured (i.e the
// user added a bookmark, the user removed a bookmark,
// the user added a note, etc). this will be used later
// when we allow a user see a notifications pane that
// shows like "other user added a note [2 days ago]" etc..."
const $events = datass.array([])

// ===================================
// -----------------------------------

type OpenBookmarkEditorEventT = {
	messageId: number
}

// When the user has NO bookamrks on a message, clicking the
// bookmark icon will need to open the bookmark editor UI with
// an empty title and do not render the delete action. Confirming
// the ui will commit the bookmark to the message object in $messages.
// If user does have bookmark on the message, the bookmark icon button will
// open the same ui but with title filled in and the delete action rendered.
// When the user clicks the delete action, it will remove the bookmark
// from the message object in $messages. Clicking the check icon button
// will update the bookmark title in the message object in $messages.
const openBookmarkEditor = (event: OpenBookmarkEditorEventT) => {
	$isAddingBookmark.set(true)
}

// I guess this would be used if the user clicks the cancel button in
// the bookmark editor UI or clicks outside of the UI to close it without saving?
// Or would this be better off being local state to the message? Idk help me
// out im just spitballing how I feel this should all work...
const stopAddingBookmark = () => {
	$isAddingBookmark.set(false)
}

type AddBookmarkEventT = {
	bookmarkId?: string
	messageId: string
	title: string
	userId: string
}

// commit a bookmark. If existing bookarm, update it. If
// new bookmark, append it. If new, generate an id for it
// and append. If existing, find it by id and update it.
// Either way, always update or add timestamp.
const addBookmark = (event: AddBookmarkEventT) => {
	$messages.set.by((draft) => {
		draft.hasBookmarks = true

		if (event.bookmarkId) {
			// find the existing bookmark by id
			// update the bookmark title and timestamp
			// return
		}

		// create a new bookmark object with id, title, timestamp, and userId
		// append the new bookmark to the message's bookmarks array
	})
}

type RemoveBookmarkEventT = {
	bookmarkId: string
	messageId: string
}

const removeBookmark = (event: RemoveBookmarkEventT) => {
	$messages.set.by((draft) => {
		// find the message that matches messageId
		// find and remove the bookmark matching event.bookmarkId
	})
}

// for when user selects / activates a thread.
const populateThread = (messages: []) => {
	$messages.set(messages)
}

export const store = {
	$messages,
	$events,
	$isSelectingRange,
	$isViewingNotes,
	$isAddingBookmark,
	openBookmarkEditor,
	stopAddingBookmark,
	addBookmark,
	removeBookmark,
	populateThread
}
