const HTTP_SCHEME = /^https?:\/\//i;

export function shouldSkipUrl(url: string): boolean {
  if (!url) return true;
  return !HTTP_SCHEME.test(url);
}
