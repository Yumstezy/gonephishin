import type { ScanResult } from "@gonephishin/shared";

export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      // Skip the Safe ✓ when the link is an image (logos, icons,
      // app-store buttons) or short text (nav links, button labels).
      // Those don't benefit from a "checked OK" indicator and the badge
      // becomes pure clutter. Warnings (Unknown/Sketchy/Dangerous) still
      // paint on every link regardless — they need attention.
      if (r.verdict === "safe" && (isImageOnlyLink(a) || isShortText(a))) {
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

const SHORT_TEXT_LIMIT = 25; // ~3-4 words; tune if needed

function isShortText(a: HTMLAnchorElement): boolean {
  const text = a.textContent?.trim() ?? "";
  return text.length > 0 && text.length < SHORT_TEXT_LIMIT;
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
