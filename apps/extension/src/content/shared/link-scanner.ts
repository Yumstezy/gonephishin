import type { ScanResult } from "@gonephishin/shared";
import type { SiteAdapter } from "./site-adapter.js";
import { shouldSkipUrl } from "./url-skip.js";

const BATCH_SIZE = 50;
const FLUSH_DEBOUNCE_MS = 200;

type OnVerdicts = (
  verdicts: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
) => void;

export function startLinkScanner(
  adapter: SiteAdapter,
  onVerdicts: OnVerdicts,
): () => void {
  const seen = new WeakSet<HTMLAnchorElement>();
  let pendingByUrl: Map<string, HTMLAnchorElement[]> = new Map();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const collect = () => {
    for (const root of document.querySelectorAll(adapter.rootSelector)) {
      const anchors = root.querySelectorAll<HTMLAnchorElement>("a[href]");
      for (const a of anchors) {
        if (seen.has(a)) continue;
        seen.add(a);
        if (!adapter.shouldScanLink(a)) continue;
        const target = adapter.unwrapTrackingUrl(a.href);
        if (shouldSkipUrl(target)) continue;
        a.dataset.gpUrl = target;
        const list = pendingByUrl.get(target);
        if (list) list.push(a);
        else pendingByUrl.set(target, [a]);
      }
    }
    scheduleFlush();
  };

  const scheduleFlush = () => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, FLUSH_DEBOUNCE_MS);
  };

  const flush = async () => {
    if (pendingByUrl.size === 0) return;
    const batch = pendingByUrl;
    pendingByUrl = new Map();
    const urls = Array.from(batch.keys());
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const slice = urls.slice(i, i + BATCH_SIZE);
      const sliceMap = new Map<string, HTMLAnchorElement[]>();
      for (const u of slice) sliceMap.set(u, batch.get(u)!);
      try {
        const response = (await chrome.runtime.sendMessage({
          type: "scan-urls",
          urls: slice,
        })) as { results: ScanResult[] } | undefined;
        if (response) onVerdicts(response.results, sliceMap);
      } catch (err) {
        console.warn("[gonephishin] scan dispatch failed", err);
      }
    }
  };

  const dispose = adapter.observeMutations(collect);
  collect();
  return () => {
    if (timer) clearTimeout(timer);
    dispose();
  };
}
