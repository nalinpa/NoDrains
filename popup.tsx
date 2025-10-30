import { useState, useEffect } from "react"
import "./style.css"

function IndexPopup() {
  const [currentDomain, setCurrentDomain] = useState<string>("")
  const [whitelist, setWhitelist] = useState<string[]>([])
  const [blacklist, setBlacklist] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'whitelist' | 'blacklist'>('whitelist')
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        try {
          const url = new URL(tabs[0].url)
          setCurrentDomain(url.hostname)
        } catch (e) {
          setCurrentDomain("Unknown")
        }
      }
    })

    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.local.get(['whitelist', 'blacklist', 'enabled'])
      setWhitelist(result.whitelist || [])
      setBlacklist(result.blacklist || [])
      setIsEnabled(result.enabled !== false)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const toggleEnabled = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    await chrome.storage.local.set({ enabled: newState })
    notifyContentScript()
  }

  const addToWhitelist = async (domain: string) => {
    if (whitelist.includes(domain)) return
    const updated = [...whitelist, domain]
    await chrome.storage.local.set({ whitelist: updated })
    setWhitelist(updated)
    notifyContentScript()
  }

  const addToBlacklist = async (domain: string) => {
    if (blacklist.includes(domain)) return
    const updated = [...blacklist, domain]
    await chrome.storage.local.set({ blacklist: updated })
    setBlacklist(updated)
    notifyContentScript()
  }

  const removeFromWhitelist = async (domain: string) => {
    const updated = whitelist.filter(d => d !== domain)
    await chrome.storage.local.set({ whitelist: updated })
    setWhitelist(updated)
    notifyContentScript()
  }

  const removeFromBlacklist = async (domain: string) => {
    const updated = blacklist.filter(d => d !== domain)
    await chrome.storage.local.set({ blacklist: updated })
    setBlacklist(updated)
    notifyContentScript()
  }

  const notifyContentScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'LISTS_UPDATED' }, () => {
          if (chrome.runtime.lastError) {
            // Ignore
          }
        })
      }
    })
  }

  const isInWhitelist = whitelist.includes(currentDomain)
  const isInBlacklist = blacklist.includes(currentDomain)

  return (
    <div className="w-96 min-h-[500px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-sans">
      {/* Header */}
      <div className="p-5 pb-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            NoDrains
          </h2>
          
          {/* Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs opacity-90 font-semibold">
              {isEnabled ? 'ON' : 'OFF'}
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                checked={isEnabled}
                onChange={toggleEnabled}
                className="sr-only"
              />
              <div className={`w-12 h-[26px] rounded-full transition-all ${
                isEnabled 
                  ? 'bg-green-500/30 border-2 border-green-500' 
                  : 'bg-white/20 border-2 border-white/30'
              }`}>
                <div className={`w-5 h-5 rounded-full shadow-md transition-all absolute top-0.5 ${
                  isEnabled 
                    ? 'bg-green-500 left-6' 
                    : 'bg-white left-0.5'
                }`} />
              </div>
            </div>
          </label>
        </div>
        
        {!isEnabled && (
          <div className="bg-red-500/20 border border-red-500/30 px-2 py-2 rounded-md text-xs mt-2">
            ⚠️ Protection is currently disabled
          </div>
        )}
      </div>

      {/* Current Site Card */}
      {currentDomain && currentDomain !== 'Unknown' && (
        <div className="m-4 bg-white/15 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-[11px] opacity-80 mb-1.5 uppercase tracking-wider font-semibold">
            Current Website
          </div>
          <div className="text-[15px] font-semibold mb-3 break-all leading-snug">
            {currentDomain}
          </div>
          
          {/* Status Badge */}
          {isInWhitelist && (
            <div className="inline-block bg-green-500/20 border border-green-500/40 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3">
              ✓ Trusted Site
            </div>
          )}
          
          {isInBlacklist && (
            <div className="inline-block bg-red-500/20 border border-red-500/40 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3">
              🚨 Blocked Site
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isInWhitelist && !isInBlacklist && (
              <>
                <button
                  onClick={() => addToWhitelist(currentDomain)}
                  className="flex-1 px-3 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-white font-semibold text-[13px] hover:bg-green-500/30 active:scale-95 transition-all"
                >
                  ✓ Trust This Site
                </button>
                <button
                  onClick={() => addToBlacklist(currentDomain)}
                  className="flex-1 px-3 py-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-white font-semibold text-[13px] hover:bg-red-500/30 active:scale-95 transition-all"
                >
                  🚨 Block This Site
                </button>
              </>
            )}
            
            {isInWhitelist && (
              <button
                onClick={() => removeFromWhitelist(currentDomain)}
                className="w-full px-3 py-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-white font-semibold text-[13px] hover:bg-red-500/30 active:scale-95 transition-all"
              >
                Remove from Trusted
              </button>
            )}
            
            {isInBlacklist && (
              <button
                onClick={() => removeFromBlacklist(currentDomain)}
                className="w-full px-3 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-white font-semibold text-[13px] hover:bg-green-500/30 active:scale-95 transition-all"
              >
                Unblock This Site
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-3">
        <button
          onClick={() => setActiveTab('whitelist')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-[13px] transition-all ${
            activeTab === 'whitelist'
              ? 'bg-white/20 border border-white/30'
              : 'border border-transparent hover:bg-white/10'
          }`}
        >
          Trusted ({whitelist.length})
        </button>
        <button
          onClick={() => setActiveTab('blacklist')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-[13px] transition-all ${
            activeTab === 'blacklist'
              ? 'bg-white/20 border border-white/30'
              : 'border border-transparent hover:bg-white/10'
          }`}
        >
          Blocked ({blacklist.length})
        </button>
      </div>

      {/* List Display */}
      <div className="mx-4 mb-0 bg-white/10 rounded-xl max-h-60 overflow-y-auto border border-white/20">
        {activeTab === 'whitelist' && whitelist.length === 0 && (
          <div className="text-center py-8 opacity-60 text-[13px]">
            No trusted sites yet
          </div>
        )}
        
        {activeTab === 'blacklist' && blacklist.length === 0 && (
          <div className="text-center py-8 opacity-60 text-[13px]">
            No blocked sites yet
          </div>
        )}

        {activeTab === 'whitelist' && whitelist.map((domain, index) => (
          <div 
            key={domain} 
            className={`flex justify-between items-center px-4 py-3 hover:bg-white/5 transition-colors ${
              index < whitelist.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <span className="text-[13px] break-all leading-snug">{domain}</span>
            <button
              onClick={() => removeFromWhitelist(domain)}
              className="text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-lg p-1 min-w-[24px] rounded transition-all"
            >
              ✕
            </button>
          </div>
        ))}

        {activeTab === 'blacklist' && blacklist.map((domain, index) => (
          <div 
            key={domain} 
            className={`flex justify-between items-center px-4 py-3 hover:bg-white/5 transition-colors ${
              index < blacklist.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <span className="text-[13px] break-all leading-snug">{domain}</span>
            <button
              onClick={() => removeFromBlacklist(domain)}
              className="text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-lg p-1 min-w-[24px] rounded transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}

export default IndexPopup