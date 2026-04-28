import type { ScanResult } from "@gonephishin/shared";
import type { ExtensionMessage } from "../shared/messages.js";
import { scanUrlsViaApi } from "./api-client.js";
import { getCachedVerdict, putCachedVerdict } from "./cache.js";

console.log("[gonephishin] service worker booted");

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === "scan-urls") {
      void handleScanUrls(message.urls).then((results) =>
        sendResponse({ results } satisfies { results: ScanResult[] }),
      );
      return true; // keep channel open for async sendResponse
    }
    if (message.type === "ping") {
      sendResponse({ ok: true });
      return false;
    }
    return false;
  },
);

async function handleScanUrls(urls: string[]): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const need: string[] = [];

  for (const url of urls) {
    const cached = await getCachedVerdict(url);
    if (cached) {
      results.push(cached);
    } else {
      need.push(url);
    }
  }

  if (need.length > 0) {
    const fresh = await scanUrlsViaApi(need);
    for (const r of fresh) {
      // Don't cache fallback verdicts — we want to retry next time.
      if (r.source !== "fallback") {
        await putCachedVerdict(r);
      }
      results.push(r);
    }
  }
  return results;
}
