const verseElement = document.getElementById('verse')
const versionElement = document.getElementById('versions')
const prayerElement = document.querySelector('.prayer')
const scriptureTextElement = document.getElementById('scripture-text')
const locationElement = document.getElementById('place-name')
let versions
let backgroundData
let scriptureData
let prayerData
const baseUrl = 'https://yvotd-backend.herokuapp.com'
const PRAYER_URL = 'https://trvhmnsvxucecbejzgbo.supabase.co/rest/v1/Prayers?select=prayer'
const unsplashUrl = 'https://api.unsplash.com/photos/random?orientation=landscape&query=landscape'

const fetchVerse = (url) => {
	const fetchVerse = fetch(`${url}/verse`).then((res) => res.json())
	const fetchVersions = fetch(`${url}/scripture-text`).then((res) => res.json())
	Promise.all([fetchVerse, fetchVersions])

		.then(function (data) {
			verseElement.textContent = data[0]
			scriptureTextElement.textContent = data[1].KJV
			versions = data[1]
			let now = new Date().toLocaleString()
			now = now.split(',')
			now = now[0]
			const savetoLS = { data, timestamp: now }

			localStorage.setItem('versions', JSON.stringify(savetoLS))
		})

		.catch(function (error) {
			console.log(error)
		})
}

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
			let timeNow = new Date().toLocaleString()
			timeNow = timeNow.split(',')
			timeNow = timeNow[0]
			const storeData = { background: backgroundImage, timestamp: timeNow }
			localStorage.setItem('background', JSON.stringify(storeData))
		})
	} catch (err) {
		console.log(err)
	}
}
// get prayer from supabase
let fetchPrayer = () => {
	fetch(`https://yvotd-backend.herokuapp.com/keys`)
		.then((response) => response.json())
		.then((response) => {
			fetch('https://trvhmnsvxucecbejzgbo.supabase.co/rest/v1/Prayers?select=prayer', {
				headers: {
					apiKey: response.supabase,
					Authorization: `Bearer ${response.supabase}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					document.querySelector('.prayer').innerHTML = ` Prayer: ${res[0].prayer}`
					let now = new Date().toLocaleString()
					now = now.split(',')

					// get the current hour
					let d = new Date()
					const h = d.getHours()

					now = { day: now[0], hour: h }
					const savetoLS = { prayer: res[0].prayer, timestamp: now }
					localStorage.setItem('prayer', JSON.stringify(savetoLS))
				})
				.catch((err) => console.log(err))
		})
		.catch((err) => console.log(err))
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
	const prayerDataFromLS = localStorage.getItem('prayer')

	// prayer Logic
	if (prayerDataFromLS) {
		const prayerInfoFromLS = JSON.parse(prayerDataFromLS)
		let today = new Date().toLocaleString()

		today = today.split(',')
		today = today[0]
		let d = new Date()
		const h = d.getHours()

		if (prayerInfoFromLS.timestamp['day'] === today) {
			if (h - prayerInfoFromLS.timestamp['hour'] >= 4) {
				fetchPrayer()
				console.log('greater', today, h, prayerInfoFromLS.timestamp['day'], prayerInfoFromLS.timestamp['hour'])
			} else {
				prayerElement.textContent = ` Prayer: ${prayerInfoFromLS.prayer}`
			}
		} else {
			fetchPrayer()
		}
	} else {
		fetchPrayer()
	}

	// backgroundImage and verse logic
	if (imageDataFromLS && versesDataFromLS) {
		const background = JSON.parse(imageDataFromLS)
		const scripture = JSON.parse(versesDataFromLS)
		// get the current date
		let today = new Date().toLocaleString()

		today = today.split(',')
		today = today[0]

		// get the current hour
		let d = new Date()
		const h = d.getHours()

		if (scripture.timestamp === today && h >= 1) {
			backgroundData = background
			scriptureData = scripture
		} else {
			nextBackground()
			fetchVerse(baseUrl)
		}
	} else {
		nextBackground()
		fetchVerse(baseUrl)
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
})
