"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AboutProps {
  className?: string;
  showCta?: boolean;
}

const strengthVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      delay: index * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function About({ className, showCta = true }: AboutProps) {
  const t = useTranslations("about");
  const bio = t.raw("bio") as string[];
  const coreStrengths = t.raw("coreStrengths") as string[];

  return (
    <section className={cn("border-t border-border/60 bg-card/20", className)}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("summary")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <FadeIn delay={0.1}>
            <div className="space-y-5">
              {bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-base leading-7 text-muted-foreground sm:text-[1.0625rem] sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {t("coreStrengthsTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t("coreStrengthsDescription")}
                </p>
              </div>

              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="mt-7 space-y-2"
              >
                {coreStrengths.map((strength, index) => (
                  <motion.li
                    key={strength}
                    custom={index}
                    variants={strengthVariants}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm leading-relaxed text-foreground transition-colors hover:bg-muted/40 sm:text-[0.9375rem]"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </FadeIn>
        </div>

        {showCta && (
          <FadeIn delay={0.3}>
            <div className="mt-14 text-center">
              <Button render={<Link href="/about" />} variant="outline" size="lg">
                {t("readMore")}
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}