import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { About } from "@/components/about";
import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";
import { PageTransition } from "@/components/page-transition";
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
    namespace: "metadata.about",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/about",
    locale: locale as Locale,
  });
}

export default function AboutPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  return (
    <PageTransition>
      <BreadcrumbStructuredData
        locale={locale as Locale}
        path="/about"
        titleNamespace="metadata.about"
      />
      <About showCta={false} className="border-t-0 bg-transparent" />
    </PageTransition>
  );
}