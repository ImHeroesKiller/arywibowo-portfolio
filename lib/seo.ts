import type { Metadata } from "next";

import { getLocalizedUrl } from "@/lib/i18n-paths";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";

export const siteKeywords = [
  "Ary Wibowo",
  "konsultan bisnis",
  "konsultan profesional",
  "business development",
  "renewable energy",
  "energi terbarukan",
  "transformasi digital",
  "konsultan IT",
  "HR consulting",
  "manajemen proyek",
  "financial solutions",
  "konsultan Jakarta",
  "konsultan Indonesia",
] as const;

export const defaultOgImage = {
  url: "/images/profile.webp",
  width: 586,
  height: 880,
  alt: `${siteConfig.name} — Professional Consultant based in Jakarta, Indonesia`,
} as const;

const ogLocaleMap: Record<Locale, string> = {
  id: "id_ID",
  en: "en_US",
  zh: "zh_CN",
};

export const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  locale: Locale;
};

export function createPageMetadata({
  title,
  description,
  path,
  locale,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = getLocalizedUrl(path, locale, siteConfig.url);

  return {
    title,
    description,
    keywords: [...siteKeywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          getLocalizedUrl(path, loc, siteConfig.url),
        ])
      ),
    },
    openGraph: {
      title: path === "/" ? title : `${title} | ${siteConfig.name}`,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: ogLocaleMap[locale],
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: path === "/" ? title : `${title} | ${siteConfig.name}`,
      description,
      images: [defaultOgImage.url],
    },
    robots: defaultRobots,
  };
}