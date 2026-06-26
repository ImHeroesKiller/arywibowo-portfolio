import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { type Locale, routing } from "@/i18n/routing";
import {
  projectIds,
  projectImages,
  projectLinks,
  projectPreviewHosts,
} from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "metadata.projects",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/projects",
    locale: locale as Locale,
  });
}

export default async function ProjectsPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const tMeta = await getTranslations("metadata.projects");
  const t = await getTranslations("projects");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={tMeta("title")}
            description={t("pageDescription")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-7">
          {projectIds.map((id, index) => {
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
                  visitLabel={t(`items.${id}.visitLabel`)}
                  previewHost={projectPreviewHosts[id]}
                  variant="detailed"
                />
              </FadeIn>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}