import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { ServiceCard } from "@/components/service-card";
import { ServicesPositioning } from "@/components/services-positioning";
import { type Locale, routing } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/seo";
import { serviceIcons, serviceIds } from "@/lib/services";

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
    namespace: "metadata.services",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/services",
    locale: locale as Locale,
  });
}

export default async function ServicesPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("pageTitle")}
            description={t("pageDescription")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <ServicesPositioning
            title={t("positioningTitle")}
            description={t("positioningDescription")}
            className="mx-auto mt-12 max-w-4xl"
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {serviceIds.map((id, index) => {
            const Icon = serviceIcons[id];
            const features = t.raw(`items.${id}.features`) as string[];

            return (
              <FadeIn key={id} delay={0.15 + index * 0.08}>
                <ServiceCard
                  icon={Icon}
                  title={t(`items.${id}.title`)}
                  usp={t(`items.${id}.usp`)}
                  description={t(`items.${id}.description`)}
                  features={features}
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