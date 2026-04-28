import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCachedVerdict, putCachedVerdict } from "./cache.js";

const storage: Record<string, unknown> = {};

beforeEach(() => {
  for (const k of Object.keys(storage)) delete storage[k];
  (globalThis as unknown as { chrome: typeof chrome }).chrome = {
    storage: {
      local: {
        async get(keys: string | string[]) {
          const arr = Array.isArray(keys) ? keys : [keys];
          const out: Record<string, unknown> = {};
          for (const k of arr) if (k in storage) out[k] = storage[k];
          return out;
        },
        async set(items: Record<string, unknown>) {
          Object.assign(storage, items);
        },
        async remove(keys: string | string[]) {
          const arr = Array.isArray(keys) ? keys : [keys];
          for (const k of arr) delete storage[k];
        },
      },
    },
  } as unknown as typeof chrome;
});

afterEach(() => vi.useRealTimers());

describe("verdict cache", () => {
  it("returns null for an empty cache", async () => {
    expect(await getCachedVerdict("https://x.com/")).toBeNull();
  });

  it("returns a stored verdict within TTL", async () => {
    await putCachedVerdict({
      url: "https://x.com/",
      verdict: "safe",
      threatType: null,
      source: "cache",
    });
    expect((await getCachedVerdict("https://x.com/"))?.verdict).toBe("safe");
  });

  it("expires entries past 24h", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-28T00:00:00Z"));
    await putCachedVerdict({
      url: "https://x.com/",
      verdict: "safe",
      threatType: null,
      source: "cache",
    });
    vi.setSystemTime(new Date("2026-04-29T00:00:01Z"));
    expect(await getCachedVerdict("https://x.com/")).toBeNull();
  });
});
