const UNSPLASH_ACCESS_KEY = ''
const verseElement = document.getElementById('verse')
const versionElement = document.getElementById('versions')
const prayerElement = document.getElementById('prayer')
const scriptureTextElement = document.getElementById('scripture-text')
const locationElement = document.getElementById('place-name')
let versions
let backgroundData
let scriptureData
const verseUrl = 'http://localhost:8080/'
const unsplashUrl = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature landscape'

function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText)
	}

	return response
}

async function getBackgroundImage() {
	const headers = new Headers()

	headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`)

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
			locationElement.textContent = backgroundImage.location.name
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
				document.getElementById('username').innerHTML = `Hi ${data.username}`
			})
		} else {
			chrome.tabs.create({
				url: './onboarding.html',
			})
		}
	})

	chrome.runtime.sendMessage({ command: 'fetch-prayer' }, (response) => {
		prayerElement.innerHTML = response.prayer ? response.prayer : 'Dear Abba, thank You'
	})

	const imageDataFromLS = localStorage.getItem('background')
	const versesDataFromLS = localStorage.getItem('versions')

	if (imageDataFromLS && versesDataFromLS) {
		const background = JSON.parse(imageDataFromLS)
		const scripture = JSON.parse(versesDataFromLS)
		let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
		today = today.split(',')
		today = today[0]
		if (background.timestamp == today) {
			backgroundData = background
			scriptureData = scripture
		} else {
			nextBackground()
			const fetchVerse = fetch(`${verseUrl}verse`).then((res) => res.json())
			const fetchVersions = fetch(`${verseUrl}scripture-text`).then((res) => res.json())
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
		const fetchVerse = fetch(`${verseUrl}verse`).then((res) => res.json())
		const fetchVersions = fetch(`${verseUrl}scripture-text`).then((res) => res.json())
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
		locationElement.textContent = `${background.location.name}`
		versions = scriptureData.data[1]
	}

	versionElement.addEventListener('change', (event) => {
		const verse = event.target.value
		scriptureTextElement.textContent = versions[verse]
	})
})
