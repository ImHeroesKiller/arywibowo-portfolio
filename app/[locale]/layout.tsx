import { notFound } from "next/navigation";
import Footer from "@/components/footer";
import { IdaChatbotDeferred } from "@/components/ida-chatbot-deferred";
import { Navbar } from "@/components/navbar";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Analytics } from '@vercel/analytics/next';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!['id', 'en', 'zh'].includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <IdaChatbotDeferred />
        <PwaInstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
