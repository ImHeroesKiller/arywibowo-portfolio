import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";

import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";
import { ContactForm } from "@/components/contact-form";
import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Link } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { sectionContentGap, sectionShell } from "@/lib/layout-classes";
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
  const tNav = await getTranslations("nav");

  return (
    <PageTransition>
      <BreadcrumbStructuredData
        locale={locale as Locale}
        path="/contact"
        titleNamespace="metadata.contact"
      />
      <div className={sectionShell}>
        <FadeIn>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.rich("internalLinksRich", {
              services: (chunks) => (
                <Link
                  href="/services"
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

        <div
          className={`${sectionContentGap} grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12`}
        >
          <FadeIn delay={0.12}>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30 hover:bg-card/60">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold leading-snug">{t("email")}</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1.5 inline-block text-sm leading-relaxed text-muted-foreground transition-colors hover:text-primary sm:text-base"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30 hover:bg-card/60">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold leading-snug">{t("location")}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {tCommon("location")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
                  {t("responseNote")}
                </p>
              </div>

              <nav
                aria-label={tNav("services")}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Link
                  href="/services"
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
                >
                  {tNav("services")}
                </Link>
                <Link
                  href="/projects"
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
                >
                  {tNav("projects")}
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
                >
                  {tNav("about")}
                </Link>
              </nav>
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