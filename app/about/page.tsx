import type { Metadata } from "next";

import { About } from "@/components/about";
import { PageTransition } from "@/components/page-transition";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Tentang Saya",
  description:
    "Kenali Ary Wibowo — konsultan profesional 7+ tahun di business development, hubungan klien, energi terbarukan, dan transformasi digital. Berbasis di Jakarta, Indonesia.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageTransition>
      <About showCta={false} className="border-t-0 bg-transparent" />
    </PageTransition>
  );
}