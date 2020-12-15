import $ from "jquery"
import store from "./store.js"
import api from "./api.js"

//generates add new bookmark button, dropdown option to filter by rating, and container for the list of saved bookmarks
function generateMain(){
	let template = `
		<header>
			<h1 style="text-align:center">My Bookmarks</h1>
		</header>     
		<div class ="error-container"></div>
		<section id= "mainPage">
			<div id= "container">
                <div id="addNewBookmark">
                    <h4> Add New Bookmark</h4>
					<button type = "button" id ="add-new-button">Create a Bookmark</button>
                </div>
                <div class="dropdownContainer">
                    <h4> Filter By Stars </h4>
				<form name="filterByStars" id="filterBookMark" action="/action_page.php">
					<select name="starRatings" id="starRatings">
						<option value="" disabled selected>Filter</option>
						<option value="1">1 Star</option>
						<option value="2">2 Stars</option>
						<option value="3">3 Stars</option>
						<option value="4">4 Stars</option>
						<option value="5">5 Stars</option>
					</select>	
					<input id ="filterSubmit" type="submit" value="Submit">  
				</form>
				</div>
			</div>
				<div id = "mainForm" class ="hidden">
					<form id="createBookmark">
						<fieldset>
						<label for ="title">Title:</label><br>
						<input type ="text" id ="title" placeholder ="Title of page" required><br><br>
						<label for = "link">URL Link:</label><br>
						<input type ="text" id="link" minlength = "5" pattern = "https?://.+" placeholder ="https://" required><br><br>
						<label for ="bookmarkDescription">Description:</label><br>
						<textarea id ="bookmarkDescription" name ="Description" rows="10" cols="30" placeholder="Your description goes here."></textarea><br><br>
						<label for="rating">Rating:  
							<select name="rating" id="rating">
							<option value="" disabled selected>Rating</option>
								<option value="1">1 Star</option>
								<option value="2">2 Stars</option>
								<option value="3">3 Stars</option>
								<option value="4">4 Stars</option>
								<option value="5">5 Stars</option>
							</select>
						</label><br><br>
						<button id="back-main-page"> Cancel </button>
						<input type="submit" id="newBookmark" value="Add Bookmark"><br><br>	
						</fieldset>
					</form>
				</div>
				<br>
			<div class ="myBookmarks"><h2>My Bookmarks</h2>
				<div class ="js-bookmark-list"></div>
			</div>
		</section>`
	return template
}

//generates the list of added bookmarks, with ability to expand with extra details
function generateBookmarkElement(bookmark){
    console.log(bookmark)
	let rating
	if (bookmark.rating === null){
		rating = "Was not Rated"
	}else {
		rating = bookmark.rating
	}

	let description
	if (bookmark.desc === null){
		description = "No Description"
	}else {
		description = bookmark.desc
	}
	let bookmarkItem = `<div class ="container js-bookmark-item" data-item-id="${bookmark.id}">    
							<p>Title: ${bookmark.title}</p>
							<p>Rating: ${rating}</p>
							<div ${bookmark.expanded === true ? "" : "style = 'display: none'"}>  
								<ul class style='list-style-type:none'>
									<li> Visit Site: <a href="${bookmark.url}" target = "_blank">${bookmark.url}</a></li>
									<li> Description: ${description}</li>
								</ul>
							</div>
							<div>
							<button type="button" id ="deleteBookmark">Delete</button>
							<button type="button" id ="bookmarkItemExpanded">+</button></div><br>
							</div>
						</div>`
	return bookmarkItem
}

function generateBookmarkString(bookmark){
	let bookmarkList = bookmark.map((bookmarklist) => generateBookmarkElement(bookmarklist))
	return bookmarkList.join("")
}

function getBookmarkIdFromElement(bookmarkElement) {
	return $(bookmarkElement).closest(".js-bookmark-item").data("item-id")
}

function generateError(message){
	return `<section class="error-content">
				<button id ="cancel-error">x</button>
				<p>${message}</p>
			</section>`
}

function renderError(){
	if (store.error) {
		const el = generateError(store.error)
		$(".error-container").html(el)
	} else {
		$(".error-container").empty()
	}
}

//all handle functions are event listeners
function handleCreateBookmark(){
	$("main").on("click", "#add-new-button", (event) => {
		event.preventDefault()
		store.store.adding = true
		render()
	})
}

function handleSaveBookmark(){
	$("main").on("submit", "#createBookmark", (event) => {
		event.preventDefault()
		store.store.adding=false
		let userBookmarkInfo = {
			title: $("#title").val(),
			url: $("#link").val(),
			desc: $("#bookmarkDescription").val(),
			rating: $("#rating").val(),
		}
        api.createBookmark(userBookmarkInfo)
			.then((bookmarkData) => {
				store.addBookmark(bookmarkData)
				render()
			})
			.catch((error) => {
				store.setError(error.message)
				renderError()
			})
	})
}

function handleCancelButton(){
    $("main").on("click","#back-main-page", (event) => {
		event.preventDefault()
		store.store.adding = false
		render()
    })
}

function handleFilterBookmark(){
	$("main").on("submit", "#filterBookMark", (event) => {
		event.preventDefault()
		store.setFilter($("#starRatings").val())
		render()
	})
}

function handleDeleteBookmark(){
	$("main").on("click", "#deleteBookmark", (event) => {
		event.preventDefault()
		let bookmarkId = getBookmarkIdFromElement(event.currentTarget)
		api.deleteBookmark(bookmarkId)
			.then(() => {
				store.findAndDelete(bookmarkId)
				render()
			})
			.catch((error) => {
				store.setError(error.message)
				renderError()
			})
	})
}

function handleDetailsButton(){
	$("main").on("click", "#bookmarkItemExpanded", (event) => {
		event.preventDefault()
		let bookmarkId = getBookmarkIdFromElement($(event.currentTarget))
		let bookmark = store.findById(bookmarkId)
		bookmark.expanded = !bookmark.expanded
		render()
	})
}

//renders the main page
function render(){
	$("main").html(generateMain())
	if (store.store.adding === true) {
		$(".hidden").removeClass()
	}
	generateError()
	const filteredList = store.filterByRatings()
	const bookmarkString = generateBookmarkString(filteredList)
	$(".js-bookmark-list").html(bookmarkString)
}

function bindEventListeners(){
	handleCreateBookmark()
	handleCancelButton()
	handleSaveBookmark()
	handleFilterBookmark()
	handleDeleteBookmark()
	handleDetailsButton()
}

export default {
	render,
	bindEventListeners
}