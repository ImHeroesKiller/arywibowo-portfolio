import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FolderOpen } from "lucide-react";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { type Locale, routing } from "@/i18n/routing";
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
            description={tMeta("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-20 flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-8 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FolderOpen className="size-8" />
            </div>
            <h3 className="mt-6 text-xl font-semibold leading-snug">
              {t("comingSoonTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("comingSoonDescription")}
            </p>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}