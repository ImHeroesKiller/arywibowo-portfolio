"use client";

import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Link } from "@/i18n/navigation";
import { sectionContentGap, sectionShell } from "@/lib/layout-classes";
import {
  projectIds,
  projectImageSources,
  projectLinks,
  projectImageFit,
  projectPreviewHosts,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectsProps {
  showAll?: boolean;
  className?: string;
}

export function Projects({ showAll = false, className }: ProjectsProps) {
  const t = useTranslations("projects");

  return (
    <section
      className={cn("border-t border-border/60 bg-card/20", className)}
    >
      <div className={sectionShell}>
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div
          className={cn(
            sectionContentGap,
            "grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6"
          )}
        >
          {projectIds.map((id, index) => {
            const highlights = t.raw(`items.${id}.highlights`) as string[];

            return (
              <FadeIn key={id} delay={index * 0.06}>
                <ProjectCard
                  title={t(`items.${id}.title`)}
                  category={t(`items.${id}.category`)}
                  description={t(`items.${id}.description`)}
                  highlights={highlights}
                  highlightsTitle={t("highlightsTitle")}
                  imageSources={projectImageSources[id]}
                  imageAlt={t(`items.${id}.imageAlt`)}
                  href={projectLinks[id]}
                  visitLabel={t(`items.${id}.visitLabel`)}
                  previewHost={projectPreviewHosts[id]}
                  imageFit={projectImageFit[id]}
                  variant={showAll ? "detailed" : "compact"}
                />
              </FadeIn>
            );
          })}
        </div>

        {!showAll && (
          <FadeIn delay={0.4}>
            <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground sm:mt-12 sm:text-base">
              {t.rich("seeMoreRich", {
                link: (chunks) => (
                  <Link
                    href="/projects"
                    className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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