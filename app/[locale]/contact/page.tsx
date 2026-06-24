import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { type Locale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
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
    namespace: "metadata.contact",
  });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("email")}</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("location")}</h3>
                  <p className="mt-1 text-muted-foreground">
                    {tCommon("location")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                <p className="text-sm text-muted-foreground">
                  {t("responseNote")}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}