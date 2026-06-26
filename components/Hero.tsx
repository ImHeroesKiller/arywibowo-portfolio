"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { HighlightedText } from "@/components/HighlightedText";
import { OptimizedPicture } from "@/components/optimized-picture";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { profileImage } from "@/lib/images";
import { cn } from "@/lib/utils";

const heroStagger = [
  "hero-animate",
  "hero-animate hero-animate-delay-1",
  "hero-animate hero-animate-delay-2",
  "hero-animate hero-animate-delay-3",
  "hero-animate hero-animate-delay-4",
] as const;

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(26,26,26,0.75) 45%, rgba(17,17,17,0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow:
            "0 0 60px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[420px]">
          <div className="relative order-1 flex justify-center px-4 pt-8 lg:order-2 lg:justify-end lg:px-0 lg:pt-0 lg:pr-8">
            <div className="relative aspect-[32/44] w-full max-w-[240px] overflow-hidden sm:max-w-[280px] lg:max-w-[320px]">
              <OptimizedPicture
                sources={profileImage}
                alt={t("imageAlt")}
                priority
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                fit="cover"
                className="size-full"
                imgClassName="size-full object-top"
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.38) 20%, rgba(59,130,246,0.22) 45%, rgba(59,130,246,0.08) 70%, transparent 90%)",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(17,17,17,0.7) 0%, transparent 35%)",
                }}
              />
            </div>
          </div>

          <div className="order-2 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:order-1 lg:px-12 lg:py-14 xl:px-14">
            <h1
              className={cn(
                heroStagger[0],
                "text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl xl:text-6xl"
              )}
            >
              {t("name")}
            </h1>

            <p
              className={cn(
                heroStagger[1],
                "mt-3 text-lg font-semibold leading-snug text-primary sm:mt-4 sm:text-xl md:text-2xl"
              )}
            >
              {t("title")}
            </p>

            <div
              className={cn(heroStagger[2], "my-6 h-px w-full max-w-xs sm:my-7")}
              style={{
                background:
                  "linear-gradient(to right, rgba(59,130,246,0.6), transparent)",
              }}
            />

            <div className={heroStagger[3]}>
              <HighlightedText
                as="p"
                text={t("tagline")}
                className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
              />
            </div>

            <div
              className={cn(
                heroStagger[4],
                "mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
              )}
            >
              <Button
                render={<Link href="/contact" />}
                size="lg"
                className="w-full sm:w-auto"
              >
                {t("contact")}
                <ArrowRight />
              </Button>
              <Button
                render={<Link href="/services" />}
                variant="outline"
                size="lg"
                className="w-full border-primary/30 bg-primary/5 hover:bg-primary/10 sm:w-auto"
              >
                {t("services")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}