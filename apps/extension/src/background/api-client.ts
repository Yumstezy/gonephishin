import type { ScanRequest, ScanResponse, ScanResult } from "@gonephishin/shared";
import { API_BASE_URL } from "../shared/env.js";
import { getPairedState } from "../shared/paired-state.js";

const TIMEOUT_MS = 3000;

/**
 * Calls /api/scan with a hard 3s timeout. Includes the bearer token if the
 * extension is paired so the backend can mark the response paired:true.
 * Returns 'unknown' / source 'fallback' for every URL on any failure so
 * callers can render gracefully.
 */
export async function scanUrlsViaApi(
  urls: string[],
  meta?: Array<{ anchorText?: string }>,
): Promise<ScanResult[]> {
  if (urls.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: ScanRequest = { urls };
    if (meta && meta.some((m) => m.anchorText)) body.meta = meta;
    const paired = await getPairedState();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (paired) headers["Authorization"] = `Bearer ${paired.token}`;
    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers,
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

export async function logEventViaApi(event: {
  url: string;
  threatType: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}): Promise<void> {
  const paired = await getPairedState();
  if (!paired) return; // anonymous mode — skip
  try {
    await fetch(`${API_BASE_URL}/api/events/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paired.token}`,
      },
      body: JSON.stringify(event),
    });
  } catch (err) {
    console.warn("[gonephishin] event log failed:", err);
  }
}
