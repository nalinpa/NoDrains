import { DEFAULT_WHITELIST, DEFAULT_BLACKLIST } from './defaults'

export interface Lists {
  whitelist: string[]
  blacklist: string[]
}

export async function getLists(): Promise<Lists> {
  try {
    const result = await chrome.storage.local.get(['whitelist', 'blacklist'])
    return {
      whitelist: result.whitelist || [],
      blacklist: result.blacklist || []
    }
  } catch (error) {
    console.error('[Storage] Error loading lists:', error)
    return { whitelist: [], blacklist: [] }
  }
}

export function isWhitelisted(domain: string, whitelist: string[]): boolean {
  return whitelist.some(d => 
    domain === d || domain.endsWith('.' + d)
  )
}

export function isBlacklisted(domain: string, blacklist: string[]): boolean {
  return blacklist.some(d => 
    domain === d || domain.endsWith('.' + d)
  )
}

export async function ensureDefaults(): Promise<void> {
  try {
    const result = await chrome.storage.local.get(['whitelist', 'blacklist'])

    if ((!result.whitelist || result.whitelist.length === 0) &&
        (!result.blacklist || result.blacklist.length === 0)) {
      await chrome.storage.local.set({
        whitelist: DEFAULT_WHITELIST,
        blacklist: DEFAULT_BLACKLIST
      })
    }
  } catch (error) {
    console.error('Error loading defaults:', error)
  }
}