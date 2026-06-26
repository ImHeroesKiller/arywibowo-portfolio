import { getLocalizedUrl } from "@/lib/i18n-paths";
import { navPaths } from "@/lib/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";

const SERVICE_TYPES = [
  "Renewable Energy Consulting",
  "Business Development",
  "IT & Digital Transformation",
  "HR Consulting",
  "Sales & Project Management",
  "Financial Solutions",
] as const;

const KNOWS_ABOUT = [
  "Business Development",
  "Renewable Energy",
  "Digital Transformation",
  "Human Resources",
  "Project Management",
  "Financial Solutions",
  "Strategic Consulting",
] as const;

type StructuredDataInput = {
  locale: Locale;
  description: string;
  jobTitle: string;
};

export function getStructuredData({
  locale,
  description,
  jobTitle,
}: StructuredDataInput) {
  const pageUrl = getLocalizedUrl("/", locale, siteConfig.url);
  const personId = `${pageUrl}#person`;
  const serviceId = `${pageUrl}#professional-service`;
  const websiteId = `${pageUrl}#website`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: pageUrl,
    email: siteConfig.email,
    jobTitle,
    image: `${siteConfig.url}/images/profile.png`,
    knowsAbout: [...KNOWS_ABOUT],
    worksFor: {
      "@id": serviceId,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressRegion: "DKI Jakarta",
      addressCountry: "ID",
    },
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": serviceId,
    name: `${siteConfig.name} | ${jobTitle}`,
    url: pageUrl,
    image: `${siteConfig.url}/images/profile.png`,
    description,
    email: siteConfig.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressRegion: "DKI Jakarta",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    founder: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
    },
    employee: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
    },
    serviceType: [...SERVICE_TYPES],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Consulting Services",
      itemListElement: SERVICE_TYPES.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service,
          provider: { "@id": serviceId },
        },
      })),
    },
    inLanguage: routing.locales.map((loc) =>
      loc === "zh" ? "zh-CN" : loc === "en" ? "en-US" : "id-ID"
    ),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: pageUrl,
    description,
    inLanguage: locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "id-ID",
    publisher: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
    },
    about: {
      "@id": serviceId,
    },
  };

  return [person, professionalService, website];
}

type BreadcrumbInput = {
  locale: Locale;
  path: `/${string}` | "/";
  title: string;
};

export function getBreadcrumbStructuredData({
  locale,
  path,
  title,
}: BreadcrumbInput) {
  const homeUrl = getLocalizedUrl("/", locale, siteConfig.url);
  const pageUrl = getLocalizedUrl(path, locale, siteConfig.url);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: homeUrl,
    },
  ];

  if (path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: pageUrl,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function getSiteNavigationUrls(locale: Locale) {
  return navPaths.map((link) => ({
    href: link.href,
    url: getLocalizedUrl(link.href, locale, siteConfig.url),
  }));
}