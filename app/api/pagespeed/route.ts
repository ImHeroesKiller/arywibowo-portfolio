import { NextResponse } from "next/server";

import {
  FALLBACK_PAGE_SPEED_SCORES,
  PAGESPEED_API_URL,
  PAGESPEED_TARGET_URL,
  isPageSpeedScores,
  type PageSpeedApiResponse,
  type PageSpeedScores,
} from "@/lib/pagespeed";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const dynamic = "force-dynamic";

type MemoryCache = {
  data: PageSpeedScores;
  expiresAt: number;
};

let memoryCache: MemoryCache | null = null;

function parseScores(payload: unknown): PageSpeedScores | null {
  const categories = (
    payload as {
      lighthouseResult?: {
        categories?: Record<string, { score?: number | null }>;
      };
    }
  ).lighthouseResult?.categories;

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
  ) {
    return null;
  }

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

function buildApiUrl() {
  const params = new URLSearchParams({
    url: PAGESPEED_TARGET_URL,
    strategy: "desktop",
  });

  for (const category of [
    "performance",
    "accessibility",
    "seo",
    "best-practices",
  ]) {
    params.append("category", category);
  }

  const apiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (apiKey) {
    params.set("key", apiKey);
  }

  return `${PAGESPEED_API_URL}?${params.toString()}`;
}

async function fetchPageSpeedScores(): Promise<PageSpeedScores> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(buildApiUrl(), {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `PageSpeed API responded with ${response.status}: ${body.slice(0, 300)}`
      );
    }

    const payload = await response.json();
    const scores = parseScores(payload);

    if (!scores) {
      throw new Error("Unable to parse PageSpeed scores");
    }

    return scores;
  } finally {
    clearTimeout(timeout);
  }
}

function jsonResponse(data: PageSpeedApiResponse) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
    },
  });
}

function fallbackResponse(source: "stale-cache" | "static") {
  const data: PageSpeedApiResponse = {
    ...(source === "stale-cache" && memoryCache
      ? memoryCache.data
      : FALLBACK_PAGE_SPEED_SCORES),
    fallback: true,
    cacheHit: source === "stale-cache",
  };

  return jsonResponse(data);
}

export async function GET() {
  const now = Date.now();

  if (memoryCache && memoryCache.expiresAt > now) {
    return jsonResponse({ ...memoryCache.data, cacheHit: true });
  }

  try {
    const scores = await fetchPageSpeedScores();
    memoryCache = {
      data: scores,
      expiresAt: now + CACHE_TTL_MS,
    };
    return jsonResponse({ ...scores, cacheHit: false, fallback: false });
  } catch (error) {
    console.error("PageSpeed API error:", error);

    if (memoryCache) {
      return fallbackResponse("stale-cache");
    }

    return fallbackResponse("static");
  }
}