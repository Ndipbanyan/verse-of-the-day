const UNSPLASH_ACCESS_KEY = 'S5ymCxyR7NyWdRbzRMF4YgxmMvIMU4TBHdkgtjLYCTs'

const locationElement = document.getElementById('place-name')
let error = document.getElementById('validate')

let backgroundData

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

		const fileReader = new FileReader()

		fileReader.readAsDataURL(backgroundImage.blob)
		fileReader.addEventListener('load', (event) => {
			const { result } = event.target

			backgroundImage.base64 = result

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
	const imageDataFromLS = localStorage.getItem('background')

	if (imageDataFromLS) {
		const background = JSON.parse(imageDataFromLS)
		let today = new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
		today = today.split(',')
		today = today[0]
		if (background.timestamp == today) {
			backgroundData = background
		} else {
			nextBackground()
		}
	} else {
		nextBackground()
	}

	if (backgroundData) {
		const { background } = backgroundData
		document.body.setAttribute('style', `background-image: url(${background.base64});`)
		locationElement.textContent = `${background.location.name},${background.location.city}`
	}
})
let user_name
const emailInput = document.getElementById('email')
const nameInput = document.getElementById('name')
nameInput.addEventListener('keyup', function (e) {
	if (e.key === 'Enter') {
		next('name', 'email')
	}
})
nameInput.addEventListener('change', function (e) {
	user_name = e.target.value
	document.getElementById('email-label').textContent = `${user_name} What's your email?`
})

function next(from, to) {
	error.innerHTML = ''
	document.getElementById(from).children[2].focus()
	let value = document.getElementById(from).children[2].value

	if (!value || value === '') {
		error.innerHTML = 'Please enter a value'
	} else {
		error.innerHTML = ''
		document.getElementById(from).classList.remove('is-visible')
		document.getElementById(to).classList.add('is-visible')
	}
}

const formElement = document.getElementById('form')
formElement.addEventListener('submit', function (e) {
	e.preventDefault()
	// Submitting the form will occur only when the active element on the page
	// is the submit button. So you can submit the form by clicking on the submit button
	// or by pressing the ENTER key when the submit button has focus.
	if (document.activeElement.getAttribute('type') !== 'submit') {
		e.preventDefault()
	}
	const formData = new FormData(formElement)
	const data = { username: formData.get('name'), email: formData.get('email') }
	console.log(data)
})
