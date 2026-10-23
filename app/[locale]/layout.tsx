import "../globals.css";
import {notFound} from "next/navigation";
import Footer from "@/components/footer";
import {IdaChatbotDeferred} from "@/components/ida-chatbot-deferred";
import Navbar from "@/components/navbar";
import {PwaInstallPrompt} from "@/components/pwa-install-prompt";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {Analytics} from "@vercel/analytics/next";
import {routing, type Locale} from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <Footer />
          <IdaChatbotDeferred />
          <PwaInstallPrompt />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
