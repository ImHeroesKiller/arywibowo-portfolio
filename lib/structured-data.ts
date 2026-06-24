import { getLocalizedUrl } from "@/lib/i18n-paths";
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

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${pageUrl}#person`,
    name: siteConfig.name,
    url: pageUrl,
    email: siteConfig.email,
    jobTitle,
    image: `${siteConfig.url}/images/profile.png`,
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
    "@id": `${pageUrl}#professional-service`,
    name: `${siteConfig.name} | ${jobTitle}`,
    url: pageUrl,
    image: `${siteConfig.url}/images/profile.png`,
    description,
    email: siteConfig.email,
    telephone: siteConfig.email,
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
      "@id": `${pageUrl}#person`,
      name: siteConfig.name,
    },
    serviceType: [...SERVICE_TYPES],
    inLanguage: routing.locales.map((loc) =>
      loc === "zh" ? "zh-CN" : loc === "en" ? "en-US" : "id-ID"
    ),
  };

  return [person, professionalService];
}