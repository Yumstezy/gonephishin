import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Outlook (web) wraps every link with safelinks.protection.outlook.com.
 * The real URL is in the `url` query parameter.
 */
export const outlook: SiteAdapter = {
  id: "outlook",
  rootSelector: '[role="main"]',
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
      if (
        u.hostname === "safelinks.protection.outlook.com" ||
        u.hostname.endsWith(".safelinks.protection.outlook.com")
      ) {
        const real = u.searchParams.get("url");
        if (real) return decodeURIComponent(real);
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
