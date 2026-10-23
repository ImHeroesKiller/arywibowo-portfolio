import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { About } from "@/components/about";
import Hero from "@/components/Hero";
import { LighthouseWidget } from "@/components/lighthouse-widget";
import { PageTransition } from "@/components/page-transition";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { type Locale, routing } from "@/i18n/routing";
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
    namespace: "metadata.home",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale: locale as Locale,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageTransition>
      <Hero />
      <Services />
      <Projects />
      <About />
      <LighthouseWidget />
    </PageTransition>
  );
}