import type { ThreatType } from "@gonephishin/shared";

/**
 * Local heuristics that flag a URL without consulting Safe Browsing.
 * Returns null when nothing is suspicious; returns a threatType otherwise.
 *
 * `anchorText`, when supplied, lets us catch a class of phishing where the
 * link text claims one brand ("download Adobe…") but the URL goes to an
 * unrelated domain. Real phishing simulators (e.g. Microsoft Attack
 * Simulator) deliberately use Safe-Browsing-clean domains, so URL-only
 * heuristics never catch them; the anchor-text-aware check does.
 */
export function checkHeuristics(
  url: string,
  anchorText?: string,
): { threatType: NonNullable<ThreatType> } | null {
  let host: string;
  let rawHost: string;
  try {
    host = new URL(url).hostname;
    // Extract the host as written in the input (URL parser punycodes IDN
    // hosts, which would hide homoglyph attacks like раypal.com).
    rawHost = extractRawHost(url) ?? host;
  } catch {
    return null;
  }

  if (isIpAddress(host)) return { threatType: "heuristic_ip_address" };
  if (hasMixedScripts(rawHost)) return { threatType: "heuristic_idn_homoglyph" };
  if (hasSuspiciousTld(host)) return { threatType: "heuristic_suspicious_tld" };
  if (hasExcessiveSubdomains(host))
    return { threatType: "heuristic_excessive_subdomains" };
  if (looksLikeTyposquat(host)) return { threatType: "heuristic_typosquat" };
  if (anchorText && hasBrandMismatch(anchorText, host))
    return { threatType: "heuristic_brand_mismatch" };
  return null;
}

function extractRawHost(input: string): string | null {
  const match = /^[a-z][a-z0-9+\-.]*:\/\/([^/?#]+)/i.exec(input);
  if (!match) return null;
  // Strip optional userinfo and port.
  const authority = match[1]!;
  const afterUserinfo = authority.includes("@")
    ? authority.slice(authority.lastIndexOf("@") + 1)
    : authority;
  return afterUserinfo.replace(/:\d+$/, "");
}

function isIpAddress(host: string): boolean {
  return (
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ||
    (host.startsWith("[") && host.endsWith("]"))
  );
}

/**
 * A host with characters from more than one Unicode script (e.g. Latin +
 * Cyrillic) is almost always a homoglyph attack.
 */
function hasMixedScripts(host: string): boolean {
  if (/^[\x00-\x7F]+$/.test(host)) return false;
  let sawLatin = false;
  let sawCyrillic = false;
  let sawGreek = false;
  for (const ch of host) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a))
      sawLatin = true;
    else if (code >= 0x0400 && code <= 0x04ff) sawCyrillic = true;
    else if (code >= 0x0370 && code <= 0x03ff) sawGreek = true;
  }
  const scriptCount = [sawLatin, sawCyrillic, sawGreek].filter(Boolean).length;
  return scriptCount > 1;
}

const SUSPICIOUS_TLDS = new Set([
  "tk",
  "ml",
  "ga",
  "cf",
  "gq",
  "xyz",
  "top",
  "click",
  "country",
  "stream",
  "download",
  "bid",
  "loan",
  "men",
  "work",
  "racing",
]);

function hasSuspiciousTld(host: string): boolean {
  const tld = host.split(".").at(-1)?.toLowerCase();
  return tld ? SUSPICIOUS_TLDS.has(tld) : false;
}

function hasExcessiveSubdomains(host: string): boolean {
  return host.split(".").length >= 5;
}

const PROTECTED_BRANDS = [
  "google",
  "paypal",
  "amazon",
  "microsoft",
  "apple",
  "facebook",
  "netflix",
  "chase",
  "wellsfargo",
  "bankofamerica",
  "citibank",
  "americanexpress",
  "instagram",
  "linkedin",
];

