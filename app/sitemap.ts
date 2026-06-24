import type { MetadataRoute } from "next";

import { getLocalizedUrl } from "@/lib/i18n-paths";
import { routing } from "@/i18n/routing";
import { SITE_LAST_MODIFIED, siteConfig } from "@/lib/constants";
import { navPaths } from "@/lib/navigation";

const lastModified = new Date(SITE_LAST_MODIFIED);

export default function sitemap(): MetadataRoute.Sitemap {
  return navPaths.map((link) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        getLocalizedUrl(link.href, locale, siteConfig.url),
      ])
    );

    return {
      url: getLocalizedUrl(link.href, routing.defaultLocale, siteConfig.url),
      lastModified,
      changeFrequency: link.href === "/" ? "weekly" : "monthly",
      priority: link.href === "/" ? 1 : 0.8,
      alternates: {
        languages,
      },
    };
  });
}