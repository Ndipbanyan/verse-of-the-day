const baseUrl = 'https://yvotd-backend.herokuapp.com'
const PRAYER_URL = "https://trvhmnsvxucecbejzgbo.supabase.co/rest/v1/Prayers?select=prayer'"
const USERS_URL = 'https://trvhmnsvxucecbejzgbo.supabase.co/rest/v1/Users'

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
	if (request.command === 'save-user-details') {
		chrome.storage.local.get(['data'], (response) => {
			const { data } = response

			fetch(`${baseUrl}/keys`)
				.then((response) => response.json())
				.then((response) => {
					fetch(`${USERS_URL}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							apiKey: response.supabase,
							Authorization: `Bearer ${response.supabase}`,
							Prefer: 'return=representation',
						},
						body: JSON.stringify(data),
					})
						.then((res) => res.json())
						.then(() => console.log('User saved!'))
						.catch((err) => console.log(err))
				})
				.catch((err) => console.log(err))
		})
	}
	if (request.command === 'fetch-prayer') {
		fetch(`${baseUrl}/keys`)
			.then((response) => response.json())
			.then((response) => {
				fetch(`${PRAYER_URL}`, {
					headers: {
						apiKey: response.supabase,
						Authorization: `Bearer ${response.supabase}`,
					},
				})
					.then((res) => res.json())
					.then((res) => {
						sendResponse({ prayer: res[0].prayer })
						chrome.storage.local.set({ prayer: res[0].prayer })
					})
					.catch((err) => console.log(err))
			})
			.catch((err) => console.log(err))
	}
	return true
})

// This happens when the extension is installed/uninstalled
chrome.runtime.onInstalled.addListener((e) => {
	if (e.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.storage.local.set({ isOnboardingDone: false })
		chrome.tabs.create({
			url: 'onboarding.html',
		})
		chrome.runtime.setUninstallURL('https://getverseoftheday.com/')
	}
})
