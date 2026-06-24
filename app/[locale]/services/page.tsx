import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("pageTitle")}
            description={t("pageDescription")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceIds.map((id, index) => {
            const Icon = serviceIcons[id];
            const features = t.raw(`items.${id}.features`) as string[];

            return (
              <FadeIn key={id} delay={index * 0.08}>
                <Card className="group flex h-full flex-col border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{t(`items.${id}.title`)}</CardTitle>
                    <CardDescription className="font-medium text-primary/90">
                      {t(`items.${id}.usp`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {t(`items.${id}.description`)}
                    </p>
                    <ul className="mt-auto space-y-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}