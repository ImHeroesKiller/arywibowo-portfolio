import type { Metadata } from "next";
import { PortfolioShowcase } from "@/components/portfolio-showcase";
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
  projectImageSources,
  projectLinks,
  projectImageFit,
  projectPreviewHosts,
} from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
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

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageTransition><PortfolioShowcase locale={locale} /></PageTransition>;
}
