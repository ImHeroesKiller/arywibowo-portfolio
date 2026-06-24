"use client";

import Link from "next/link";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aboutContent } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AboutProps {
  showExperience?: boolean;
  className?: string;
}

export function About({ showExperience = false, className }: AboutProps) {
  return (
    <section
      className={cn(
        "border-t border-border/60 bg-card/20",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="About"
            title="Profil profesional"
            description="Kombinasi pengalaman SDM, manajemen proyek, dan keahlian teknologi untuk solusi bisnis yang berdampak."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div className="space-y-4 text-muted-foreground">
              {aboutContent.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Core Strengths
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {aboutContent.coreStrengths.map((strength) => (
                  <Badge key={strength} variant="secondary">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {showExperience && (
          <div className="mt-16 space-y-6">
            <FadeIn>
              <SectionHeader eyebrow="Experience" title="Perjalanan profesional" />
            </FadeIn>
            {aboutContent.experience.map((item, index) => (
              <FadeIn key={item.role} delay={index * 0.1}>
                <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                  <p className="text-sm font-medium text-primary">{item.period}</p>
                  <h3 className="mt-1 text-lg font-semibold">{item.role}</h3>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  <p className="mt-3 text-muted-foreground">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {!showExperience && (
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