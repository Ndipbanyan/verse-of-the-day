const verseElement = document.getElementById('verse')
const versionElement = document.getElementById('versions')
const prayerElement = document.querySelector('.prayer')
const scriptureTextElement = document.getElementById('scripture-text')
const locationElement = document.getElementById('place-name')
let versions
let backgroundData
let scriptureData
const baseUrl = 'https://yvotd-backend.herokuapp.com'
const unsplashUrl = 'https://api.unsplash.com/photos/random?orientation=landscape&query=landscape'

function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText)
	}

	return response
}

async function getBackgroundImage() {
	const headers = new Headers()

	const key = await fetch(`${baseUrl}/keys`)
	let keyjson = await validateResponse(key).json()

	headers.append('Authorization', `Client-ID ${keyjson.unsplash}`)

	let response = await fetch(unsplashUrl, { headers })

	const json = await validateResponse(response).json()
	response = await fetch(json.urls.raw + '&q=85&w=2000')
	json.blob = await validateResponse(response).blob()

	return json
}

async function nextBackground() {
	try {
		const backgroundImage = await getBackgroundImage()

		// the FileReader object lets you read the contents of
		// files or raw data buffers. A blob object is a data buffer
		const fileReader = new FileReader()

		// The readAsDataURL method is used to read
		// the contents of the specified blob object
		// Once finished, the binary data is converted to
		// a Base64 string
		fileReader.readAsDataURL(backgroundImage.blob)
		fileReader.addEventListener('load', (event) => {
			// The `result` property is the Base64 string
			const { result } = event.target
			// This string is stored on a `base64` property
			// in the image object
			backgroundImage.base64 = result

			// The backgroundImage object is subsequently stored in
			// the browser's local storage
			document.body.setAttribute('style', `background-image: url(${backgroundImage.base64});`)
			locationElement.textContent = backgroundImage.location.name ? backgroundImage.location.name : ''
			let timeNow = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
			timeNow = timeNow.split(',')
			timeNow = timeNow[0]
			const storeData = { background: backgroundImage, timestamp: timeNow }
			localStorage.setItem('background', JSON.stringify(storeData))
		})
	} catch (err) {
		console.log(err)
	}
}
window.addEventListener('DOMContentLoaded', () => {
	chrome.storage.local.get(['isOnboardingDone'], (value) => {
		if (value.isOnboardingDone) {
			chrome.storage.local.get(['data'], (response) => {
				const { data } = response
				const name = data.username

				document.getElementById('username').innerHTML = `Hi ${name.charAt(0).toUpperCase()}${name.substring(1)}`
			})
		} else {
			chrome.tabs.create({
				url: './onboarding.html',
			})
		}
	})

	const imageDataFromLS = localStorage.getItem('background')
	const versesDataFromLS = localStorage.getItem('versions')

	if (imageDataFromLS && versesDataFromLS) {
		const background = JSON.parse(imageDataFromLS)
		const scripture = JSON.parse(versesDataFromLS)
		let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
		today = today.split(',')
		today = today[0]

		if (scripture.timestamp == today) {
			backgroundData = background
			scriptureData = scripture
		} else {
			nextBackground()
			const fetchVerse = fetch(`${baseUrl}/verse`).then((res) => res.json())
			const fetchVersions = fetch(`${baseUrl}/scripture-text`).then((res) => res.json())
			Promise.all([fetchVerse, fetchVersions])

				.then(function (data) {
					verseElement.textContent = data[0]
					scriptureTextElement.textContent = data[1].KJV
					versions = data[1]
					let now = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
					now = now.split(',')
					now = now[0]
					const savetoLS = { data, timestamp: now }

					localStorage.setItem('versions', JSON.stringify(savetoLS))
				})

				.catch(function (error) {
					console.log(error)
				})
		}
	} else {
		nextBackground()
		const fetchVerse = fetch(`${baseUrl}/verse`).then((res) => res.json())
		const fetchVersions = fetch(`${baseUrl}/scripture-text`).then((res) => res.json())
		Promise.all([fetchVerse, fetchVersions])

			.then(function (data) {
				verseElement.textContent = data[0]
				scriptureTextElement.textContent = data[1].KJV
				versions = data[1]
				let now = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
				now = now.split(',')
				now = now[0]
				const savetoLS = { data, timestamp: now }
				localStorage.setItem('versions', JSON.stringify(savetoLS))
			})

			.catch(function (error) {
				console.log(error)
			})
	}

	if (scriptureData && backgroundData) {
		verseElement.textContent = scriptureData.data[0]
		scriptureTextElement.textContent = scriptureData.data[1].KJV
		const { background } = backgroundData
		document.body.setAttribute('style', `background-image: url(${background.base64});`)

		locationElement.innerHTML = background.location.name ? background.location.name : ''
		versions = scriptureData.data[1]
	}

	versionElement.addEventListener('change', (event) => {
		const verse = event.target.value
		scriptureTextElement.textContent = versions[verse]
	})
	chrome.storage.local.get(['prayer'], (response) => {
		if (response.prayer) prayerElement.innerHTML = `Prayer: ${response.prayer}`
	})
})
// get prayer from supabase three times per day
const d = new Date()
let hour = d.getHours().toString()
let minutes = d.getMinutes().toString()
let time = `${hour}:${minutes}`

let timeToFetchPrayer = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']

if (timeToFetchPrayer.includes(time)) {
	chrome.runtime.sendMessage({ command: 'fetch-prayer' }, (response) => {
		prayerElement.innerHTML = ` Prayer: ${response.prayer}`
	})
}
