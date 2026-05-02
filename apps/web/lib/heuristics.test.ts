import { describe, expect, it } from "vitest";
import { checkHeuristics } from "./heuristics";

describe("checkHeuristics", () => {
  it("returns null for a clean popular domain", () => {
    expect(checkHeuristics("https://www.google.com/")).toBeNull();
  });

  it("flags an IP-address host", () => {
    expect(checkHeuristics("http://192.168.1.1/login")).toEqual({
      threatType: "heuristic_ip_address",
    });
  });

  it("flags a host with mixed Latin and Cyrillic characters (homoglyph)", () => {
    // 'а' here is U+0430 Cyrillic
    expect(checkHeuristics("https://раypal.com/login")).toEqual({
      threatType: "heuristic_idn_homoglyph",
    });
  });

  it("flags suspicious TLDs", () => {
    expect(checkHeuristics("https://account-verify.tk/login")).toEqual({
      threatType: "heuristic_suspicious_tld",
    });
  });

  it("flags excessive subdomain depth", () => {
    expect(
      checkHeuristics("https://login.account.security.update.example.com/"),
    ).toEqual({ threatType: "heuristic_excessive_subdomains" });
  });

  it("flags typosquats of well-known brands", () => {
    expect(checkHeuristics("https://paypa1.com/")).toEqual({
      threatType: "heuristic_typosquat",
    });
    expect(checkHeuristics("https://g00gle.com/")).toEqual({
      threatType: "heuristic_typosquat",
    });
  });

  it("does not flag the brand itself", () => {
    expect(checkHeuristics("https://paypal.com/")).toBeNull();
    expect(checkHeuristics("https://www.google.com/")).toBeNull();
  });

  describe("brand mismatch (anchor-text-aware)", () => {
    it("flags 'download Adobe' link going to a non-Adobe domain", () => {
      expect(
        checkHeuristics(
          "https://payrolltooling.com/nam/Error/PageExpired",
          "Click here to download and install the Adobe update on your personal computer.",
        ),
      ).toEqual({ threatType: "heuristic_brand_mismatch" });
    });

    it("flags 'verify your PayPal account' link to a random host", () => {
      expect(
        checkHeuristics(
          "https://account-update.example.com/",
          "Verify your PayPal account",
        ),
      ).toEqual({ threatType: "heuristic_brand_mismatch" });
    });

    it("does not flag a real Adobe download link", () => {
      expect(
        checkHeuristics(
          "https://www.adobe.com/products/photoshop.html",
          "Download Adobe Photoshop",
        ),
      ).toBeNull();
    });

    it("does not flag casual brand mentions without a CTA verb", () => {
      // No 'click', 'download', 'verify' etc. — this is a news article link.
      expect(
        checkHeuristics(
          "https://techcrunch.com/2026/01/15/article",
          "Read more about Apple's announcement",
        ),
      ).toBeNull();
    });

    it("does not flag when anchor text is missing", () => {
      expect(
        checkHeuristics("https://payrolltooling.com/login"),
      ).toBeNull();
    });
  });
});
