const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
};

/**
 * Canonicalize a URL so that equivalent URLs produce the same string.
 * Throws for non-http(s) schemes — those should be filtered earlier.
 */
export function normalizeUrl(input: string): string {
  const u = new URL(input);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error(`unsupported scheme: ${u.protocol}`);
  }

  if (u.port === DEFAULT_PORTS[u.protocol]) u.port = "";

  const collapsedPath = u.pathname.replace(/\/{2,}/g, "/") || "/";
  u.pathname = collapsedPath
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .map(encodeUriPathSegment)
    .join("/");

  u.hash = "";
  return u.toString();
}

function encodeUriPathSegment(segment: string): string {
  return segment.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@/]/g, (ch) =>
    encodeURIComponent(ch),
  );
}
