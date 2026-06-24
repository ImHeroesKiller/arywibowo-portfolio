"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { aboutContent } from "@/lib/constants";
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
  return (
    <section className={cn("border-t border-border/60 bg-card/20", className)}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="About"
            title="Profil profesional"
            description={aboutContent.summary}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
          <FadeIn delay={0.1}>
            <div className="space-y-4 text-muted-foreground">
              {aboutContent.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-foreground">
                Core Strengths
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enam area keahlian utama yang mendukung konsultasi terintegrasi.
              </p>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="mt-6 space-y-3"
              >
                {aboutContent.coreStrengths.map((strength, index) => (
                  <motion.li
                    key={strength}
                    custom={index}
                    variants={strengthVariants}
                    className="flex items-start gap-3 text-sm text-foreground"
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
            <div className="mt-12 text-center">
              <Button render={<Link href="/about" />} variant="outline">
                Selengkapnya
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}