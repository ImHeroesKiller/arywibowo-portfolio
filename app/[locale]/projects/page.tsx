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
  const t = await getTranslations("metadata.projects");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Portfolio"
            title={t("title")}
            description={t("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-20 flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-8 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FolderOpen className="size-8" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Coming Soon</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Halaman ini sedang disiapkan. Proyek-proyek terpilih akan
              ditampilkan di sini.
            </p>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}