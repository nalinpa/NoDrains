import { describe, it, expect } from 'vitest'
import { DEFAULT_WHITELIST, DEFAULT_BLACKLIST } from '../lib/defaults'

describe('Default lists', () => {
  describe('DEFAULT_WHITELIST', () => {
    it('should contain trusted Web3 sites', () => {
      expect(DEFAULT_WHITELIST).toContain('opensea.io')
      expect(DEFAULT_WHITELIST).toContain('uniswap.org')
      expect(DEFAULT_WHITELIST).toContain('etherscan.io')
    })

    it('should not be empty', () => {
      expect(DEFAULT_WHITELIST.length).toBeGreaterThan(0)
    })

    it('should contain only valid domain formats', () => {
      DEFAULT_WHITELIST.forEach(domain => {
        // Should not have protocol
        expect(domain).not.toMatch(/^https?:\/\//)
        
        // Should not have trailing slash
        expect(domain).not.toMatch(/\/$/)
        
        // Should have at least one dot
        expect(domain).toMatch(/\./)
      })
    })

    it('should have no duplicates', () => {
      const unique = [...new Set(DEFAULT_WHITELIST)]
      expect(unique.length).toBe(DEFAULT_WHITELIST.length)
    })
  })

  describe('DEFAULT_BLACKLIST', () => {
    it('should contain known scam patterns', () => {
      expect(DEFAULT_BLACKLIST.length).toBeGreaterThan(0)
    })

    it('should not overlap with whitelist', () => {
      const overlap = DEFAULT_WHITELIST.filter(site => 
        DEFAULT_BLACKLIST.includes(site)
      )
      expect(overlap).toEqual([])
    })

    it('should contain only valid domain formats', () => {
      DEFAULT_BLACKLIST.forEach(domain => {
        expect(domain).not.toMatch(/^https?:\/\//)
        expect(domain).not.toMatch(/\/$/)
        expect(domain).toMatch(/\./)
      })
    })

    it('should have no duplicates', () => {
      const unique = [...new Set(DEFAULT_BLACKLIST)]
      expect(unique.length).toBe(DEFAULT_BLACKLIST.length)
    })
  })
})