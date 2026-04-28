import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./url-normalize.js";

describe("normalizeUrl", () => {
  it("lowercases the host and drops the default port", () => {
    expect(normalizeUrl("HTTP://Example.COM:80/Path")).toBe(
      "http://example.com/Path",
    );
  });

  it("preserves path case but strips fragment", () => {
    expect(normalizeUrl("https://example.com/Foo#bar")).toBe(
      "https://example.com/Foo",
    );
  });

  it("collapses repeated slashes in the path", () => {
    expect(normalizeUrl("https://example.com//foo///bar")).toBe(
      "https://example.com/foo/bar",
    );
  });

  it("decodes safe percent-encoding in the path", () => {
    expect(normalizeUrl("https://example.com/%7Euser")).toBe(
      "https://example.com/~user",
    );
  });

  it("converts IDN host to punycode", () => {
    expect(normalizeUrl("https://пример.испытание/")).toBe(
      "https://xn--e1afmkfd.xn--80akhbyknj4f/",
    );
  });

  it("throws for non-http(s) schemes", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow();
    expect(() => normalizeUrl("mailto:a@b.com")).toThrow();
  });
});
