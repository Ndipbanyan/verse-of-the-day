const verseElement = document.getElementById('verse')
const prayerElement = document.getElementById('prayer')
const scriptureTextElement = document.getElementById('scripture-text')
let verse

let bibleVerse
const reqBaseUrl = 'http://localhost:8080/'
const fetchVerse = fetch(`${reqBaseUrl}verse`).then((res) => res.json())
const fetchVersions = fetch(`${reqBaseUrl}scripture-text`).then((res) => res.json())

const dataFromLS = localStorage.getItem('versions')

if (dataFromLS) {
	const verseFromLS = JSON.parse(dataFromLS)

	let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
	today = today.split(',')
	today = today[0]

	if (today == verseFromLS.timestamp) {
		verseElement.textContent = verseFromLS.data[0]
		scriptureTextElement.textContent = verseFromLS.data[1].KJV
	} else {
		Promise.all([fetchVerse, fetchVersions])

			.then(function (data) {
				verseElement.textContent = data[0]
				scriptureTextElement.textContent = data[1].KJV
				let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
				today = today.split(',')
				today = today[0]
				const savetoLS = { data, timestamp: today }
				localStorage.setItem('versions', JSON.stringify(savetoLS))
			})
			.catch(function (error) {
				console.log(error)
			})
	}
}

// get background Image
function setImage(image) {
	document.body.setAttribute('style', `background-image: url(${image.base64});`)
}

document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.local.get('background', (data) => {
		const today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
		if (data.background) {
			setImage(data.background)
			console.log('data', data)
			console.log({ datestored: data.timestamp, datetoday: today, bible: bibleVerse })
		}
		// if (data.timestamp) console.log(data.timestamp)
	})

	chrome.runtime.sendMessage({ command: 'next-image' })
})
