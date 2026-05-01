import type { ScanResult } from "@gonephishin/shared";

/**
 * Messages exchanged between content scripts, the service worker, and the
 * popup. Discriminated by `type`.
 */
export type ExtensionMessage =
  | { type: "scan-urls"; urls: string[] }
  | { type: "scan-result"; results: ScanResult[] }
  | {
      type: "warning-acknowledged";
      url: string;
      outcome: "dismissed" | "ignored_warning";
    }
  | { type: "ping" }
  | { type: "get-diagnostics" }
  | { type: "unpair" };

export interface Diagnostics {
  /** Most recent scan attempt, regardless of outcome. */
  lastScanAt: number | null;
  /** Number of URLs ever scanned this session. */
  totalScanned: number;
  /** Number of URLs flagged as sketchy or dangerous this session. */
  totalFlagged: number;
  /** Last error message from a failed API call, or null if none. */
  lastError: string | null;
  /** Whether the most recent scan succeeded against /api/scan. */
  apiReachable: boolean;
}

export type ScanUrlsRequest = Extract<ExtensionMessage, { type: "scan-urls" }>;
export type ScanUrlsResponse = { results: ScanResult[] };
