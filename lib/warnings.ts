export function showBlacklistWarning(): void {
  const showWarningElement = () => {
    if (document.getElementById('eth-wallet-warning')) return

    const warning = document.createElement('div')
    warning.id = 'eth-wallet-warning'
    warning.innerHTML = `
      <style>
        @keyframes pulseRed {
          0%, 100% { opacity: 0.97; }
          50% { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(220, 38, 38, 0.98);
        backdrop-filter: blur(10px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: pulseRed 2s infinite;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 48px 60px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          text-align: center;
          max-width: 600px;
          animation: slideDown 0.5s ease-out;
        ">
          <div style="
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulseRed 1s infinite;
          ">⛔</div>
          
          <h1 style="
            color: #dc2626;
            font-size: 36px;
            font-weight: 900;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">BLOCKED WEBSITE</h1>
          
          <p style="
            color: #991b1b;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.4;
          ">
            This website has been marked as dangerous
          </p>
          
          <div style="
            background: #fef2f2;
            border: 2px solid #fca5a5;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            text-align: left;
          ">
            <p style="
              color: #7f1d1d;
              font-size: 21px;
              font-weight: 600;
              margin: 0 0 16px 0;
              line-height: 1.6;
            ">
              <strong style="display: block; margin-bottom: 12px; font-size: 18px;">⚠️ DO NOT:</strong>
              • Connect your crypto wallet to this website<br/>
              • Sign any transactions or messages<br/>
              • Enter your recovery phrase or private keys<br/>
              • Download anything from this site
            </p>
          </div>
          
          <p style="
            color: #4b5563;
            font-size: 18px;
            margin-bottom: 24px;
            line-height: 1.5;
          ">
            This site is on your blocklist.<br/>
            If you believe this is a mistake, you can unblock it in the extension settings.
          </p>
          
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button id="leave-site" style="
              background: #dc2626;
              color: white;
              border: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
              transition: all 0.2s;
            ">
              ← Leave This Site
            </button>
            
            <div style="display: flex; gap: 8px; align-items: center;">
          <button id="trust-site-warning" style="
            background: #22c55e;
            border: none;
            color: white;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
          ">
            Trust Site
          </button>
          <button id="report-site-warning" style="
            background: #ef4444;
            border: none;
            color: white;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          ">
            Report
          </button>
          <button id="close-eth-warning" style="
            background: #f59e0b;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          ">
            Got it
          </button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(warning)
    
    // Add hover effects
    const leaveButton = document.getElementById('leave-site')
    if (leaveButton) {
      leaveButton.addEventListener('mouseover', () => {
        leaveButton.style.transform = 'scale(1.05)'
      })
      leaveButton.addEventListener('mouseout', () => {
        leaveButton.style.transform = 'scale(1)'
      })
      leaveButton.addEventListener('click', () => {
        window.location.href = 'https://www.google.com'
      })
    }
    
    document.getElementById('close-eth-warning')?.addEventListener('click', () => {
      warning.remove()
    })
  }
  
  if (document.body) {
    showWarningElement()
  } else {
    document.addEventListener('DOMContentLoaded', showWarningElement)
  }
}

export function showDetectionWarning(method: string): void {
  const showWarningElement = () => {
    if (document.getElementById('eth-wallet-warning')) return

    const warning = document.createElement('div')
    warning.id = 'eth-wallet-warning'
    warning.innerHTML = `
      <style>
        @keyframes slideIn {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      </style>
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        color: #1f2937;
        padding: 16px 24px;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        border-bottom: 4px solid #f59e0b;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
          <span style="
            font-size: 32px;
            line-height: 1;
          ">⚠️</span>
          <div>
            <div style="
              font-weight: 700;
              font-size: 16px;
              color: #f59e0b;
              margin-bottom: 4px;
            ">
              This Site Can Access Your Crypto Wallet
            </div>
            <div style="
              font-size: 14px;
              color: #4b5563;
              line-height: 1.4;
            ">
              Only connect your wallet if you trust this website. Be careful before approving any transactions.
            </div>
          </div>
         </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button id="trust-site-warning" style="
            background: #22c55e;
            border: none;
            color: white;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
          ">
            Trust Site
          </button>
          <button id="report-site-warning" style="
            background: #ef4444;
            border: none;
            color: white;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          ">
            Report
          </button>
          <button id="close-eth-warning" style="
            background: #f59e0b;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          ">
            Got it
          </button>
        </div>
      </div>
    `
    
    document.body.prepend(warning)

    // Trust site button
    const trustButton = document.getElementById('trust-site-warning')
    if (trustButton) {
      trustButton.addEventListener('mouseover', () => {
        trustButton.style.background = '#16a34a'
        trustButton.style.transform = 'translateY(-1px)'
      })
      trustButton.addEventListener('mouseout', () => {
        trustButton.style.background = '#22c55e'
        trustButton.style.transform = 'translateY(0)'
      })
      trustButton.addEventListener('click', async () => {
        const domain = window.location.hostname
        const result = await chrome.storage.local.get(['whitelist'])
        const whitelist = result.whitelist || []
        if (!whitelist.includes(domain)) {
          whitelist.push(domain)
          await chrome.storage.local.set({ whitelist })
        }
        warning.remove()
      })
    }

    // Report site button
    const reportButton = document.getElementById('report-site-warning')
    if (reportButton) {
      reportButton.addEventListener('mouseover', () => {
        reportButton.style.background = '#dc2626'
        reportButton.style.transform = 'translateY(-1px)'
      })
      reportButton.addEventListener('mouseout', () => {
        reportButton.style.background = '#ef4444'
        reportButton.style.transform = 'translateY(0)'
      })
      reportButton.addEventListener('click', () => {
        const domain = window.location.hostname
        const reportUrl = `https://github.com/nalinpa/NoDrains/issues/new?title=Report+suspicious+site:+${encodeURIComponent(domain)}&body=I+want+to+report+this+site+as+suspicious:%0A%0ADomain:+${encodeURIComponent(domain)}%0AURL:+${encodeURIComponent(window.location.href)}%0A%0AReason:`
        window.open(reportUrl, '_blank')
      })
    }

    // Close button
    const closeButton = document.getElementById('close-eth-warning')
    if (closeButton) {
      closeButton.addEventListener('mouseover', () => {
        closeButton.style.background = '#d97706'
        closeButton.style.transform = 'translateY(-1px)'
        closeButton.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)'
      })
      closeButton.addEventListener('mouseout', () => {
        closeButton.style.background = '#f59e0b'
        closeButton.style.transform = 'translateY(0)'
        closeButton.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)'
      })
      closeButton.addEventListener('click', () => {
        warning.remove()
      })
    }
  }
  
  if (document.body) {
    showWarningElement()
  } else {
    document.addEventListener('DOMContentLoaded', showWarningElement)
  }
}

