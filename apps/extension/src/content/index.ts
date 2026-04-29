import { getSettings } from "../shared/settings.js";
import type { SiteAdapter } from "./shared/site-adapter.js";
import { installClickGuard, rememberVerdict } from "./shared/click-guard.js";
import { installHoverTooltips } from "./shared/hover-tooltip.js";
import { paintAnchors } from "./shared/link-painter.js";
import { startLinkScanner } from "./shared/link-scanner.js";
import { gmail } from "./sites/gmail.js";
import { outlook } from "./sites/outlook.js";

void boot();

async function boot() {
  const settings = await getSettings();
  if (!settings.enabled) {
    console.log("[gonephishin] disabled in settings; skipping");
    return;
  }
  const adapter = pickAdapter();
  if (!adapter) return;
  console.log("[gonephishin] active on", adapter.id, "(", settings.verbosity, ")");

  installHoverTooltips();
  installClickGuard((url, outcome) => {
    chrome.runtime
      .sendMessage({ type: "warning-acknowledged", url, outcome })
      .catch(() => {
        /* listener absent is fine in v0.1a */
      });
  });
  startLinkScanner(adapter, (results, anchorsByUrl) => {
    for (const r of results) rememberVerdict(r);
    paintAnchors(results, anchorsByUrl, settings.verbosity);
  });
}

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
