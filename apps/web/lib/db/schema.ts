import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const circles = pgTable("circles", {
  id: uuid("id").primaryKey().defaultRandom(),
  // FK → users.id; enforced in app code (Drizzle will get a real FK in v0.2).
  ownerId: uuid("owner_id").notNull(),
  label: text("label").notNull(),
  // 'caregiver' | 'self'
  mode: text("mode").notNull(),
  // Only set for caregiver-managed circles using the v0.2 email-invite flow.
  seniorEmail: text("senior_email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pairingCodes = pgTable("pairing_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleId: uuid("circle_id").notNull(),
  // 6-digit string, plaintext, leading zeros preserved. Caregiver reads it
  // aloud over a phone call so we can't hash it.
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
});

export const extensionTokens = pgTable("extension_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleId: uuid("circle_id").notNull(),
  // sha256 of the bearer token. Plaintext lives only in the extension.
  tokenHash: text("token_hash").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const dangerEvents = pgTable("danger_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Nullable — anonymous-mode events have no circle and aren't stored.
  circleId: uuid("circle_id"),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  threatType: text("threat_type").notNull(),
  // 'shown' | 'dismissed' | 'ignored_warning'
  action: text("action").notNull(),
  // 'gmail' | 'outlook' | etc.
  sourceSite: text("source_site").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type CircleRow = typeof circles.$inferSelect;
export type PairingCodeRow = typeof pairingCodes.$inferSelect;
export type ExtensionTokenRow = typeof extensionTokens.$inferSelect;
export type DangerEventRow = typeof dangerEvents.$inferSelect;
