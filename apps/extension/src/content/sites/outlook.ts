import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Outlook web is a moving target — the reading pane lives under different
 * roles depending on the layout (classic, new Outlook, monarch).
 * `[role="main"]` alone misses the message body in several layouts; fall
 * through to broader selectors and finally `body`. With `all_frames: true`
 * the script also runs inside any nested message-body iframes.
 *
 * URLs are wrapped by Microsoft's Safe Links service whose target is in the
 * `url` query parameter.
 */
const ROOT_SELECTORS = [
  '[role="main"]',
  '[role="document"]',
  '[aria-label="Reading Pane"]',
  '[aria-label*="Message body"]',
  '[data-app-section="ReadingPane"]',
  ".ReadingPaneContents",
  "body",
];

export const outlook: SiteAdapter = {
  id: "outlook",
  rootSelector: ROOT_SELECTORS.join(", "),
  shouldScanLink(linkEl) {
    if (
      linkEl.closest(
        '[role="navigation"], [role="banner"], [role="toolbar"], header',
      )
    )
      return false;
    if (!linkEl.href) return false;
    const href = linkEl.href;
    if (href.startsWith("javascript:")) return false;
    if (href.startsWith("mailto:")) return false;
    return true;
  },
  unwrapTrackingUrl(href) {
    try {
      const u = new URL(href);
      if (
        u.hostname === "safelinks.protection.outlook.com" ||
        u.hostname.endsWith(".safelinks.protection.outlook.com")
      ) {
        const real = u.searchParams.get("url");
        if (real) {
          try {
            return decodeURIComponent(real);
          } catch {
            return real;
          }
        }
      }
      // Microsoft 365 ATP wraps some links via a different path; fall back
      // gracefully if we can't unwrap.
      if (u.hostname === "linkprotect.cudasvc.com") {
        const real = u.searchParams.get("a");
        if (real) {
          try {
            return decodeURIComponent(real);
          } catch {
            return real;
          }
        }
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
