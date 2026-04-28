import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lookupSafeBrowsing } from "./safe-browsing.js";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  process.env.SAFE_BROWSING_API_KEY = "test-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("lookupSafeBrowsing", () => {
  it("returns 'safe' for URLs absent from the response matches array", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );
    const result = await lookupSafeBrowsing(["https://example.com/"]);
    expect(result.get("https://example.com/")).toEqual({
      url: "https://example.com/",
      verdict: "safe",
      threatType: null,
    });
  });

  it("maps SOCIAL_ENGINEERING matches to dangerous", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              threatType: "SOCIAL_ENGINEERING",
              threat: { url: "https://bad.example/" },
              platformType: "ANY_PLATFORM",
              threatEntryType: "URL",
            },
          ],
        }),
        { status: 200 },
      ),
    );
    const result = await lookupSafeBrowsing(["https://bad.example/"]);
    expect(result.get("https://bad.example/")).toEqual({
      url: "https://bad.example/",
      verdict: "dangerous",
      threatType: "sb_social_engineering",
    });
  });

  it("throws when the API returns 5xx so the caller can fall back", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 503 }));
    await expect(lookupSafeBrowsing(["https://example.com/"])).rejects.toThrow();
  });
});
