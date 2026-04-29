import type { ScanResult } from "@gonephishin/shared";

export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      // Don't paint Safe — it's the overwhelming majority of links and
      // marking each one creates visual clutter (newsletter footers, social
      // icons, app-store badges). Only paint the states the user needs to
      // act on: Unknown, Sketchy, Dangerous.
      if (r.verdict === "safe") {
        a.title = describe(r);
        continue;
      }
      a.classList.add("gp-link");
      a.dataset.gpState = r.verdict;
      if (r.threatType) a.dataset.gpThreat = r.threatType;
      a.title = describe(r);
    }
  }
}

function describe(r: ScanResult): string {
  switch (r.verdict) {
    case "safe":
      return "Gone Phishin' checked this link — it looks safe.";
    case "unknown":
      return "Gone Phishin' couldn't check this link right now. Be careful.";
    case "sketchy":
      return `Gone Phishin' thinks this link looks suspicious (${r.threatType ?? "unknown"}).`;
    case "dangerous":
      return `Gone Phishin' has flagged this link as dangerous (${r.threatType ?? "unknown"}). Do not click.`;
  }
}
