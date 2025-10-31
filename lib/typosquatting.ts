/**
 * Extract the brand name from a domain
 * e.g., "uniswap.org" -> "uniswap"
 */
function extractBrandName(domain: string): string {
  // Remove common TLDs
  const withoutTLD = domain
    .replace(/\.(com|org|net|io|xyz|app|fi|exchange|finance|crypto|eth|dao|gg|cc|co|me|info)$/i, '')
  
  // Remove subdomains (keep only the main part)
  const parts = withoutTLD.split('.')
  return parts[parts.length - 1].toLowerCase()
}

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + 1   // substitution
        )
      }
    }
  }

  return dp[m][n]
}

/**
 * Check if a domain is a potential typosquat of whitelisted domains
 */
export function detectTyposquatting(
  currentDomain: string, 
  whitelist: string[]
): { isTyposquat: boolean; suspectedTarget?: string; reason?: string } {
  
  const currentBrand = extractBrandName(currentDomain)
  const currentLower = currentDomain.toLowerCase()
  
  for (const whitelistedDomain of whitelist) {
    const whitelistedBrand = extractBrandName(whitelistedDomain)
    const whitelistedLower = whitelistedDomain.toLowerCase()
    
    // Skip if it's the exact whitelisted domain or subdomain
    if (currentLower === whitelistedLower || currentLower.endsWith('.' + whitelistedLower)) {
      continue
    }
    
    // Check 1: Domain contains the whitelisted brand name but isn't the real site
    // e.g., "uniswap-app.com", "fake-uniswap.org", "uniswap.scam.com"
    if (currentLower.includes(whitelistedBrand) && currentLower !== whitelistedLower) {
      return {
        isTyposquat: true,
        suspectedTarget: whitelistedDomain,
        reason: `Contains "${whitelistedBrand}" but is not the official ${whitelistedDomain}`
      }
    }
    
    // Check 2: Brand names are very similar (1-2 character difference)
    // e.g., "uniiswap.org" (double i), "uniswwap.org" (extra w)
    const distance = levenshteinDistance(currentBrand, whitelistedBrand)
    const maxDistance = Math.min(2, Math.floor(whitelistedBrand.length * 0.2)) // 20% or max 2 chars
    
    if (distance > 0 && distance <= maxDistance && currentBrand.length >= 4) {
      return {
        isTyposquat: true,
        suspectedTarget: whitelistedDomain,
        reason: `Very similar to ${whitelistedDomain} (possible typo)`
      }
    }
    
    // Check 3: Same brand, different TLD
    // e.g., "uniswap.com" when real is "uniswap.org"
    if (currentBrand === whitelistedBrand && currentLower !== whitelistedLower) {
      return {
        isTyposquat: true,
        suspectedTarget: whitelistedDomain,
        reason: `Uses the name "${whitelistedBrand}" but wrong domain extension. Real site is ${whitelistedDomain}`
      }
    }
    
    // Check 4: Subdomain or path containing whitelisted domain
    // e.g., "sites.google.com/uniswap", "scam.com/uniswap"
    const urlPath = window.location.href.toLowerCase()
    if (urlPath.includes(whitelistedBrand) && !currentLower.endsWith(whitelistedLower)) {
      return {
        isTyposquat: true,
        suspectedTarget: whitelistedDomain,
        reason: `URL contains "${whitelistedBrand}" but is not ${whitelistedDomain}`
      }
    }
  }
  
  return { isTyposquat: false }
}

/**
 * Common character substitutions used in homograph attacks
 */
const HOMOGRAPHS: Record<string, string[]> = {
  'a': ['а', 'ɑ', 'α', '@'],
  'e': ['е', 'ė', 'ę', 'ë'],
  'i': ['і', 'ı', 'l', '1', '!'],
  'o': ['о', 'ο', '0', 'ø'],
  'p': ['р', 'ρ'],
  'c': ['с', 'ϲ'],
  'x': ['х', '×'],
  'y': ['у', 'ү'],
  's': ['ѕ', '$', '5'],
  'h': ['һ'],
  'n': ['ո'],
  'm': ['т'],
}

/**
 * Check if domain uses lookalike characters (homograph attack)
 */
export function detectHomographAttack(domain: string): boolean {
  for (const char of domain.toLowerCase()) {
    // Check if character is non-ASCII
    if (char.charCodeAt(0) > 127) {
      return true
    }
  }
  return false
}