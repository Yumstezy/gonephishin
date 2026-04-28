import { describe, expect, it } from "vitest";
import { checkHeuristics } from "./heuristics.js";

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
});
