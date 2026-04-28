import type {
  ScanRequest,
  ScanResponse,
  ScanResult,
  Verdict,
} from "@gonephishin/shared";
import { NextResponse } from "next/server";
import { checkHeuristics } from "@/lib/heuristics";
import { takeToken } from "@/lib/rate-limit";
import { lookupSafeBrowsing } from "@/lib/safe-browsing";
import { lookupCache, storeCacheEntries } from "@/lib/scan-cache";

export const runtime = "nodejs";
export const maxDuration = 10;

const RATE_LIMIT = { limit: 600, windowMs: 60 * 60 * 1000 }; // 600 / hour / IP

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request): Promise<Response> {
  let body: ScanRequest;
  try {
    body = (await request.json()) as ScanRequest;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: "urls required" }, { status: 400 });
  }
  if (body.urls.length > 100) {
    return NextResponse.json({ error: "too many urls" }, { status: 413 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await takeToken("scan", ip, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const results: ScanResult[] = [];
  const needsSb: string[] = [];

  // 1) Local heuristics (catches some attacks before any external lookup).
  const heuristicVerdicts = new Map<string, ScanResult>();
  for (const url of body.urls) {
    const h = checkHeuristics(url);
    if (h) {
      heuristicVerdicts.set(url, {
        url,
        verdict: "sketchy" satisfies Verdict,
        threatType: h.threatType,
        source: "heuristic",
      });
    }
  }

  // 2) Cache lookup for everything not flagged by heuristics.
  const remaining = body.urls.filter((u) => !heuristicVerdicts.has(u));
  let cached = new Map<
    string,
    { url: string; verdict: Verdict; threatType: ScanResult["threatType"] }
  >();
  try {
    cached = await lookupCache(remaining);
  } catch {
    // Cache failure is non-fatal; we just go straight to the API.
  }

  for (const url of remaining) {
    const c = cached.get(url);
    if (c) {
      results.push({
        url,
        verdict: c.verdict,
        threatType: c.threatType,
        source: "cache",
      });
    } else {
      needsSb.push(url);
    }
  }

  // 3) Safe Browsing for the rest. On failure, mark them unknown/fallback.
  if (needsSb.length > 0) {
    try {
      const sb = await lookupSafeBrowsing(needsSb);
      const toStore: {
        url: string;
        verdict: Verdict;
        threatType: ScanResult["threatType"];
      }[] = [];
      for (const url of needsSb) {
        const v = sb.get(url) ?? {
          url,
          verdict: "safe" as Verdict,
          threatType: null,
        };
        results.push({
          url,
          verdict: v.verdict,
          threatType: v.threatType,
          source: "fresh",
        });
        toStore.push(v);
      }
      // Best-effort write; do not block the response on failure.
      storeCacheEntries(toStore).catch((err) =>
        console.error("scan-cache store failed", err),
      );
    } catch (err) {
      console.error("safe browsing lookup failed", err);
      for (const url of needsSb) {
        results.push({
          url,
          verdict: "unknown",
          threatType: null,
          source: "fallback",
        });
      }
    }
  }

  // Append heuristic verdicts at the end so the response covers all input.
  for (const v of heuristicVerdicts.values()) results.push(v);

  const response: ScanResponse = { results, paired: false };
  return NextResponse.json(response);
}
