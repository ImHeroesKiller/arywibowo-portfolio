import { NextResponse } from "next/server";

import {
  FALLBACK_PAGE_SPEED_SCORES,
  PAGESPEED_API_URL,
  PAGESPEED_TARGET_URL,
  isPageSpeedScores,
  type PageSpeedApiResponse,
  type PageSpeedScores,
} from "@/lib/pagespeed";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FAILURE_RETRY_MS = 2 * 60 * 60 * 1000;
let memoryCache: { data: PageSpeedScores; expiresAt: number } | null = null;
let retryAfter = 0;
let inflight: Promise<PageSpeedScores> | null = null;

function parseScores(payload: unknown): PageSpeedScores | null {
  const categories = (
    payload as { lighthouseResult?: { categories?: Record<string, { score?: number | null }> } }
  )?.lighthouseResult?.categories;
  if (!categories) return null;
  const readScore = (key: string) => {
    const value = categories[key]?.score;
    return typeof value === "number" ? Math.round(value * 100) : null;
  };
  const performance = readScore("performance");
  const accessibility = readScore("accessibility");
  const seo = readScore("seo");
  const bestPractices = readScore("best-practices");
  if (
    performance === null ||
    accessibility === null ||
    seo === null ||
    bestPractices === null
  ) return null;
  const scores: PageSpeedScores = {
    performance,
    accessibility,
    seo,
    bestPractices,
    checkedAt: new Date().toISOString(),
    url: PAGESPEED_TARGET_URL,
  };
  return isPageSpeedScores(scores) ? scores : null;
}

async function queryScores(apiKey: string): Promise<PageSpeedScores> {
  const params = new URLSearchParams({ url: PAGESPEED_TARGET_URL, strategy: "desktop", key: apiKey });
  for (const category of ["performance", "accessibility", "seo", "best-practices"]) {
    params.append("category", category);
  }

  const response = await fetch(`${PAGESPEED_API_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(12000),
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`PageSpeed HTTP ${response.status}`);
  }
  const scores = parseScores(await response.json());
  if (!scores) throw new Error("PageSpeed invalid score format");
  return scores;
}

function jsonResponse(data: PageSpeedApiResponse) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function historicalFallback(): PageSpeedApiResponse {
  return {
    ...(memoryCache?.data || FALLBACK_PAGE_SPEED_SCORES),
    cacheHit: Boolean(memoryCache),
    fallback: true,
  };
}

export async function GET() {
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    return jsonResponse({ ...memoryCache.data, cacheHit: true, fallback: false });
  }

  // Do not spend the public, anonymous Google quota on every portfolio visit.
  // Add PAGESPEED_API_KEY in Vercel to re-enable daily live measurements.
  const apiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (!apiKey || retryAfter > now) return jsonResponse(historicalFallback());

  try {
    if (!inflight) {
      inflight = queryScores(apiKey).finally(() => {
        inflight = null;
      });
    }
    const scores = await inflight;
    memoryCache = { data: scores, expiresAt: now + CACHE_TTL_MS };
    retryAfter = 0;
    return jsonResponse({ ...scores, cacheHit: false, fallback: false });
  } catch (error) {
    // Do not log API keys or Google response bodies.
    console.warn("PageSpeed temporarily unavailable:", error instanceof Error ? error.message : "unknown");
    retryAfter = Date.now() + FAILURE_RETRY_MS;
    return jsonResponse(historicalFallback());
  }
}
