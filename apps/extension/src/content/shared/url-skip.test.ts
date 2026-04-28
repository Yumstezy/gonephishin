import { describe, expect, it } from "vitest";
import { shouldSkipUrl } from "./url-skip.js";

describe("shouldSkipUrl", () => {
  it.each([
    "mailto:user@example.com",
    "tel:+15551234",
    "javascript:void(0)",
    "data:text/html,...",
    "chrome-extension://abc/page",
    "#section",
    "",
  ])("skips non-http schemes and anchors: %s", (url) => {
    expect(shouldSkipUrl(url)).toBe(true);
  });

  it("does not skip http and https URLs", () => {
    expect(shouldSkipUrl("https://example.com/foo")).toBe(false);
    expect(shouldSkipUrl("http://example.com/foo")).toBe(false);
  });

  it("skips relative URLs (no scheme)", () => {
    expect(shouldSkipUrl("/some/path")).toBe(true);
    expect(shouldSkipUrl("./local")).toBe(true);
  });
});