export function showTyposquatWarning(realSite: string, reason: string): void {
  const showWarningElement = () => {
    if (document.getElementById('eth-wallet-warning')) return

    const warning = document.createElement('div')
    warning.id = 'eth-wallet-warning'
    warning.innerHTML = `
      <style>
        @keyframes pulseOrange {
          0%, 100% { opacity: 0.97; }
          50% { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(234, 88, 12, 0.98);
        backdrop-filter: blur(10px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: pulseOrange 2s infinite;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 48px 60px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          text-align: center;
          max-width: 600px;
          animation: slideDown 0.5s ease-out;
        ">
          <div style="
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulseOrange 1s infinite;
          ">⚠️</div>
          
          <h1 style="
            color: #ea580c;
            font-size: 36px;
            font-weight: 900;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">SUSPICIOUS WEBSITE</h1>
          
          <p style="
            color: #9a3412;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.4;
          ">
            This looks like a fake version of a trusted site
          </p>
          
          <div style="
            background: #fff7ed;
            border: 2px solid #fed7aa;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            text-align: left;
          ">
            <p style="
              color: #7c2d12;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 16px 0;
              line-height: 1.6;
            ">
              <strong style="display: block; margin-bottom: 12px; font-size: 18px; color: #ea580c;">🚨 Warning:</strong>
              ${reason}
            </p>
            <p style="
              color: #7c2d12;
              font-size: 16px;
              font-weight: 600;
              margin: 16px 0 0 0;
              line-height: 1.6;
            ">
              <strong style="display: block; margin-bottom: 8px;">✅ Real site:</strong>
              <span style="
                background: #22c55e;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                display: inline-block;
                font-family: monospace;
                font-size: 18px;
              ">${realSite}</span>
            </p>
          </div>
          
          <div style="
            background: #fef2f2;
            border: 2px solid #fca5a5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 32px;
            text-align: left;
          ">
            <p style="
              color: #7f1d1d;
              font-size: 15px;
              font-weight: 600;
              margin: 0;
              line-height: 1.6;
            ">
              <strong style="display: block; margin-bottom: 10px;">⛔ DO NOT:</strong>
              • Connect your wallet<br/>
              • Sign any transactions<br/>
              • Enter passwords or recovery phrases<br/>
              • Download anything
            </p>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button id="leave-site" style="
              background: #ea580c;
              color: white;
              border: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
              transition: all 0.2s;
            ">
              Go to Trusted Site
            </button>

            <button id="report-fake-site" style="
              background: #ef4444;
              color: white;
              border: none;
              padding: 14px 28px;
              border-radius: 12px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
              transition: all 0.2s;
            ">
              Report Fake
            </button>

            <button id="report-false-positive" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 14px 28px;
              border-radius: 12px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
              transition: all 0.2s;
            ">
              Not Fake
            </button>

            <button id="close-eth-warning" style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;
            ">
              I'll Be Careful
            </button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(warning)
    
    const leaveButton = document.getElementById('leave-site')
    if (leaveButton) {
      leaveButton.addEventListener('mouseover', () => {
        leaveButton.style.transform = 'scale(1.05)'
      })
      leaveButton.addEventListener('mouseout', () => {
        leaveButton.style.transform = 'scale(1)'
      })
      leaveButton.addEventListener('click', () => {
        window.location.href = 'https://' + realSite
      })
    }

    const reportButton = document.getElementById('report-fake-site')
    if (reportButton) {
      reportButton.addEventListener('mouseover', () => {
        reportButton.style.transform = 'scale(1.05)'
      })
      reportButton.addEventListener('mouseout', () => {
        reportButton.style.transform = 'scale(1)'
      })
      reportButton.addEventListener('click', () => {
        const domain = window.location.hostname
        const reportUrl = `https://github.com/nalinpa/NoDrains/issues/new?title=Report+fake+site:+${encodeURIComponent(domain)}&body=I+want+to+report+this+fake+site:%0A%0AFake+Domain:+${encodeURIComponent(domain)}%0AReal+Site:+${encodeURIComponent(realSite)}%0AURL:+${encodeURIComponent(window.location.href)}%0AReason:+${encodeURIComponent(reason)}%0A%0AAdditional+details:`
        window.open(reportUrl, '_blank')
      })
    }

    const falsePositiveButton = document.getElementById('report-false-positive')
    if (falsePositiveButton) {
      falsePositiveButton.addEventListener('mouseover', () => {
        falsePositiveButton.style.transform = 'scale(1.05)'
      })
      falsePositiveButton.addEventListener('mouseout', () => {
        falsePositiveButton.style.transform = 'scale(1)'
      })
      falsePositiveButton.addEventListener('click', () => {
        const domain = window.location.hostname
        const reportUrl = `https://github.com/nalinpa/NoDrains/issues/new?title=False+positive:+${encodeURIComponent(domain)}&body=This+is+a+false+positive+typosquatting+detection:%0A%0ADomain:+${encodeURIComponent(domain)}%0ADetected+as+similar+to:+${encodeURIComponent(realSite)}%0AURL:+${encodeURIComponent(window.location.href)}%0AReason+shown:+${encodeURIComponent(reason)}%0A%0AThis+is+a+legitimate+site+and+should+not+be+flagged.`
        window.open(reportUrl, '_blank')
      })
    }

    document.getElementById('close-eth-warning')?.addEventListener('click', () => {
      warning.remove()
    })
  }
  
  if (document.body) {
    showWarningElement()
  } else {
    document.addEventListener('DOMContentLoaded', showWarningElement)
  }
}