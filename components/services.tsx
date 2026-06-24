"use client";

import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8", className)}
    >
      <FadeIn>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={showAll ? t("descriptionFull") : t("description")}
          align="center"
          className="mx-auto mb-12"
        />
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceIds.map((id, index) => {
          const Icon = serviceIcons[id];

          return (
            <FadeIn key={id} delay={index * 0.08}>
              <Card className="group h-full border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">
                    {t(`items.${id}.title`)}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {t(`items.${id}.usp`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      {!showAll && (
        <FadeIn delay={0.5}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {t("seeMore")}{" "}
            <Link
              href="/services"
              className="font-medium text-primary hover:underline"
            >
              {t("seeMoreLink")}
            </Link>
            .
          </p>
        </FadeIn>
      )}
    </section>
  );
}