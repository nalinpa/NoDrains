import { DEFAULT_WHITELIST, DEFAULT_BLACKLIST } from './lib/defaults'

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({
      whitelist: DEFAULT_WHITELIST,
      blacklist: DEFAULT_BLACKLIST,
      enabled: true
    })
  } else if (details.reason === 'update') {
    // merge new defaults with existing user lists
    const result = await chrome.storage.local.get(['whitelist', 'blacklist'])
    const whitelist = Array.from(new Set([...(result.whitelist || []), ...DEFAULT_WHITELIST]))
    const blacklist = Array.from(new Set([...(result.blacklist || []), ...DEFAULT_BLACKLIST]))

    await chrome.storage.local.set({ whitelist, blacklist })
  }

  // enable by default if not set
  const { enabled } = await chrome.storage.local.get(['enabled'])
  if (enabled === undefined) {
    await chrome.storage.local.set({ enabled: true })
  }
})

export {}