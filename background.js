// const UNSPLASH_ACCESS_KEY = 'S5ymCxyR7NyWdRbzRMF4YgxmMvIMU4TBHdkgtjLYCTs'

// function validateResponse(response) {
// 	if (!response.ok) {
// 		throw Error(response.statusText)
// 	}

// 	return response
// }

// async function getBackgroundImage() {
// 	let unsplashImage
// 	const unsplashUrl = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature landscape'
// 	const headers = new Headers()

// 	const fetchImage = async (url) => {
// 		headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`)

// 		let response = await fetch(url, { headers })

// 		const json = await validateResponse(response).json()
// 		response = await fetch(json.urls.raw + '&q=85&w=2000')
// 		json.blob = await validateResponse(response).blob()

// 		// save the image and the time it is gotten
// 		let timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
// 		timestamp = timestamp.split(',')
// 		timestamp = timestamp[0]
// 		const storeDataArray = [json, timestamp]
// 		chrome.storage.local.set({ imgData: storeDataArray })
// 		return json
// 	}
// 	const LS = chrome.storage.local

// 	await LS.get('imgData', async (data) => {
// 		if (data.imgData) {
// 			let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
// 			today = today.split(',')
// 			today = today[0]
// 			if (today == data.imgData[1]) {
// 				unsplashImage = data.imgData[0]
// 			} else {
// 				unsplashImage = await fetchImage(unsplashUrl)
// 			}
// 		} else {
// 			unsplashImage = await fetchImage(unsplashUrl)
// 		}
// 	})
// 	// unsplashImage = await fetchImage(unsplashUrl)

// 	// unsplashImage = await fetchImage(unsplashUrl)
// 	// console.log(unsplashImage, 'shogbo')

// 	return unsplashImage
// }

// async function nextBackground() {
// 	try {
// 		const backgroundImage = await getBackgroundImage()

// 		if (backgroundImage) {
// 			console.log('e don showwwww')
// 			// the FileReader object lets you read the contents of
// 			// files or raw data buffers. A blob object is a data buffer
// 			const fileReader = new FileReader()

// 			// The readAsDataURL method is used to read
// 			// the contents of the specified blob object
// 			// Once finished, the binary data is converted to
// 			// a Base64 string
// 			fileReader.readAsDataURL(backgroundImage.blob)
// 			fileReader.addEventListener('load', (event) => {
// 				// The `result` property is the Base64 string
// 				const { result } = event.target
// 				// This string is stored on a `base64` property
// 				// in the image object
// 				backgroundImage.base64 = result
// 				// The backgroundImage object is subsequently stored in
// 				// the browser's local storage as well as the time the background was saved the first time

// 				chrome.storage.local.set({ background: backgroundImage })
// 			})
// 		}
// 		elseconsole.log('e na show')
// 	} catch (err) {
// 		console.log(err)
// 	}
// }
// // Execute the `nextBackground` function when the extension is freshly installed or reloaded
let color = '#3aa757'
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({ color })
	console.log('Default background color set to %cgreen', `color: ${color}`)
})

// chrome.runtime.onMessage.addListener((request) => {
// 	if (request.command === 'next-image') {
// 		nextBackground()
// 	}
// })
