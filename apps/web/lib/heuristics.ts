import type { ThreatType } from "@gonephishin/shared";

/**
 * Local heuristics that flag a URL without consulting Safe Browsing.
 * Returns null when nothing is suspicious; returns a threatType otherwise.
 */
export function checkHeuristics(
  url: string,
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
