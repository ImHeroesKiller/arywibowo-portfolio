import type { MetadataRoute } from "next";

import { navLinks, siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: `${siteConfig.url}${link.href === "/" ? "" : link.href}`,
    lastModified: new Date(),
    changeFrequency: link.href === "/" ? "weekly" : "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}