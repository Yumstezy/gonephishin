import type { ScanRequest, ScanResponse, ScanResult } from "@gonephishin/shared";
import { API_BASE_URL } from "../shared/env.js";

const TIMEOUT_MS = 3000;

/**
 * Calls /api/scan with a hard 3s timeout. Returns 'unknown' / source 'fallback'
 * for every URL on any failure so callers can render gracefully.
 */
export async function scanUrlsViaApi(urls: string[]): Promise<ScanResult[]> {
  if (urls.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: ScanRequest = { urls };
    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`scan returned ${res.status}`);
    const data = (await res.json()) as ScanResponse;
    return data.results;
  } catch (err) {
    console.warn("[gonephishin] scan failed, falling back to unknown:", err);
    return urls.map((url) => ({
      url,
      verdict: "unknown",
      threatType: null,
      source: "fallback",
    }));
  } finally {
    clearTimeout(timeout);
  }
}
