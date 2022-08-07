chrome.runtime.onInstalled.addListener((e) => {
	if (e.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.storage.local.set({ isOnboardingDone: false })
		chrome.tabs.create({
			url: 'onboarding.html',
		})
	}
})
