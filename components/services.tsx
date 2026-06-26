"use client";

import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { ServiceCard } from "@/components/service-card";
import { Link } from "@/i18n/navigation";
import { sectionContentGap, sectionShell } from "@/lib/layout-classes";
import { serviceIcons, serviceIds } from "@/lib/services";
import { cn } from "@/lib/utils";

interface ServicesProps {
  showAll?: boolean;
  className?: string;
}

export function Services({ showAll = false, className }: ServicesProps) {
  const t = useTranslations("services");

  return (
    <section className={cn(sectionShell, className)}>
      <FadeIn>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={showAll ? t("descriptionFull") : t("description")}
          align="center"
          className="mx-auto"
        />
      </FadeIn>

      <div
        className={cn(
          sectionContentGap,
          "grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        )}
      >
        {serviceIds.map((id, index) => {
          const Icon = serviceIcons[id];

          return (
            <FadeIn key={id} delay={index * 0.06}>
              <ServiceCard
                icon={Icon}
                title={t(`items.${id}.title`)}
                usp={t(`items.${id}.usp`)}
                variant="compact"
              />
            </FadeIn>
          );
        })}
      </div>

      {!showAll && (
        <FadeIn delay={0.4}>
          <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground sm:mt-12 sm:text-base">
            {t.rich("seeMoreRich", {
              link: (chunks) => (
                <Link
                  href="/services"
                  className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </FadeIn>
      )}
    </section>
  );
}