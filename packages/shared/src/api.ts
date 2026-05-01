import type { ThreatType, Verdict, VerdictSource } from "./verdict.js";

export interface ScanRequest {
  urls: string[];
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
