"use client";

import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Link } from "@/i18n/navigation";
import {
  projectIds,
  projectImages,
  projectLinks,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectsProps {
  showAll?: boolean;
  className?: string;
}

export function Projects({ showAll = false, className }: ProjectsProps) {
  const t = useTranslations("projects");
  const displayIds = showAll ? projectIds : projectIds;

  return (
    <section
      className={cn(
        "border-t border-border/60 bg-card/20",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {displayIds.map((id, index) => {
            const highlights = t.raw(`items.${id}.highlights`) as string[];

            return (
              <FadeIn key={id} delay={index * 0.08}>
                <ProjectCard
                  title={t(`items.${id}.title`)}
                  category={t(`items.${id}.category`)}
                  description={t(`items.${id}.description`)}
                  highlights={highlights}
                  highlightsTitle={t("highlightsTitle")}
                  imageSrc={projectImages[id]}
                  imageAlt={t(`items.${id}.imageAlt`)}
                  href={projectLinks[id]}
                  visitLabel={t("visitWebsite")}
                  variant={showAll ? "detailed" : "compact"}
                />
              </FadeIn>
            );
          })}
        </div>

        {!showAll && (
          <FadeIn delay={0.5}>
            <p className="mt-12 text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.rich("seeMoreRich", {
                link: (chunks) => (
                  <Link
                    href="/projects"
                    className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}