// content.ts
import { getLists, isWhitelisted, isBlacklisted } from "./lib/storage"
import { showBlacklistWarning, showDetectionWarning, showTyposquatWarning } from "./lib/warnings"
import { detectTyposquatting, detectHomographAttack } from "./lib/typosquatting"
import {
  checkEthereumAccess,
  detectLibraries,
  interceptSignatures,
  detectWeb3Frameworks,
  detectWalletButtons,
  interceptNetwork,
  observeWeb3UI,
  checkLocalStorage,
  type DetectionCallback
} from "./lib/detectors"

export const config = {
  matches: ["<all_urls>"],
  run_at: "document_start"
}

let web3Detected = false
let detectionScore = 0
let detectionReasons: string[] = []
let isWhitelistedSite = false
let isBlacklistedSite = false
let isEnabled = true

console.log('[Wallet Detector] Starting on:', window.location.hostname)

async function checkLists() {
  const hostname = window.location.hostname.toLowerCase()
  
  try {
    const lists = await getLists()
    const settings = await chrome.storage.local.get(['enabled'])
    
    isEnabled = settings.enabled !== false
    
    isWhitelistedSite = isWhitelisted(hostname, lists.whitelist)
    isBlacklistedSite = isBlacklisted(hostname, lists.blacklist)
    
    console.log('[Wallet Detector] Enabled:', isEnabled)
    console.log('[Wallet Detector] Whitelisted:', isWhitelistedSite)
    console.log('[Wallet Detector] Blacklisted:', isBlacklistedSite)
    
    // Check for typosquatting FIRST (highest priority)
    if (isEnabled && !isWhitelistedSite && !isBlacklistedSite) {
      const typosquatResult = detectTyposquatting(hostname, lists.whitelist)
      
      if (typosquatResult.isTyposquat) {
        console.log('[Wallet Detector] 🚨 TYPOSQUAT DETECTED:', typosquatResult)
        showTyposquatWarning(
          typosquatResult.suspectedTarget || 'a trusted site',
          typosquatResult.reason || 'This domain looks suspicious'
        )
        return
      }
      
      // Check for homograph attacks (unicode lookalikes)
      if (detectHomographAttack(hostname)) {
        console.log('[Wallet Detector] 🚨 HOMOGRAPH ATTACK DETECTED')
        showTyposquatWarning(
          'the legitimate site',
          'This domain uses suspicious lookalike characters. This is a common phishing technique.'
        )
        return
      }
    }
    
    // Then check blacklist
    if (isBlacklistedSite && isEnabled) {
      showBlacklistWarning()
    }
  } catch (error) {
    console.error('[Wallet Detector] Error checking lists:', error)
  }
}

checkLists()

const triggerDetection: DetectionCallback = (method: string, score: number) => {
  if (web3Detected) return
  
  if (!isEnabled) {
    console.log('[Wallet Detector] Extension is disabled, skipping detection')
    return
  }
  
  if (isWhitelistedSite) {
    console.log('[Wallet Detector] Site is whitelisted, skipping detection')
    return
  }
  
  detectionScore += score
  detectionReasons.push(method)
  
  console.log(`[Wallet Detector] +${score} pts: ${method} (Total: ${detectionScore})`)
  
  if (detectionScore >= 100) {
    web3Detected = true
    console.log('[Wallet Detector] 🎯 DETECTED:', detectionReasons.join(', '))
    showDetectionWarning(detectionReasons[0])
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return
  
  if (event.data.type === 'WEB3_DETECTED') {
    console.log('[Wallet Detector] Detection:', event.data.method)
    triggerDetection(event.data.method, event.data.score || 50)
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LISTS_UPDATED') {
    console.log('[Wallet Detector] Settings updated, reloading page...')
    window.location.reload()
  }
})

checkEthereumAccess(triggerDetection)
interceptNetwork(triggerDetection)
detectLibraries(triggerDetection)
interceptSignatures(triggerDetection)

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    detectWalletButtons(triggerDetection)
    observeWeb3UI(triggerDetection)
    detectWeb3Frameworks(triggerDetection)
    checkLocalStorage(triggerDetection)
  })
} else {
  detectWalletButtons(triggerDetection)
  observeWeb3UI(triggerDetection)
  detectWeb3Frameworks(triggerDetection)
  checkLocalStorage(triggerDetection)
}