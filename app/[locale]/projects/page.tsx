import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";
import { FadeIn, PageTransition } from "@/components/page-transition";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Link } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { sectionContentGap, sectionShell } from "@/lib/layout-classes";
import {
  projectIds,
  projectImages,
  projectLinks,
  projectImageFit,
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
      <BreadcrumbStructuredData
        locale={locale as Locale}
        path="/projects"
        titleNamespace="metadata.projects"
      />
      <div className={sectionShell}>
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={tMeta("title")}
            description={t("pageDescription")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div
          className={`${sectionContentGap} grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6`}
        >
          {projectIds.map((id, index) => {
            const highlights = t.raw(`items.${id}.highlights`) as string[];

            return (
              <FadeIn key={id} delay={index * 0.05}>
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
                  imageFit={projectImageFit[id]}
                  variant="detailed"
                />
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.35}>
          <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground sm:mt-12 sm:text-base">
            {t.rich("contactCtaRich", {
              contact: (chunks) => (
                <Link
                  href="/contact"
                  className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  {chunks}
                </Link>
              ),
              services: (chunks) => (
                <Link
                  href="/services"
                  className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </FadeIn>
      </div>
    </PageTransition>
  );
}