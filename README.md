# 🔐 NoDrains - Web3 Security Extension

**Protect yourself from cryptocurrency scams with automatic wallet detection and smart warnings.**

NoDrains alerts you when websites can access your crypto wallet, helping you stay safe while browsing Web3 applications, DeFi platforms, and NFT marketplaces.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Unlicense-blue)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge%20%7C%20Firefox-orange)

---

## 🚀 Features

### 🛡️ **Automatic Detection**
- Detects when websites can connect to crypto wallets (MetaMask, Coinbase Wallet, Rainbow, etc.)
- Works silently in the background - no setup required
- Analyzes Web3 libraries, wallet buttons, and blockchain API calls

### ⚠️ **Smart Warnings**
- **Orange Alert** - Notifies you when a site can access your wallet
- **Red Block** - Full-screen warning for sites you've marked as dangerous
- Clear, plain-English explanations (no technical jargon)

### ✅ **Whitelist System**
- Pre-loaded with 20+ trusted Web3 sites (OpenSea, Uniswap, Aave, etc.)
- Add your favorite DApps to skip warnings
- Never get bothered on sites you trust

### 🚨 **Blacklist Protection**
- Block known scam sites with one click
- Prevent accidental wallet connections to dangerous sites
- Export and share your blacklist with friends

### 🔒 **Privacy First**
- All data stored locally on your device
- No tracking, no analytics, no data collection
- Open source - verify the code yourself

### 🎛️ **Easy Controls**
- Toggle protection on/off instantly
- Manage trusted and blocked sites from one popup
- Clean, modern interface

---

## 📸 Screenshots

### Extension Popup
*[Add screenshot of your popup interface]*

### Warning on Web3 Site
*[Add screenshot of the orange warning banner]*

### Blocked Site Protection
*[Add screenshot of the red fullscreen warning]*

---

## 📥 Installation

### Chrome Web Store (Recommended)
*[Link coming soon]*

### Manual Installation (Development)

1. **Download the extension**
```bash
   git clone https://github.com/nalinpa/NoDrains.git
   cd NoDrains
```

2. **Install dependencies**
```bash
   pnpm install
```

3. **Build the extension**
```bash
   pnpm build
```

4. **Load in Chrome/Edge**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-prod` folder

5. **Load in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file in the `build/firefox-mv3-prod` folder

---

## 🎯 How to Use

### First Time Setup
1. Install the extension
2. Visit any Web3 site (like Uniswap or OpenSea)
3. You'll see a warning if the site can access wallets
4. Click the extension icon to manage settings

### Managing Sites

**Trust a Site (Add to Whitelist)**
1. Visit the website
2. Click the NoDrains icon
3. Click "✓ Trust This Site"
4. No more warnings on this site!

**Block a Site (Add to Blacklist)**
1. Visit a suspicious website
2. Click the NoDrains icon
3. Click "🚨 Block This Site"
4. You'll get a full-screen warning if you visit it again

**Remove from Lists**
1. Click the extension icon
2. Switch to "Trusted" or "Blocked" tab
3. Click the "✕" next to any site to remove it

### Toggle Protection
Click the extension icon and use the ON/OFF switch to temporarily disable all warnings.

---

## 🔍 What Gets Detected?

NoDrains looks for:
- ✅ Ethereum provider access (`window.ethereum`)
- ✅ Web3 libraries (ethers.js, web3.js, wagmi)
- ✅ Wallet connection buttons
- ✅ Transaction signature requests
- ✅ Smart contract interactions
- ✅ RPC network calls

---

## 🛠️ For Developers

### Tech Stack
- **Framework:** [Plasmo](https://www.plasmo.com/) - Modern browser extension framework
- **Language:** TypeScript
- **UI:** React + Tailwind CSS
- **Testing:** Vitest

### Development
```bash
# Install dependencies
pnpm install

# Run in development mode (hot reload)
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Project Structure
```
NoDrains/
├── popup.tsx              # Extension popup UI
├── content.ts             # Main detection logic (injected into pages)
├── background.ts          # Background service worker
├── lib/
│   ├── detectors.ts       # Web3 detection methods
│   ├── storage.ts         # Whitelist/blacklist management
│   ├── warnings.ts        # Warning UI components
│   └── defaults.ts        # Default trusted sites
├── tests/                 # Test files
└── style.css              # Tailwind styles
```

### Contributing

We welcome contributions! This is public domain software - you can do anything with it.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Contribution Ideas:**
- Add more default trusted sites
- Improve detection accuracy
- Add support for more wallets
- Translate to other languages
- Report bugs or suggest features

---

## 🐛 Known Issues

- None yet! Report issues on [GitHub Issues](https://github.com/nalinpa/NoDrains/issues)

---

## ❓ FAQ

**Q: Does this extension have access to my wallet or private keys?**  
A: No! The extension only detects when websites CAN access your wallet. It never touches your actual wallet, keys, or transactions.

**Q: Will this slow down my browser?**  
A: No, the extension is very lightweight and only activates on websites with Web3 capabilities.

**Q: Why am I getting warnings on legitimate sites?**  
A: The extension warns you about ANY site that can connect to wallets. Add trusted sites to your whitelist to stop warnings.

**Q: Does this work with all crypto wallets?**  
A: Yes! It detects any wallet that uses standard Web3 APIs (MetaMask, Coinbase Wallet, Trust Wallet, Rainbow, etc.)

**Q: Is my data shared or collected?**  
A: No! Everything is stored locally on your device. We don't collect any data.

**Q: Can I use this on mobile?**  
A: Currently desktop only (Chrome, Edge, Firefox). Mobile support coming soon!

**Q: Can I use this code in my own project?**  
A: Yes! This is public domain software. Use it however you want, commercial or non-commercial, no attribution required.

---

## 🔐 Security

Found a security vulnerability? Please email [your-email@example.com] instead of opening a public issue.

---

## 📜 License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

See the [UNLICENSE](UNLICENSE) file for full details.

---

## 💬 Support & Community

- 🐛 **Report bugs:** [GitHub Issues](https://github.com/nalinpa/NoDrains/issues)
- 💡 **Feature requests:** [GitHub Discussions](https://github.com/nalinpa/NoDrains/discussions)
- 📧 **Email:** [your-email@example.com]
- 🐦 **Twitter:** [@yourhandle]

---

## ⭐ Show Your Support

If NoDrains helped protect you from a scam or made your Web3 browsing safer, please:
- ⭐ Star this repository
- 🐦 Share it on Twitter
- 📝 Leave a review on the Chrome Web Store

---

## 🙏 Acknowledgments

- Built with [Plasmo Framework](https://www.plasmo.com/)
- Default whitelist curated from trusted Web3 communities
- Inspired by the need for better Web3 security tools

---

**Stay safe in Web3! 🔐**

Made with ❤️ for the Web3 community