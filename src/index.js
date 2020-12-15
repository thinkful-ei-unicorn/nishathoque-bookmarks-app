import $ from "jquery"
import api from "./api"
import "./styles.css"
import store from "./store.js"
import bookmark from "./bookmark.js"

function main(){
	api.getBookmark().then((bookmarks) => {
		bookmarks.forEach((bookmark) => store.addBookmark(bookmark))
		bookmark.render()
	})
	bookmark.bindEventListeners()
	bookmark.render()
}

$(main)