let color = '#3aa757'

// const userDetails = () => {
// 	let userName
// 	const mainContent = document.getElementById('main-content')
// 	mainContent.style.display = 'none'
// 	const nameContainer = (document.getElementById('name').textContent = "Hello There! What's your name?")
// 	const nameInput = document.createElement('input')
// 	nameContainer.appendChild(nameInput)
// 	nameInput.addEventListener('change', (event) => {
// 		userName = event.target.value
// 	})
// 	mainContent.style.display = block
// }
chrome.runtime.onInstalled.addListener(() => {
	chrome.runtime.onInstalled.addListener((details) => {
		if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
			chrome.runtime.setUninstallURL('https://example.com/extension-survey')
		}
	})
	chrome.storage.local.set({ color })
	console.log(new Date().toLocaleString('en-GB', { timeZone: 'UTC' }))
})
