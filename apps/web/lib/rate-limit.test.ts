import { afterEach, describe, expect, it } from "vitest";

// These tests require a real DATABASE_URL in the environment. Run them with:
//   pnpm --filter @gonephishin/web test rate-limit
// after `vercel env pull .env.local`.
const HAS_DB = !!process.env.DATABASE_URL;

const describeIfDb = HAS_DB ? describe : describe.skip;

describeIfDb("takeToken (requires DATABASE_URL)", () => {
  it("allows up to `limit` requests within the window", async () => {
    const { db } = await import("./db/client.js");
    const { rateLimitBuckets } = await import("./db/schema.js");
    const { takeToken } = await import("./rate-limit.js");
    await db.delete(rateLimitBuckets);
    for (let i = 0; i < 3; i++) {
      const ok = await takeToken("scan", "1.1.1.1", {
        limit: 3,
        windowMs: 60_000,
      });
      expect(ok).toBe(true);
    }
    const blocked = await takeToken("scan", "1.1.1.1", {
      limit: 3,
      windowMs: 60_000,
    });
    expect(blocked).toBe(false);
  });

  it("isolates buckets by identity", async () => {
    const { db } = await import("./db/client.js");
    const { rateLimitBuckets } = await import("./db/schema.js");
    const { takeToken } = await import("./rate-limit.js");
    await db.delete(rateLimitBuckets);
    expect(
      await takeToken("scan", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
    expect(
      await takeToken("scan", "2.2.2.2", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
  });

  it("isolates buckets by scope", async () => {
    const { db } = await import("./db/client.js");
    const { rateLimitBuckets } = await import("./db/schema.js");
    const { takeToken } = await import("./rate-limit.js");
    await db.delete(rateLimitBuckets);
    expect(
      await takeToken("scan", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
    expect(
      await takeToken("redeem", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
  });

  afterEach(async () => {
    if (!HAS_DB) return;
    const { db } = await import("./db/client.js");
    const { rateLimitBuckets } = await import("./db/schema.js");
    await db.delete(rateLimitBuckets);
  });
});
