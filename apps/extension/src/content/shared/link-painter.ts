import type { ScanResult } from "@gonephishin/shared";

export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      // Image-only anchors (logos, social icons, app-store buttons) are
      // self-explanatory click targets — adding a green ✓ underneath each
      // one is pure clutter. Skip painting Safe for those, but still paint
      // warnings (Unknown/Sketchy/Dangerous) since those need user attention
      // regardless of whether the link is an icon or text.
      if (r.verdict === "safe" && isImageOnlyLink(a)) {
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

function isImageOnlyLink(a: HTMLAnchorElement): boolean {
  const text = a.textContent?.trim() ?? "";
  if (text.length > 0) return false;
  return !!a.querySelector("img, svg, picture");
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