function looksLikeTyposquat(host: string): boolean {
  const labels = host.toLowerCase().split(".");
  if (labels.length < 2) return false;
  const candidate = labels[labels.length - 2]!;
  // Common digit-for-letter substitutions seen in phishing (g00gle, paypa1).
  const deobfuscated = candidate
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/5/g, "s");
  for (const brand of PROTECTED_BRANDS) {
    if (candidate === brand) return false;
    if (levenshtein(candidate, brand) === 1) return true;
    if (deobfuscated !== candidate && deobfuscated === brand) return true;
  }
  return false;
}

/**
 * Brand-mismatch detector: only fires when the anchor text contains BOTH a
 * call-to-action verb ("click", "download", "verify"…) AND a recognized
 * brand name, while the destination host belongs to none of that brand's
 * domains. The CTA filter keeps casual references ("Read more about Apple
 * on TechCrunch") from tripping the rule.
 */
const CTA_PATTERNS: RegExp[] = [
  /\bclick\s+(here|below)\b/,
  /\bdownload\b/,
  /\binstall\b/,
  /\bverify\b/,
  /\bconfirm\b/,
  /\bupdate\b/,
  /\bsign\s*in\b/,
  /\blog\s*in\b/,
  /\blogin\b/,
  /\bclaim\b/,
  /\bunlock\b/,
  /\bview\s+(document|invoice|statement|message)\b/,
  /\baccess\s+(your\s+)?(account|file|document)\b/,
  /\breview\s+(charges|payment|order)\b/,
];

const BRAND_DOMAINS: Record<string, string[]> = {
  adobe: ["adobe.com", "adobe.io", "behance.net"],
  microsoft: [
    "microsoft.com",
    "office.com",
    "office365.com",
    "live.com",
    "outlook.com",
    "azure.com",
    "msn.com",
    "skype.com",
    "xbox.com",
    "windows.com",
    "sharepoint.com",
    "onedrive.live.com",
  ],
  "office 365": ["office.com", "microsoft.com", "office365.com"],
  apple: ["apple.com", "icloud.com", "me.com"],
  google: [
    "google.com",
    "gmail.com",
    "googleusercontent.com",
    "googlemail.com",
    "youtube.com",
    "android.com",
  ],
  amazon: [
    "amazon.com",
    "amzn.com",
    "amazonaws.com",
    "amazon.co.uk",
    "amazon.de",
    "amazon.ca",
  ],
  paypal: ["paypal.com", "paypalobjects.com"],
  "bank of america": ["bankofamerica.com", "bofa.com", "merrilledge.com"],
  chase: ["chase.com", "jpmorganchase.com"],
  "wells fargo": ["wellsfargo.com"],
  citibank: ["citibank.com", "citi.com"],
  "american express": ["americanexpress.com", "amex.com"],
  netflix: ["netflix.com"],
  facebook: ["facebook.com", "fb.com", "messenger.com"],
  instagram: ["instagram.com"],
  linkedin: ["linkedin.com"],
  twitter: ["twitter.com", "x.com"],
  ebay: ["ebay.com"],
  usps: ["usps.com"],
  fedex: ["fedex.com"],
  ups: ["ups.com"],
  irs: ["irs.gov"],
  "social security": ["ssa.gov"],
  dropbox: ["dropbox.com"],
  docusign: ["docusign.com", "docusign.net"],
  zelle: ["zellepay.com"],
  venmo: ["venmo.com"],
};

function hasBrandMismatch(anchorText: string, host: string): boolean {
  const text = anchorText.toLowerCase();
  if (!CTA_PATTERNS.some((re) => re.test(text))) return false;
  const h = host.toLowerCase();
  for (const [brand, allowed] of Object.entries(BRAND_DOMAINS)) {
    if (!text.includes(brand)) continue;
    const matches = allowed.some((d) => h === d || h.endsWith("." + d));
    if (!matches) return true;
  }
  return false;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n]!;
}
