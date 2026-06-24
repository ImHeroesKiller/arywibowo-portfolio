import { NextResponse } from "next/server";

import {
  PAGESPEED_TARGET_URL,
  type PageSpeedScores,
} from "@/lib/pagespeed";

const PAGESPEED_API =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
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

  return {
    performance,
    accessibility,
    seo,
    bestPractices,
    checkedAt: new Date().toISOString(),
    url: PAGESPEED_TARGET_URL,
  };
}

async function fetchPageSpeedScores(): Promise<PageSpeedScores> {
  const params = new URLSearchParams({
    url: PAGESPEED_TARGET_URL,
    strategy: "mobile",
  });

  for (const category of [
    "performance",
    "accessibility",
    "seo",
    "best-practices",
  ]) {
    params.append("category", category);
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (apiKey) {
    params.set("key", apiKey);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(`${PAGESPEED_API}?${params.toString()}`, {
      signal: controller.signal,
      next: { revalidate: CACHE_TTL_MS / 1000 },
    });

    if (!response.ok) {
      throw new Error(`PageSpeed API responded with ${response.status}`);
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

function jsonResponse(data: PageSpeedScores, cacheHit: boolean) {
  return NextResponse.json(
    { ...data, cacheHit },
    {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
      },
    }
  );
}

export async function GET() {
  const now = Date.now();

  if (memoryCache && memoryCache.expiresAt > now) {
    return jsonResponse(memoryCache.data, true);
  }

  try {
    const scores = await fetchPageSpeedScores();
    memoryCache = {
      data: scores,
      expiresAt: now + CACHE_TTL_MS,
    };
    return jsonResponse(scores, false);
  } catch (error) {
    console.error("PageSpeed API error:", error);

    if (memoryCache) {
      return jsonResponse(memoryCache.data, true);
    }

    return NextResponse.json(
      { error: "PAGESPEED_UNAVAILABLE" },
      { status: 503 }
    );
  }
}