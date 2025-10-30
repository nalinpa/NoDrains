export type DetectionCallback = (method: string, score: number) => void

export function checkEthereumAccess(onDetect: DetectionCallback): void {
  const script = document.createElement('script')
  script.textContent = `
    (function() {
      const originalEthereum = window.ethereum;
      let hasAccessed = false;
      
      Object.defineProperty(window, 'ethereum', {
        get() {
          if (!hasAccessed && originalEthereum) {
            hasAccessed = true;
            console.log('[Wallet Detector] Page accessed window.ethereum');
            window.postMessage({ 
              type: 'WEB3_DETECTED', 
              method: 'ethereum_accessed',
              score: 100
            }, '*');
          }
          return originalEthereum;
        },
        set(value) {
          console.log('[Wallet Detector] Page set window.ethereum');
          window.postMessage({ 
            type: 'WEB3_DETECTED', 
            method: 'ethereum_set',
            score: 100
          }, '*');
          Object.defineProperty(window, 'ethereum', {
            value,
            writable: true,
            configurable: true
          });
        },
        configurable: true
      });
    })();
  `
  ;(document.head || document.documentElement).appendChild(script)
  script.remove()
}

export function detectLibraries(onDetect: DetectionCallback): void {
  let checkCount = 0
  const maxChecks = 40
  
  const checkInterval = setInterval(() => {
    checkCount++
    
    const libraryChecks = [
      { name: 'ethers', value: window.ethers },
      { name: '_ethers', value: window['_ethers'] },
      { name: 'Web3', value: window.Web3 },
      { name: 'web3', value: window.web3 },
      { name: 'wagmi', value: window.wagmi },
    ]
    
    for (const {name, value} of libraryChecks) {
      if (value) {
        console.log(`[Wallet Detector] Found ${name} library!`)
        onDetect(`${name} library loaded`, 100)
        clearInterval(checkInterval)
        return
      }
    }
    
    if (checkCount >= maxChecks) {
      clearInterval(checkInterval)
    }
  }, 500)
}

export function interceptSignatures(onDetect: DetectionCallback): void {
  const script = document.createElement('script')
  script.textContent = `
    (function() {
      if (window.ethereum && window.ethereum.request) {
        const originalRequest = window.ethereum.request;
        
        window.ethereum.request = function(args) {
          const method = args?.method || '';
          
          const criticalMethods = [
            'eth_requestAccounts',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
            'eth_signTypedData_v4',
            'eth_sendTransaction'
          ];
          
          if (criticalMethods.includes(method)) {
            console.log('[Wallet Detector] Wallet interaction:', method);
            window.postMessage({ 
              type: 'WEB3_DETECTED', 
              method: 'wallet_interaction_' + method,
              score: 100
            }, '*');
          }
          
          return originalRequest.apply(this, arguments);
        };
      }
    })();
  `
  ;(document.head || document.documentElement).appendChild(script)
  script.remove()
}

export function detectWeb3Frameworks(onDetect: DetectionCallback): void {
  const checkFrameworks = () => {
    const frameworks = [
      { name: 'RainbowKit', check: () => document.querySelector('[data-rk]') },
      { name: 'Web3Modal', check: () => document.querySelector('[id*="web3modal"]') },
      { name: 'Dynamic', check: () => document.querySelector('[class*="dynamic-widget"]') },
      { name: 'Privy', check: () => document.querySelector('[data-privy]') },
      { name: 'Thirdweb', check: () => window['thirdweb'] },
    ]
    
    for (const {name, check} of frameworks) {
      if (check()) {
        console.log(`[Wallet Detector] ${name} framework detected`)
        onDetect(`${name} framework`, 100)
        return true
      }
    }
    return false
  }
  
  setTimeout(checkFrameworks, 2000)
  setTimeout(checkFrameworks, 4000)
}

export function detectWalletButtons(onDetect: DetectionCallback): void {
  const scanButtons = () => {
    const clickables = Array.from(document.querySelectorAll(
      'button, a, [role="button"]'
    ))
    
    for (const element of clickables) {
      const text = (element.textContent || '').toLowerCase().trim()
      const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase()
      
      const searchText = `${text} ${ariaLabel}`
      
      const highConfidenceKeywords = [
        'connect wallet',
        'connect to wallet',
        'connect your wallet',
        'sign in with ethereum',
        'metamask',
        'walletconnect'
      ]
      
      for (const keyword of highConfidenceKeywords) {
        if (searchText.includes(keyword)) {
          console.log(`[Wallet Detector] Wallet button: "${text}"`)
          onDetect(`Wallet button: "${text}"`, 100)
          return true
        }
      }
      
      if (text === 'connect' && element.tagName === 'BUTTON') {
        console.log(`[Wallet Detector] Connect button found`)
        onDetect(`Connect button`, 50)
        return true
      }
    }
    return false
  }
  
  setTimeout(() => scanButtons(), 1000)
  setTimeout(() => scanButtons(), 3000)
  setTimeout(() => scanButtons(), 5000)
}

export function interceptNetwork(onDetect: DetectionCallback): void {
  const script = document.createElement('script')
  script.textContent = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0]?.toString() || '';
        
        const rpcProviders = [
          'infura.io',
          'alchemy.com',
          'quicknode.pro',
          'moralis.io'
        ];
        
        if (rpcProviders.some(provider => url.includes(provider))) {
          console.log('[Wallet Detector] RPC call detected');
          window.postMessage({ 
            type: 'WEB3_DETECTED', 
            method: 'rpc_call',
            score: 50
          }, '*');
        }
        
        return originalFetch.apply(this, args);
      };
    })();
  `
  ;(document.head || document.documentElement).appendChild(script)
  script.remove()
}

export function observeWeb3UI(onDetect: DetectionCallback): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const element = node as Element
          const classStr = element.className?.toString().toLowerCase() || ''
          const id = element.id?.toLowerCase() || ''
          
          const web3Patterns = [
            'web3modal',
            'walletconnect-modal',
            'rainbowkit'
          ]
          
          if (web3Patterns.some(p => classStr.includes(p) || id.includes(p))) {
            console.log('[Wallet Detector] Web3 modal injected')
            onDetect('Web3 modal', 100)
            observer.disconnect()
            return
          }
        }
      }
    }
  })
  
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true })
  }
}

export function checkLocalStorage(onDetect: DetectionCallback): void {
  setTimeout(() => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || ''
        
        if (key.startsWith('walletconnect') || 
            key.startsWith('wagmi.') ||
            key === '-walletlink:https://www.walletlink.org:session:id') {
          console.log('[Wallet Detector] Active wallet session in localStorage')
          onDetect('Wallet localStorage data', 50)
          return
        }
      }
    } catch (e) {
      // localStorage access denied
    }
  }, 2000)
}