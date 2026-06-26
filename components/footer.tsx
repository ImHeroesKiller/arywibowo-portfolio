"use client";

import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/constants";
import { navPaths } from "@/lib/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tMeta = useTranslations("metadata.site");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/50 pb-20 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {tMeta("description")}
            </p>
            <p className="mt-5">
              <a
                href="https://arywibowo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
              >
                {t("creatorCredit")}
              </a>
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">{t("navigation")}</p>
            <ul className="mt-3 space-y-2">
              {navPaths.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
              <Link
                href="/services"
                className="transition-colors hover:text-primary"
              >
                {tNav("services")}
              </Link>
              {" · "}
              <Link
                href="/projects"
                className="transition-colors hover:text-primary"
              >
                {tNav("projects")}
              </Link>
              {" · "}
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                {tNav("contact")}
              </Link>
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">{t("contact")}</p>
            <ul className="mt-3 space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {tCommon("location")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {year} {tHero("name")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}