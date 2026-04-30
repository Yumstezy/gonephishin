import type { ScanResult } from "@gonephishin/shared";
import type { ExtensionMessage } from "../shared/messages.js";
import { setPairedState } from "../shared/paired-state.js";
import { logEventViaApi, scanUrlsViaApi } from "./api-client.js";
import { getCachedVerdict, putCachedVerdict } from "./cache.js";

console.log("[gonephishin] service worker booted");

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === "scan-urls") {
      void handleScanUrls(message.urls).then((results) =>
        sendResponse({ results } satisfies { results: ScanResult[] }),
      );
      return true;
    }
    if (message.type === "warning-acknowledged") {
      void handleWarningAcknowledged(message.url, message.outcome);
      sendResponse({ ok: true });
      return false;
    }
    if (message.type === "ping") {
      sendResponse({ ok: true });
      return false;
    }
    return false;
  },
);

// Receives the token handoff from the web app's /extension/activate page.
// The matches list is set in manifest.config.ts (externally_connectable).
chrome.runtime.onMessageExternal.addListener(
  (message, _sender, sendResponse) => {
    if (
      message &&
      typeof message === "object" &&
      (message as { type?: string }).type === "activate-with-token"
    ) {
      const m = message as {
        type: "activate-with-token";
        token: string;
        circleId: string;
        label: string;
      };
      void setPairedState({
        token: m.token,
        circleId: m.circleId,
        label: m.label,
      }).then(() => sendResponse({ ok: true }));
      return true;
    }
    sendResponse({ ok: false });
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
      if (r.source !== "fallback") {
        await putCachedVerdict(r);
      }
      results.push(r);
    }
  }
  return results;
}

async function handleWarningAcknowledged(
  url: string,
  outcome: "dismissed" | "ignored_warning",
): Promise<void> {
  const cached = await getCachedVerdict(url);
  await logEventViaApi({
    url,
    threatType: cached?.threatType ?? "unknown",
    action: outcome,
    sourceSite: hostFromUrl(url),
  });
}

function hostFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    if (host === "mail.google.com") return "gmail";
    if (host.startsWith("outlook.")) return "outlook";
    return host;
  } catch {
    return "unknown";
  }
}
