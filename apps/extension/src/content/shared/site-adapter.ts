export interface SiteAdapter {
  /** Identifier reported in danger-event logs. */
  id: "gmail" | "outlook";

  /** CSS selector identifying the page region(s) that contain message bodies. */
  rootSelector: string;

  /** Decide whether to scan a particular link. False = skip silently. */
  shouldScanLink(linkEl: HTMLAnchorElement): boolean;

  /**
   * Resolve a possibly-wrapped href to the real destination. Common cases:
   *   - google.com/url?q=...
   *   - safelinks.protection.outlook.com/?url=...
   * Return the original href if no unwrapping is needed.
   */
  unwrapTrackingUrl(href: string): string;

  /**
   * Set up a MutationObserver scoped to the site's SPA model. Calls
   * `onChange` whenever new scannable content appears. Returns a disposer.
   */
  observeMutations(onChange: () => void): () => void;
}
