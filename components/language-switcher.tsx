"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/50 p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition-colors",
            locale === loc
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          aria-current={locale === loc ? "true" : undefined}
        >
          {t(`locales.${loc}`)}
        </button>
      ))}
    </div>
  );
}