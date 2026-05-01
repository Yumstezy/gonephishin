export const VERDICT = {
  Safe: "safe",
  Unknown: "unknown",
  Sketchy: "sketchy",
  Dangerous: "dangerous",
} as const;

export type Verdict = (typeof VERDICT)[keyof typeof VERDICT];

export type ThreatType =
  | "sb_malware"
  | "sb_social_engineering"
  | "sb_unwanted_software"
  | "sb_potentially_harmful_application"
  | "heuristic_typosquat"
  | "heuristic_idn_homoglyph"
  | "heuristic_suspicious_tld"
  | "heuristic_ip_address"
  | "heuristic_excessive_subdomains"
  | null;

export type VerdictSource = "fresh" | "cache" | "fallback" | "heuristic";
