export const PAGESPEED_TARGET_URL = "https://arywibowo.id";

export const PAGESPEED_REPORT_URL = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(PAGESPEED_TARGET_URL)}`;

export type PageSpeedScores = {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  checkedAt: string;
  url: string;
};