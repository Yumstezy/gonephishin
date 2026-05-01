import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Gmail's conversation pane uses `[role="main"]` at the top level. Some HTML
 * emails are sandboxed in iframes — the manifest already enables
 * `all_frames: true`, so when the script runs inside an iframe we just scan
 * the whole document. Falling back to `body` keeps us working if Gmail ever
 * changes the role attribute.
 */
const ROOT_SELECTORS = [
  'div[role="main"]',
  'div[aria-label="Message Body"]',
  "body",
];

export const gmail: SiteAdapter = {
  id: "gmail",
  rootSelector: ROOT_SELECTORS.join(", "),
  shouldScanLink(linkEl) {
    if (
      linkEl.closest(
        '[role="navigation"], [role="banner"], [role="toolbar"], header',
      )
    )
      return false;
    if (!linkEl.href) return false;
    // Skip Gmail's own internal links (e.g. starring, label management).
    const href = linkEl.href;
    if (href.startsWith("javascript:")) return false;
    if (href.startsWith("mailto:")) return false;
    return true;
  },
  unwrapTrackingUrl(href) {
    try {
      const u = new URL(href);
      // google.com/url?q=<real>&...
      if (u.hostname.endsWith("google.com") && u.pathname === "/url") {
        const real = u.searchParams.get("q");
        if (real) return real;
      }
      // l.gmail.com/<token>?<real-url-encoded>
      if (u.hostname === "l.gmail.com") {
        const real = u.searchParams.get("u") ?? u.searchParams.get("q");
        if (real) return real;
      }
    } catch {
      /* fall through */
    }
    return href;
  },
  observeMutations(onChange) {
    const observer = new MutationObserver(() => onChange());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  },
};
