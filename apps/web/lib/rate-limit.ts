import { sql } from "drizzle-orm";
import { db } from "./db/client";

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

/**
 * Atomic fixed-window rate limiter backed by Postgres. Returns true if the
 * caller is allowed; false if they have exceeded `limit` within the current
 * `windowMs` window.
 *
 * Implemented as a single SQL UPSERT to avoid races between concurrent
 * Fluid Compute invocations.
 */
export async function takeToken(
  scope: string,
  identity: string,
  config: RateLimitConfig,
): Promise<boolean> {
  const key = `${scope}:${identity}`;
  // postgres-js with prepare:false doesn't auto-serialize Date in raw SQL,
  // so we pass ISO strings.
  const now = new Date().toISOString();
  const windowStart = new Date(Date.now() - config.windowMs).toISOString();

  const result = await db.execute(sql`
    INSERT INTO rate_limit_buckets (bucket_key, window_start, count)
    VALUES (${key}, ${now}::timestamptz, 1)
    ON CONFLICT (bucket_key) DO UPDATE
      SET window_start = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart}::timestamptz THEN ${now}::timestamptz
            ELSE rate_limit_buckets.window_start
          END,
          count = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart}::timestamptz THEN 1
            ELSE rate_limit_buckets.count + 1
          END
    RETURNING count
  `);
  const row = (result as unknown as Array<{ count: number }>)[0];
  return (row?.count ?? Number.POSITIVE_INFINITY) <= config.limit;
}
