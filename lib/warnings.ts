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
              I Understand the Risks
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
        window.history.back()
        setTimeout(() => {
          if (window.location.href === document.referrer || !document.referrer) {
            window.close()
          }
        }, 100)
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
        <div style="display: flex; align-items: center; gap: 14px;">
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
    `
    
    document.body.prepend(warning)
    
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