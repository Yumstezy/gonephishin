import { createHash } from "node:crypto";
import { and, gt, inArray } from "drizzle-orm";
import type { ThreatType, Verdict } from "@gonephishin/shared";
import { db } from "./db/client";
import { scanCache } from "./db/schema";
import { normalizeUrl } from "./url-normalize";

const TTL_MS = 6 * 60 * 60 * 1000; // 6h per spec §3 / §6

export function urlHash(url: string): string {
  // Hash the normalized form so URL aliasing collapses to one cache entry.
  const normalized = normalizeUrl(url);
  return createHash("sha256").update(normalized).digest("hex");
}

export interface CachedVerdict {
  url: string;
  verdict: Verdict;
  threatType: ThreatType;
}

/** Returns a map keyed by the original (unnormalized) URL. */
export async function lookupCache(
  urls: string[],
): Promise<Map<string, CachedVerdict>> {
  const result = new Map<string, CachedVerdict>();
  if (urls.length === 0) return result;

  const hashToUrl = new Map<string, string>();
  for (const u of urls) {
    try {
      hashToUrl.set(urlHash(u), u);
    } catch {
      // unsupported scheme — skip
    }
  }
  if (hashToUrl.size === 0) return result;

  const rows = await db
    .select()
    .from(scanCache)
    .where(
      and(
        inArray(scanCache.urlHash, Array.from(hashToUrl.keys())),
        gt(scanCache.expiresAt, new Date()),
      ),
    );

  for (const row of rows) {
    const url = hashToUrl.get(row.urlHash);
    if (!url) continue;
    result.set(url, {
      url,
      verdict: row.verdict as Verdict,
      threatType: (row.threatType as ThreatType) ?? null,
    });
  }
  return result;
}

export async function storeCacheEntries(entries: CachedVerdict[]): Promise<void> {
  if (entries.length === 0) return;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_MS);
  const rows = entries.map((e) => ({
    urlHash: urlHash(e.url),
    verdict: e.verdict,
    threatType: e.threatType,
    checkedAt: now,
    expiresAt,
  }));
  await db
    .insert(scanCache)
    .values(rows)
    .onConflictDoUpdate({
      target: scanCache.urlHash,
      set: {
        verdict: scanCache.verdict,
        threatType: scanCache.threatType,
        checkedAt: now,
        expiresAt,
      },
    });
}
