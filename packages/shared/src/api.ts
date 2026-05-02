import type { ThreatType, Verdict, VerdictSource } from "./verdict.js";

export interface ScanRequest {
  urls: string[];
  /** Optional context per URL, same length as `urls`. Used by heuristics. */
  meta?: Array<{ anchorText?: string }>;
}

export interface ScanResult {
  url: string;
  verdict: Verdict;
  threatType: ThreatType;
  source: VerdictSource;
}

export interface ScanResponse {
  results: ScanResult[];
  paired: boolean;
}
