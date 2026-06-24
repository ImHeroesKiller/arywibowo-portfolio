import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { About } from "@/components/about";
import Hero from "@/components/Hero";
import { PageTransition } from "@/components/page-transition";
import { Services } from "@/components/services";
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
    namespace: "metadata.home",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale: locale as Locale,
  });
}

export default function HomePage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  return (
    <PageTransition>
      <Hero />
      <Services />
      <About />
    </PageTransition>
  );
}