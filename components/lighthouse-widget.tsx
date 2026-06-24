"use client";

import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { FadeIn } from "@/components/page-transition";
import { PAGESPEED_REPORT_URL, type PageSpeedScores } from "@/lib/pagespeed";
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

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-12 sm:size-14">
        <svg
          className="size-12 -rotate-90 text-muted sm:size-14"
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
            className="opacity-30"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={scoreColor(score)}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground sm:text-sm">
          {score}
        </span>
      </div>
      <span className="max-w-[4.25rem] text-center text-[10px] leading-tight text-muted-foreground sm:max-w-[4.75rem] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export function LighthouseWidget({ className }: { className?: string }) {
  const t = useTranslations("lighthouse");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scores, setScores] = useState<PageSpeedScores | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const fetchedRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    async function loadScores() {
      setStatus("loading");
      try {
        const response = await fetch("/api/pagespeed", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = (await response.json()) as PageSpeedScores;
        setScores(data);
        setStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Lighthouse widget error:", error);
        setStatus("error");
      }
    }

    void loadScores();
    return () => controller.abort();
  }, [visible]);

  const lastChecked =
    scores &&
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(scores.checkedAt));

  return (
    <section
      ref={containerRef}
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
              </div>

              <div className="flex justify-center lg:justify-end">
                {status === "loading" && (
                  <p className="text-sm text-muted-foreground">{t("loading")}</p>
                )}

                {status === "error" && (
                  <p className="text-sm text-muted-foreground">
                    {t("unavailable")}
                  </p>
                )}

                {scores && (
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
              {lastChecked ? (
                <p>{t("lastChecked", { date: lastChecked })}</p>
              ) : (
                <span aria-hidden />
              )}
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