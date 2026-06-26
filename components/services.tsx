"use client";

import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { ServiceCard } from "@/components/service-card";
import { Link } from "@/i18n/navigation";
import { serviceIcons, serviceIds } from "@/lib/services";
import { cn } from "@/lib/utils";

interface ServicesProps {
  showAll?: boolean;
  className?: string;
}

export function Services({ showAll = false, className }: ServicesProps) {
  const t = useTranslations("services");

  return (
    <section
      className={cn(
        "mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8",
        className
      )}
    >
      <FadeIn>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={showAll ? t("descriptionFull") : t("description")}
          align="center"
          className="mx-auto"
        />
      </FadeIn>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
        {serviceIds.map((id, index) => {
          const Icon = serviceIcons[id];

          return (
            <FadeIn key={id} delay={index * 0.08}>
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
        <FadeIn delay={0.5}>
          <p className="mt-12 text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.rich("seeMoreRich", {
              link: (chunks) => (
                <Link
                  href="/services"
                  className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
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