import { sql } from "drizzle-orm";
import { db } from "./db/client.js";

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
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  const result = await db.execute(sql`
    INSERT INTO rate_limit_buckets (bucket_key, window_start, count)
    VALUES (${key}, ${now}, 1)
    ON CONFLICT (bucket_key) DO UPDATE
      SET window_start = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart} THEN ${now}
            ELSE rate_limit_buckets.window_start
          END,
          count = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart} THEN 1
            ELSE rate_limit_buckets.count + 1
          END
    RETURNING count
  `);
  const row = (result as unknown as Array<{ count: number }>)[0];
  return (row?.count ?? Number.POSITIVE_INFINITY) <= config.limit;
}
