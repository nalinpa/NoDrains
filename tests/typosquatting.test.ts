import { describe, it, expect } from 'vitest'
import { detectTyposquatting, detectHomographAttack } from '../lib/typosquatting'

describe('Typosquatting Detection', () => {
  const whitelist = ['uniswap.org', 'opensea.io', 'aave.com']

  it('should detect wrong TLD', () => {
    const result = detectTyposquatting('uniswap.com', whitelist)
    expect(result.isTyposquat).toBe(true)
    expect(result.suspectedTarget).toBe('uniswap.org')
  })

  it('should detect typos in brand name', () => {
    const result = detectTyposquatting('uniiswap.org', whitelist)
    expect(result.isTyposquat).toBe(true)
    expect(result.suspectedTarget).toBe('uniswap.org')
  })

  it('should detect brand name in different domain', () => {
    const result = detectTyposquatting('uniswap-app.com', whitelist)
    expect(result.isTyposquat).toBe(true)
    expect(result.suspectedTarget).toBe('uniswap.org')
  })

  it('should allow legitimate site', () => {
    const result = detectTyposquatting('uniswap.org', whitelist)
    expect(result.isTyposquat).toBe(false)
  })

  it('should allow legitimate subdomains', () => {
    const result = detectTyposquatting('app.uniswap.org', whitelist)
    expect(result.isTyposquat).toBe(false)
  })

  it('should detect completely different site', () => {
    const result = detectTyposquatting('google.com', whitelist)
    expect(result.isTyposquat).toBe(false)
  })
})

describe('Homograph Attack Detection', () => {
  it('should detect non-ASCII characters', () => {
    expect(detectHomographAttack('unіswap.org')).toBe(true) // і is Cyrillic
  })

  it('should allow normal ASCII', () => {
    expect(detectHomographAttack('uniswap.org')).toBe(false)
  })
})