import type { ScanResult } from "@gonephishin/shared";

const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const PREFIX = "verdict:";

interface Entry {
  result: ScanResult;
  storedAt: number;
}

function key(url: string): string {
  return PREFIX + url;
}

export async function getCachedVerdict(url: string): Promise<ScanResult | null> {
  const k = key(url);
  const obj = (await chrome.storage.local.get(k)) as Record<string, Entry | undefined>;
  const entry = obj[k];
  if (!entry) return null;
  if (Date.now() - entry.storedAt > TTL_MS) {
    void chrome.storage.local.remove(k);
    return null;
  }
  return entry.result;
}

export async function putCachedVerdict(result: ScanResult): Promise<void> {
  const entry: Entry = { result, storedAt: Date.now() };
  await chrome.storage.local.set({ [key(result.url)]: entry });
}
