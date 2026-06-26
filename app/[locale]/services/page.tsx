import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";
import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { ServiceCard } from "@/components/service-card";
import { ServicesPositioning } from "@/components/services-positioning";
import { Link } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { sectionContentGap, sectionShell } from "@/lib/layout-classes";
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
      <BreadcrumbStructuredData
        locale={locale as Locale}
        path="/services"
        titleNamespace="metadata.services"
      />
      <div className={sectionShell}>
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("pageTitle")}
            description={t("pageDescription")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <ServicesPositioning
            eyebrow={t("positioningEyebrow")}
            title={t("positioningTitle")}
            description={t("positioningDescription")}
            className="mx-auto mt-10 max-w-4xl sm:mt-12"
          />
        </FadeIn>

        <div
          className={`${sectionContentGap} grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6`}
        >
          {serviceIds.map((id, index) => {
            const Icon = serviceIcons[id];
            const features = t.raw(`items.${id}.features`) as string[];

            return (
              <FadeIn key={id} delay={0.12 + index * 0.05}>
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

        <FadeIn delay={0.4}>
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
              projects: (chunks) => (
                <Link
                  href="/projects"
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