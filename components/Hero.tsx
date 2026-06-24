"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

const photoGradient =
  "linear-gradient(to top, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.38) 20%, rgba(59,130,246,0.22) 45%, rgba(59,130,246,0.08) 70%, transparent 90%)";

const PHOTO_WIDTH = 320;
const PHOTO_HEIGHT = 440;

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background px-3 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 size-72 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        {...fade(0)}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(26,26,26,0.75) 45%, rgba(17,17,17,0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow:
            "0 0 60px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[440px]">
          <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end lg:pr-6">
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT }}
            >
              <img
                src="/images/profile.png"
                alt={t("name")}
                width={PHOTO_WIDTH}
                height={PHOTO_HEIGHT}
                decoding="async"
                className="block object-cover object-top"
                style={{
                  width: PHOTO_WIDTH,
                  height: PHOTO_HEIGHT,
                  minWidth: PHOTO_WIDTH,
                  minHeight: PHOTO_HEIGHT,
                  maxWidth: PHOTO_WIDTH,
                  maxHeight: PHOTO_HEIGHT,
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: photoGradient }}
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

          <div className="order-2 flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-12 lg:order-1 lg:px-10 lg:py-14 xl:px-12">
            <motion.h1
              {...fade(0.1)}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl xl:text-6xl"
            >
              {t("name")}
            </motion.h1>

            <motion.p
              {...fade(0.2)}
              className="mt-2 text-lg font-semibold text-primary sm:mt-3 sm:text-xl md:text-2xl"
            >
              {t("title")}
            </motion.p>

            <motion.div
              {...fade(0.28)}
              className="my-5 h-px w-full max-w-xs sm:my-6"
              style={{
                background:
                  "linear-gradient(to right, rgba(59,130,246,0.6), transparent)",
              }}
            />

            <motion.p
              {...fade(0.35)}
              className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg"
            >
              {t("tagline")}
            </motion.p>

            <motion.div
              {...fade(0.45)}
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
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
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}