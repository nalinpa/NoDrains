import { getLists, isWhitelisted, isBlacklisted } from "./lib/storage"
import { showBlacklistWarning, showDetectionWarning } from "./lib/warnings"
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
let isEnabled = true // Default to enabled

console.log('[Wallet Detector] Starting on:', window.location.hostname)

// Check whitelist/blacklist AND enabled state
async function checkLists() {
  const hostname = window.location.hostname.toLowerCase()
  
  try {
    const lists = await getLists()
    const settings = await chrome.storage.local.get(['enabled'])
    
    // Check if extension is enabled (defaults to true if not set)
    isEnabled = settings.enabled !== false
    
    isWhitelistedSite = isWhitelisted(hostname, lists.whitelist)
    isBlacklistedSite = isBlacklisted(hostname, lists.blacklist)
    
    console.log('[Wallet Detector] Enabled:', isEnabled)
    console.log('[Wallet Detector] Whitelisted:', isWhitelistedSite)
    console.log('[Wallet Detector] Blacklisted:', isBlacklistedSite)
    
    // Only show blacklist warning if extension is enabled
    if (isBlacklistedSite && isEnabled) {
      showBlacklistWarning()
    }
  } catch (error) {
    console.error('[Wallet Detector] Error checking lists:', error)
  }
}

checkLists()

// Detection callback - checks if enabled before triggering
const triggerDetection: DetectionCallback = (method: string, score: number) => {
  if (web3Detected) return
  
  // CRITICAL: Skip if extension is disabled
  if (!isEnabled) {
    console.log('[Wallet Detector] Extension is disabled, skipping detection')
    return
  }
  
  // Skip if whitelisted
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

// Listen for messages from injected scripts
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  
  if (event.data.type === 'WEB3_DETECTED') {
    console.log('[Wallet Detector] Detection:', event.data.method)
    triggerDetection(event.data.method, event.data.score || 50)
  }
})

// Listen for list updates (when user changes settings)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LISTS_UPDATED') {
    console.log('[Wallet Detector] Settings updated, reloading page...')
    window.location.reload()
  }
})

// Initialize all detection methods
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