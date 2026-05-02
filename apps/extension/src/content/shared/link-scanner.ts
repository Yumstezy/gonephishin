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
        // Cache the anchor text so the brand-mismatch heuristic can see
        // what the link claims to be ("download Adobe…") and compare it
        // to where it actually goes.
        const anchorText = readAnchorText(a);
        if (anchorText) a.dataset.gpText = anchorText;
        const list = pendingByUrl.get(target);
        if (list) list.push(a);
        else pendingByUrl.set(target, [a]);
      }
    }
    scheduleFlush();
  };

  const readAnchorText = (a: HTMLAnchorElement): string => {
    // Prefer the rendered text, then aria-label, then title, then alt of any
    // child image. Trim and cap so we don't ship paragraph-length payloads.
    const candidates = [
      a.textContent,
      a.getAttribute("aria-label"),
      a.getAttribute("title"),
      a.querySelector("img")?.getAttribute("alt"),
    ];
    for (const c of candidates) {
      const t = c?.replace(/\s+/g, " ").trim();
      if (t) return t.slice(0, 240);
    }
    return "";
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
      const meta: Array<{ anchorText?: string }> = [];
      for (const u of slice) {
        const anchors = batch.get(u)!;
        sliceMap.set(u, anchors);
        // First anchor's text is representative; if multiple anchors share
        // the URL, picking one is fine (they're going to the same place).
        const first = anchors[0]?.dataset.gpText;
        meta.push(first ? { anchorText: first } : {});
      }
      try {
        const response = (await chrome.runtime.sendMessage({
          type: "scan-urls",
          urls: slice,
          meta,
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
