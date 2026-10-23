"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navPaths } from "@/lib/navigation";
import { siteConfig } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("nav");

  return (
    <footer className="border-t border-border/60 bg-background py-10 text-sm sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">Professional Consultant</p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</p>
          {navPaths.map(({ href, key }) => (
            <Link key={href} href={href} className="block w-fit rounded-sm py-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
          <Link href="/playground" className="block w-fit rounded-sm py-1 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">AI Playground</Link>
          <a href="/decision-ai-dashboard.html" className="block w-fit rounded-sm py-1 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Decision AI Dashboard</a>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connect</p>
          <a className="block w-fit break-all rounded-sm py-1 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a className="block w-fit py-1 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="https://github.com/ImHeroesKiller" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="block w-fit py-1 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="https://linkedin.com/in/boworesearch" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-border/60 px-4 pt-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">© {new Date().getFullYear()} Ary Wibowo. All rights reserved.</p>
    </footer>
  );
}
