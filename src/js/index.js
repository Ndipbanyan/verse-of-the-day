const verseElement = document.getElementById('verse')
const prayerElement = document.getElementById('prayer')
let verse
let versions
const BIBLE_ACCESS_KEY = ''

fetch('http://localhost:8000/results')
	.then((res) => res.json())
	.then((data) => {
		verseElement.textContent = data
		const formatData = data.split('(')
		verse = formatData[0].trim()

		verseElement.innerText = verse
	})
	.catch((err) => console.log(err))

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
			console.log({ datestored: data.timestamp, datetoday: today })
		}
		if (data.timestamp) console.log(data.timestamp)
	})

	chrome.runtime.sendMessage({ command: 'next-image' })
})
