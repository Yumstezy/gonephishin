import type { ScanResult } from "@gonephishin/shared";
import { shouldPaintAlways, type Verbosity } from "../../shared/settings.js";

/**
 * Tag every scanned anchor with data-gp-state so the hover tooltip can find
 * it. Only add the visible `gp-link` class (which triggers the colored
 * underline + inline badge) when verbosity rules say to paint always —
 * otherwise the link stays untouched and the tooltip on hover is the user's
 * cue that the extension is doing something.
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

      if (shouldPaintAlways(r.verdict, verbosity)) {
        a.classList.add("gp-link");
      }
    }
  }
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
