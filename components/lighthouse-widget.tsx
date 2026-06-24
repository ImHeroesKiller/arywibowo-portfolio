"use client";

import { ExternalLink, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { FadeIn } from "@/components/page-transition";
import {
  FALLBACK_PAGE_SPEED_SCORES,
  PAGESPEED_REPORT_URL,
  isPageSpeedScores,
  type PageSpeedApiResponse,
  type PageSpeedScores,
} from "@/lib/pagespeed";
import { cn } from "@/lib/utils";

type ScoreKey = "performance" | "accessibility" | "seo" | "bestPractices";

const SCORE_KEYS: ScoreKey[] = [
  "performance",
  "accessibility",
  "seo",
  "bestPractices",
];

const CATEGORY_LABEL_KEYS: Record<ScoreKey, string> = {
  performance: "performance",
  accessibility: "accessibility",
  seo: "seo",
  bestPractices: "bestPractices",
};

function scoreColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-12 sm:size-14">
        <svg
          className="size-12 -rotate-90 sm:size-14"
          viewBox="0 0 44 44"
          aria-hidden
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-muted-foreground/30"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums sm:text-sm"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <span className="max-w-[4.25rem] text-center text-[10px] font-medium leading-tight text-muted-foreground sm:max-w-[4.75rem] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function ScoreSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {SCORE_KEYS.map((key) => (
        <div key={key} className="flex flex-col items-center gap-1.5">
          <div className="size-12 animate-pulse rounded-full bg-muted/60 sm:size-14" />
          <div className="h-2.5 w-10 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}

export function LighthouseWidget({ className }: { className?: string }) {
  const t = useTranslations("lighthouse");
  const locale = useLocale();
  const [scores, setScores] = useState<PageSpeedScores | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadScores = useCallback(async () => {
    setStatus("loading");

    try {
      const response = await fetch("/api/pagespeed", { cache: "no-store" });
      const data = (await response.json()) as PageSpeedApiResponse;

      if (isPageSpeedScores(data)) {
        setScores(data);
        setIsFallback(Boolean(data.fallback));
        setStatus("ready");
        return;
      }

      throw new Error("Invalid PageSpeed response");
    } catch (error) {
      console.error("Lighthouse widget error:", error);
      setScores(FALLBACK_PAGE_SPEED_SCORES);
      setIsFallback(true);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadScores();
  }, [loadScores]);

  const lastChecked =
    scores &&
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(scores.checkedAt));

  return (
    <section
      className={cn("border-t border-border/60", className)}
      aria-label={t("title")}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
                  {t("eyebrow")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground sm:text-xl">
                  {t("title")}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t("description")}
                </p>
                {status === "error" && (
                  <p className="mt-2 text-xs text-amber-400">{t("unavailable")}</p>
                )}
                {isFallback && status === "ready" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t("fallbackNote")}
                  </p>
                )}
              </div>

              <div className="flex min-h-[5.5rem] items-center justify-center lg:justify-end">
                {status === "loading" && <ScoreSkeleton />}

                {scores && status !== "loading" && (
                  <div className="grid grid-cols-4 gap-3 sm:gap-5">
                    {SCORE_KEYS.map((key) => (
                      <ScoreCircle
                        key={key}
                        score={scores[key]}
                        label={t(`categories.${CATEGORY_LABEL_KEYS[key]}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {lastChecked && status !== "loading" ? (
                  <p>{t("lastChecked", { date: lastChecked })}</p>
                ) : (
                  <p>{t("loading")}</p>
                )}
                {status !== "loading" && (
                  <button
                    type="button"
                    onClick={() => void loadScores()}
                    className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                  >
                    <RefreshCw className="size-3" aria-hidden />
                    {t("refresh")}
                  </button>
                )}
              </div>
              <a
                href={PAGESPEED_REPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t("viewReport")}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}