const store = {
	bookmarks: [],
	adding: false,
	error: null,
	filter: 0,
}

//Return bookmark with matching id
function findById(id) {
	let foundBookmark = this.store.bookmarks.find(
		(currentBookmark) => currentBookmark.id === id
	)
	return foundBookmark
}

//Add bookmark to list
function addBookmark(bookmark) {
	this.store.bookmarks.push(bookmark)
}

//Delete bookmark with matching id
function findAndDelete(id) {
	this.store.bookmarks = this.store.bookmarks.filter(
		(currentBookmark) => currentBookmark.id !== id
	)
}

//Filter bookmarks by rating
function filterByRatings() {
	let filteredList = this.store.bookmarks.filter(
		(currentBookmark) => currentBookmark.rating >= this.store.filter
	)
	return filteredList
}

//Defines store filter
function setFilter(rating) {
    this.store.filter = rating
}
function setError(error) {
    this.error = error;
}
export default {
	store,
	addBookmark,
	findById,
	findAndDelete,
	filterByRatings,
    setFilter,
    setError
}