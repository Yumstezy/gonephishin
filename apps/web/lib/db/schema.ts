import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const scanCache = pgTable("scan_cache", {
  // sha256 hex of the normalized URL — produced by url-normalize then hashed
  urlHash: text("url_hash").primaryKey(),
  verdict: text("verdict").notNull(),
  threatType: text("threat_type"),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type ScanCacheRow = typeof scanCache.$inferSelect;

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  // Composite key. `bucketKey` is `${scope}:${identity}`, e.g. "scan:1.2.3.4".
  bucketKey: text("bucket_key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull(),
});

export type RateLimitBucketRow = typeof rateLimitBuckets.$inferSelect;
