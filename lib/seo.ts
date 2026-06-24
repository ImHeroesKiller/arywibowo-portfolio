import type { Metadata } from "next";

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
  alt: `${siteConfig.name} — ${siteConfig.title}`,
} as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${siteConfig.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    keywords: [...siteKeywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: path === "/" ? title : `${title} | ${siteConfig.name}`,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "id_ID",
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