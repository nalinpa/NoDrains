import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isWhitelisted, isBlacklisted, ensureDefaults } from '../lib/storage'
import { DEFAULT_WHITELIST, DEFAULT_BLACKLIST } from '../lib/defaults'

describe('Storage utilities', () => {
  describe('isWhitelisted', () => {
    it('should detect exact domain match', () => {
      const whitelist = ['opensea.io', 'uniswap.org']
      
      expect(isWhitelisted('opensea.io', whitelist)).toBe(true)
      expect(isWhitelisted('uniswap.org', whitelist)).toBe(true)
    })

    it('should detect subdomain match', () => {
      const whitelist = ['opensea.io']
      
      expect(isWhitelisted('www.opensea.io', whitelist)).toBe(true)
      expect(isWhitelisted('app.opensea.io', whitelist)).toBe(true)
      expect(isWhitelisted('api.opensea.io', whitelist)).toBe(true)
    })

    it('should NOT match similar domains', () => {
      const whitelist = ['opensea.io']
      
      expect(isWhitelisted('fake-opensea.io', whitelist)).toBe(false)
      expect(isWhitelisted('opensea.io.scam.com', whitelist)).toBe(false)
      expect(isWhitelisted('notopensea.io', whitelist)).toBe(false)
    })

    it('should return false for empty whitelist', () => {
      expect(isWhitelisted('opensea.io', [])).toBe(false)
    })

    it('should handle multiple domains', () => {
      const whitelist = ['opensea.io', 'uniswap.org', 'aave.com']
      
      expect(isWhitelisted('opensea.io', whitelist)).toBe(true)
      expect(isWhitelisted('www.uniswap.org', whitelist)).toBe(true)
      expect(isWhitelisted('app.aave.com', whitelist)).toBe(true)
      expect(isWhitelisted('scam.com', whitelist)).toBe(false)
    })
  })

  describe('isBlacklisted', () => {
    it('should detect exact domain match', () => {
      const blacklist = ['scam.com', 'fake-opensea.com']
      
      expect(isBlacklisted('scam.com', blacklist)).toBe(true)
      expect(isBlacklisted('fake-opensea.com', blacklist)).toBe(true)
    })

    it('should detect subdomain match', () => {
      const blacklist = ['scam.com']
      
      expect(isBlacklisted('www.scam.com', blacklist)).toBe(true)
      expect(isBlacklisted('app.scam.com', blacklist)).toBe(true)
    })

    it('should return false for safe domains', () => {
      const blacklist = ['scam.com']
      
      expect(isBlacklisted('opensea.io', blacklist)).toBe(false)
      expect(isBlacklisted('uniswap.org', blacklist)).toBe(false)
    })

    it('should return false for empty blacklist', () => {
      expect(isBlacklisted('anything.com', [])).toBe(false)
    })
  })
})

describe('ensureDefaults', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('initializes defaults when storage is empty', async () => {
      const mockGet = vi.fn().mockResolvedValue({})
      const mockSet = vi.fn().mockResolvedValue(undefined)

      global.chrome.storage.local.get = mockGet
      global.chrome.storage.local.set = mockSet

      await ensureDefaults()

      expect(mockSet).toHaveBeenCalledWith({
        whitelist: DEFAULT_WHITELIST,
        blacklist: DEFAULT_BLACKLIST
      })
    })

    it('initializes when lists are empty arrays', async () => {
      const mockGet = vi.fn().mockResolvedValue({ whitelist: [], blacklist: [] })
      const mockSet = vi.fn().mockResolvedValue(undefined)

      global.chrome.storage.local.get = mockGet
      global.chrome.storage.local.set = mockSet

      await ensureDefaults()

      expect(mockSet).toHaveBeenCalledWith({
        whitelist: DEFAULT_WHITELIST,
        blacklist: DEFAULT_BLACKLIST
      })
    })

    it('does not overwrite existing data', async () => {
      const mockGet = vi.fn().mockResolvedValue({
        whitelist: ['example.com'],
        blacklist: ['scam.com']
      })
      const mockSet = vi.fn().mockResolvedValue(undefined)

      global.chrome.storage.local.get = mockGet
      global.chrome.storage.local.set = mockSet

      await ensureDefaults()

      expect(mockSet).not.toHaveBeenCalled()
    })

    it('handles errors', async () => {
      global.chrome.storage.local.get = vi.fn().mockRejectedValue(new Error('fail'))
      await expect(ensureDefaults()).resolves.not.toThrow()
    })
  })