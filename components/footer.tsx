import { Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/constants";
import { navPaths } from "@/lib/navigation";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tMeta = await getTranslations("metadata.site");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {tMeta("description")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">{t("navigation")}</p>
            <ul className="mt-3 space-y-2">
              {navPaths.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
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
                  {siteConfig.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {year} {siteConfig.name}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}