import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hubungi Saya",
  description:
    "Hubungi Ary Wibowo untuk konsultasi bisnis, kolaborasi proyek, atau diskusi strategi. Kirim pesan melalui form atau email aku@arywibowo.co.id — Jakarta, Indonesia.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Contact"
            title="Mari berkolaborasi"
            description="Punya proyek atau ingin diskusi peluang bisnis? Kirim pesan dan saya akan merespons secepatnya."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="mt-1 text-muted-foreground">
                    {siteConfig.location}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                <p className="text-sm text-muted-foreground">
                  Saya biasanya merespons dalam 24–48 jam. Untuk pertanyaan
                  mendesak, sebutkan di subject pesan Anda.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}