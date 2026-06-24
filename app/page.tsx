import type { Metadata } from "next";

import { About } from "@/components/about";
import Hero from "@/components/Hero";
import { PageTransition } from "@/components/page-transition";
import { Services } from "@/components/services";
import { siteConfig } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.tagline,
  path: "/",
});

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <Services />
      <About />
    </PageTransition>
  );
}
