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
  | { type: "ping" };

export type ScanUrlsRequest = Extract<ExtensionMessage, { type: "scan-urls" }>;
export type ScanUrlsResponse = { results: ScanResult[] };
