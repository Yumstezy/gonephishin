import type { SiteAdapter } from "./shared/site-adapter.js";
import { installClickGuard, rememberVerdict } from "./shared/click-guard.js";
import { paintAnchors } from "./shared/link-painter.js";
import { startLinkScanner } from "./shared/link-scanner.js";
import { gmail } from "./sites/gmail.js";
import { outlook } from "./sites/outlook.js";

const adapter = pickAdapter();
if (adapter) start(adapter);

function pickAdapter(): SiteAdapter | null {
  const host = location.hostname;
  if (host === "mail.google.com") return gmail;
  if (
    host === "outlook.live.com" ||
    host === "outlook.office.com" ||
    host === "outlook.office365.com"
  )
    return outlook;
  return null;
}

function start(a: SiteAdapter) {
  console.log("[gonephishin] active on", a.id);
  installClickGuard((url, outcome) => {
    chrome.runtime
      .sendMessage({ type: "warning-acknowledged", url, outcome })
      .catch(() => {
        /* listener absent is fine in v0.1a */
      });
  });
  startLinkScanner(a, (results, anchorsByUrl) => {
    for (const r of results) rememberVerdict(r);
    paintAnchors(results, anchorsByUrl);
  });
}
