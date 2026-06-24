import type { Metadata } from "next";

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
  url: "/images/profile.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}`,
} as const;

const ogLocaleMap: Record<Locale, string> = {
  id: "id_ID",
  en: "en_US",
  zh: "zh_CN",
};

function getLocalizedPath(path: `/${string}` | "/", locale: Locale) {
  if (locale === routing.defaultLocale) {
    return path === "/" ? "" : path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

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
  const localizedPath = getLocalizedPath(path, locale);
  const canonicalUrl = `${siteConfig.url}${localizedPath}`;

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
          `${siteConfig.url}${getLocalizedPath(path, loc)}`,
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
  };
}