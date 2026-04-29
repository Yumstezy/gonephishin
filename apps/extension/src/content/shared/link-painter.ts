import type { ScanResult, Verdict } from "@gonephishin/shared";
import type { Verbosity } from "../../shared/settings.js";
import { isLikelyCta } from "./cta-detection.js";

/**
 * Apply the always-visible inline mark to scanned anchors that warrant it
 * (warnings always; for safe/unknown only when the link is a likely CTA),
 * and tag those same anchors with data-gp-state so the hover tooltip
 * activates on them.
 *
 * Anchors that don't get painted are left completely untouched — no class,
 * no data attrs, no hover behavior. That keeps the extension out of the
 * user's way while reading dense promo emails: only the link they're
 * actually about to click reveals a pill on hover.
 *
 * Click-guard protection isn't reduced — it lives on data-gp-url (set
 * earlier by the scanner) and the verdict map, both of which are
 * populated regardless of whether the painter applies a visible mark.
 */
export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
  verbosity: Verbosity,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      a.title = describe(r);

      if (!shouldPaintInline(r.verdict, verbosity, a)) continue;

      a.classList.add("gp-link");
      a.dataset.gpState = r.verdict;
      if (r.threatType) a.dataset.gpThreat = r.threatType;
    }
  }
}

function shouldPaintInline(
  verdict: Verdict,
  verbosity: Verbosity,
  a: HTMLAnchorElement,
): boolean {
  if (verdict === "sketchy" || verdict === "dangerous") return true;
  if (verbosity === "verbose") return true;
  if (verbosity === "minimal") return false;
  return isLikelyCta(a);
}

function describe(r: ScanResult): string {
  switch (r.verdict) {
    case "safe":
      return "Gone Phishin' checked this link — it looks safe.";
    case "unknown":
      return "Gone Phishin' couldn't check this link. Be careful.";
    case "sketchy":
      return `Gone Phishin' thinks this link looks suspicious (${r.threatType ?? "unknown"}).`;
    case "dangerous":
      return `Gone Phishin' has flagged this link as dangerous (${r.threatType ?? "unknown"}). Do not click.`;
  }
}
