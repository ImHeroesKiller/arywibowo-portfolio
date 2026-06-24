import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { navPaths } from "@/lib/navigation";
import { siteConfig } from "@/lib/constants";

function getLocalizedPath(href: string, locale: string) {
  if (locale === routing.defaultLocale) {
    return href === "/" ? "" : href;
  }

  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    navPaths.map((link) => ({
      url: `${siteConfig.url}${getLocalizedPath(link.href, locale)}`,
      lastModified: new Date(),
      changeFrequency: link.href === "/" ? "weekly" : "monthly",
      priority: link.href === "/" ? 1 : 0.8,
    }))
  );
}