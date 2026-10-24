"use client";

import { ArrowRight, BriefcaseBusiness, Mail, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { navPaths } from "@/lib/navigation";
import { siteConfig } from "@/lib/constants";

const footerText = {
  id: {intro:"Merancang solusi AI, fintech, dan sistem enterprise yang memberikan dampak nyata.",headline:"Punya ide untuk dikembangkan?",sub:"Mari diskusikan kolaborasi atau transformasi digital berikutnya.",cta:"Mari Terhubung",nav:"Navigasi",products:"Eksplorasi",connect:"Terhubung",rights:"Hak cipta dilindungi."},
  en: {intro:"Building AI, fintech, and enterprise solutions that create real-world impact.",headline:"Have an idea worth building?",sub:"Let's discuss your next collaboration or digital transformation.",cta:"Let's Connect",nav:"Navigation",products:"Explore",connect:"Connect",rights:"All rights reserved."},
  zh: {intro:"打造具有实际影响力的 AI、金融科技和企业解决方案。",headline:"有值得实现的想法吗？",sub:"欢迎探讨合作与数字化转型。",cta:"联系我们",nav:"导航",products:"探索",connect:"联系方式",rights:"版权所有。"},
};

export default function Footer() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const copy = footerText[locale === "zh" ? "zh" : locale === "en" ? "en" : "id"];
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/70 bg-[#f1f6ff] text-slate-900">
      <div className="pointer-events-none absolute -right-32 -top-40 size-[450px] rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
        <div className="mb-14 flex flex-col gap-6 rounded-3xl border border-blue-100 bg-white/85 p-7 shadow-[0_12px_45px_rgba(35,80,160,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-2xl"><span className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.13em] text-primary"><Sparkles className="size-4"/> Let&apos;s build together</span><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.headline}</h2><p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">{copy.sub}</p></div>
          <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#172d75] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{copy.cta}<ArrowRight className="size-4"/></Link>
        </div>
        <div className="grid gap-10 border-b border-slate-200 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm"><Logo/><p className="mt-4 text-base leading-8 text-slate-600">{copy.intro}</p><div className="mt-6 flex gap-2"><a aria-label="LinkedIn" href="https://linkedin.com/in/boworesearch" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-300 hover:text-primary"><BriefcaseBusiness className="size-4"/></a><a aria-label="Email" href={`mailto:${siteConfig.email}`} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-300 hover:text-primary"><Mail className="size-4"/></a></div></div>
          <nav aria-label="Footer" className="space-y-3"><p className="mb-4 text-sm font-bold uppercase tracking-[.15em] text-slate-900">{copy.nav}</p>{navPaths.map(({href,key})=><Link key={href} href={href} className="block w-fit py-1 text-base text-slate-600 transition hover:text-primary">{t(key)}</Link>)}</nav>
          <div className="space-y-3"><p className="mb-4 text-sm font-bold uppercase tracking-[.15em] text-slate-900">{copy.products}</p><Link href="/projects" className="block w-fit py-1 text-base text-slate-600 hover:text-primary">Portfolio & Products</Link></div>
          <div className="space-y-3"><p className="mb-4 text-sm font-bold uppercase tracking-[.15em] text-slate-900">{copy.connect}</p><a href={`mailto:${siteConfig.email}`} className="block w-fit break-all py-1 text-base text-slate-600 hover:text-primary">{siteConfig.email}</a></div>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {siteConfig.name}. {copy.rights}</p><p>AI · Fintech · Enterprise Systems</p></div>
      </div>
    </footer>
  );
}
