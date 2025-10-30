import { describe, it, expect } from 'vitest'
import { isWhitelisted, isBlacklisted } from '../lib/storage'

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