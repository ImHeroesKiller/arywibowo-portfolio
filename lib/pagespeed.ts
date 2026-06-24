export const PAGESPEED_TARGET_URL = "https://arywibowo.id";

export const PAGESPEED_API_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export const PAGESPEED_REPORT_URL = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(PAGESPEED_TARGET_URL)}`;

export type PageSpeedScores = {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  checkedAt: string;
  url: string;
};

export type PageSpeedApiResponse = PageSpeedScores & {
  cacheHit?: boolean;
  fallback?: boolean;
};

/** Last known desktop scores — used when the PageSpeed API is unavailable */
export const FALLBACK_PAGE_SPEED_SCORES: PageSpeedScores = {
  performance: 90,
  accessibility: 93,
  seo: 85,
  bestPractices: 100,
  checkedAt: "2026-06-24T00:00:00.000Z",
  url: PAGESPEED_TARGET_URL,
};

const SCORE_FIELDS = [
  "performance",
  "accessibility",
  "seo",
  "bestPractices",
] as const;

export function isPageSpeedScores(value: unknown): value is PageSpeedScores {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return SCORE_FIELDS.every(
    (field) =>
      typeof record[field] === "number" &&
      record[field] >= 0 &&
      record[field] <= 100
  );
}