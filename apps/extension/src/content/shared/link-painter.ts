import type { ScanResult, Verdict } from "@gonephishin/shared";
import type { Verbosity } from "../../shared/settings.js";
import { isLikelyCta } from "./cta-detection.js";

/**
 * Tag every scanned anchor with data-gp-state so the hover tooltip can find
 * it. Only add the visible `gp-link` class (which triggers the colored
 * underline + inline badge) when it actually matters: the link is flagged
 * sketchy/dangerous (safety overrides clutter), or — for safe/unknown
 * links — the link looks like a primary call-to-action the user is about
 * to click. Verbose mode marks everything.
 */
export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
  verbosity: Verbosity,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      a.dataset.gpState = r.verdict;
      if (r.threatType) a.dataset.gpThreat = r.threatType;
      a.title = describe(r);

      if (shouldPaintInline(r.verdict, verbosity, a)) {
        a.classList.add("gp-link");
      }
    }
  }
}

function shouldPaintInline(
  verdict: Verdict,
  verbosity: Verbosity,
  a: HTMLAnchorElement,
): boolean {
  // Always-on warnings — a dangerous footer link must still scream.
  if (verdict === "sketchy" || verdict === "dangerous") return true;

  if (verbosity === "verbose") return true;
  if (verbosity === "minimal") return false;

  // Standard: only mark Safe/Unknown when the user is realistically about
  // to click them.
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
