import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Gmail's open conversation pane uses role="main". We scan all anchors inside
 * the main pane, skipping Gmail's own UI chrome.
 */
export const gmail: SiteAdapter = {
  id: "gmail",
  rootSelector: 'div[role="main"]',
  shouldScanLink(linkEl) {
    if (
      linkEl.closest(
        '[role="navigation"], [role="banner"], [role="toolbar"], header',
      )
    )
      return false;
    if (!linkEl.href) return false;
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
