const UNSPLASH_ACCESS_KEY = ''

function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText)
	}

	return response
}

async function getBackgroundImage() {
	const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature landscape'
	const headers = new Headers()
	headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`)

	let response = await fetch(url, { headers })

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
			// the browser's local storage as well as the time the background was saved the first time
			const today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
			chrome.storage.local.set({ background: backgroundImage })
			chrome.storage.local.set({ timestamp: today })
		})
	} catch (err) {
		console.log(err)
	}
}
// Execute the `nextBackground` function when the extension is freshly installed or reloaded
chrome.runtime.onInstalled.addListener(nextBackground)

chrome.runtime.onMessage.addListener((request) => {
	if (request.command === 'next-image') {
		nextBackground()
	}
})

const versions = {
	NIV: 'for God',
	KJV: 'for God',
	ESV: 'for God',
}
