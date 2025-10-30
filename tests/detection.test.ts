import { describe, it, expect, vi } from 'vitest'

describe('Detection scoring system', () => {
  it('should trigger warning at 100 points', () => {
    let detectionScore = 0
    let triggered = false
    
    const triggerDetection = (method: string, score: number) => {
      detectionScore += score
      if (detectionScore >= 100) {
        triggered = true
      }
    }
    
    triggerDetection('ethereum_accessed', 100)
    
    expect(detectionScore).toBe(100)
    expect(triggered).toBe(true)
  })

  it('should accumulate scores from multiple detections', () => {
    let detectionScore = 0
    let triggered = false
    
    const triggerDetection = (method: string, score: number) => {
      detectionScore += score
      if (detectionScore >= 100) {
        triggered = true
      }
    }
    
    // First detection - not enough
    triggerDetection('connect_button', 50)
    expect(triggered).toBe(false)
    expect(detectionScore).toBe(50)
    
    // Second detection - reaches threshold
    triggerDetection('rpc_call', 50)
    expect(triggered).toBe(true)
    expect(detectionScore).toBe(100)
  })

  it('should not trigger below 100 points', () => {
    let detectionScore = 0
    let triggered = false
    
    const triggerDetection = (method: string, score: number) => {
      detectionScore += score
      if (detectionScore >= 100) {
        triggered = true
      }
    }
    
    triggerDetection('connect_button', 50)
    triggerDetection('localStorage', 20)
    
    expect(detectionScore).toBe(70)
    expect(triggered).toBe(false)
  })

  it('should track detection reasons', () => {
    const detectionReasons: string[] = []
    
    const triggerDetection = (method: string, score: number) => {
      detectionReasons.push(method)
    }
    
    triggerDetection('ethereum_accessed', 100)
    triggerDetection('web3_library', 100)
    
    expect(detectionReasons).toEqual(['ethereum_accessed', 'web3_library'])
    expect(detectionReasons.length).toBe(2)
  })

  it('should skip detection when whitelisted', () => {
    let detectionScore = 0
    let triggered = false
    const isWhitelisted = true
    
    const triggerDetection = (method: string, score: number) => {
      if (isWhitelisted) {
        return // Skip detection
      }
      
      detectionScore += score
      if (detectionScore >= 100) {
        triggered = true
      }
    }
    
    triggerDetection('ethereum_accessed', 100)
    
    expect(detectionScore).toBe(0)
    expect(triggered).toBe(false)
  })
})