import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { defaultOgImage, siteKeywords } from "@/lib/seo";
import { cn } from "@/lib/utils";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "metadata.site",
  });

  const defaultTitle = `${siteConfig.name} | ${t("title")}`;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    keywords: [...siteKeywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    manifest: "/manifest.webmanifest",
    applicationName: siteConfig.name,
    category: "business",
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    },
    openGraph: {
      title: defaultTitle,
      description: t("description"),
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: locale === "zh" ? "zh_CN" : locale === "en" ? "en_US" : "id_ID",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: t("description"),
      images: [defaultOgImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION && {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }),
      ...(process.env.BING_SITE_VERIFICATION && {
        other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION },
      }),
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": siteConfig.name,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}