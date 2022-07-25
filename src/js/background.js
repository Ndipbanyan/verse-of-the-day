const UNSPLASH_ACCESS_KEY = ''

function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText)
	}

	return response
}

async function getBackgroundImage() {
	const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature'
	const headers = new Headers()
	headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`)

	let response = await fetch(url, { headers })
	const json = await validateResponse(response).json()
	return json
}
async function nextBackground() {
	try {
		const backgroundImage = await getBackgroundImage()
		chrome.storage.local.set({ background: backgroundImage })
		console.log(backgroundImage, 'hy')
	} catch (err) {
		console.log(err)
	}
}
// Execute the `nextBackground` function when the extension is installed
chrome.runtime.onInstalled.addListener(nextBackground)
// chrome.runtime.onMessage.addListener((request) => {
// 	if (request.command === 'next-image') {
// 		nextBackground()
// 	}
// })
