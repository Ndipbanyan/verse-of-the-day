const PRAYER_URL = 'https://rwqmkjnxmzvukmdfgtiw.supabase.co/rest/v1/Prayers?select=prayer'
const USERS_URL = 'https://rwqmkjnxmzvukmdfgtiw.supabase.co/rest/v1/Users'
const SUPABASE_KEY = chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
	if (request.command === 'save-user-details') {
		chrome.storage.local.get(['data'], (response) => {
			const { data } = response
			fetch(`${USERS_URL}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					apiKey: SUPABASE_KEY,
					Authorization: `Bearer ${SUPABASE_KEY}`,
					Prefer: 'return=representation',
				},
				body: JSON.stringify(data),
			})
				.then((res) => res.json())
				.then((res) => console.log(res))
				.catch((err) => console.log(err))
		})
	}
	if (request.command === 'fetch-prayer') {
		fetch(`${PRAYER_URL}`, {
			headers: {
				apiKey: SUPABASE_KEY,
				Authorization: `Bearer ${SUPABASE_KEY}`,
			},
		})
			.then((res) => res.json())
			.then((res) => sendResponse({ prayer: res[0].prayer }))

			.catch((err) => console.log(err))
	}
	return true
})

// This happens when the extension is installed the first time
chrome.runtime.onInstalled.addListener((e) => {
	if (e.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.storage.local.set({ isOnboardingDone: false })
		chrome.tabs.create({
			url: 'onboarding.html',
		})
	}
})
