import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2, Info, Monitor, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { catalogs, getProduct, images, productIds } from "@/lib/product-catalog";
import caseId from "@/content/case-studies-id.json";
import caseEn from "@/content/case-studies-en.json";
import caseZh from "@/content/case-studies-zh.json";
const cases = { id: caseId, en: caseEn, zh: caseZh };
import { createPageMetadata } from "@/lib/seo";

const text = {
 id: {back:"Kembali ke semua produk",summary:"Ringkasan produk",maturity:"Status produk",evidence:"Bukti implementasi",url:"Buka aplikasi atau website",repo:"Repository GitHub",noUrl:"Tidak tersedia demo publik untuk produk ini.",note:"Status didasarkan pada dokumentasi dan hasil pemeriksaan yang tersedia. Deployment bukan bukti bahwa setiap fitur siap secara operasional.",shot:"Screenshot halaman publik, bukan bukti fungsi setelah login.",noShot:"Visual produk belum disetujui untuk publikasi; ikon pengganti digunakan pada katalog.",pending:"Fitur yang masih dikembangkan atau divalidasi tidak dinyatakan telah siap production.",role:"Klasifikasi"},
 en: {back:"Back to all products",summary:"Product overview",maturity:"Product status",evidence:"Implementation evidence",url:"Open application or website",repo:"GitHub repository",noUrl:"No public demo is available for this product.",note:"Maturity is based on available documentation and verification. Deployment is not proof that every feature is operational.",shot:"Public-page screenshot, not evidence of authenticated features.",noShot:"No approved public image is available; the catalog uses an icon fallback.",pending:"Features still under development or validation are not represented as production-ready.",role:"Category"},
 zh: {back:"返回产品目录",summary:"产品概述",maturity:"产品状态",evidence:"实施证据",url:"打开应用或网站",repo:"GitHub 代码仓库",noUrl:"该产品没有可用的公开演示。",note:"成熟度以现有文档和验证结果为依据。部署不代表所有功能均可正常使用。",shot:"公开页面截图，不能证明登录后的功能。",noShot:"没有获批的公开图片；目录中使用图标代替。",pending:"开发或验证中的功能不会被描述为已准备好投入生产。",role:"类别"}
} as const;
type Props = { params: Promise<{locale:string;slug:string}> };
export function generateStaticParams() { return routing.locales.flatMap(locale=>productIds.map(slug=>({locale,slug}))); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
 const {locale,slug}=await params;
 if(!routing.locales.includes(locale as Locale)) return {};
 const product=getProduct(locale as Locale,slug);
 if(!product) return {};
 return createPageMetadata({title:`${product.name} — Portfolio`,description:product.description,path:`/projects/${slug}`,locale:locale as Locale});
}
export default async function ProductPage({params}:Props) {
 const {locale:language,slug}=await params;
 if(!routing.locales.includes(language as Locale)) notFound();
 const locale=language as Locale;
 const product=getProduct(locale,slug);
 if(!product) notFound();
 const t=text[locale]; const cat=catalogs[locale];
 const details = cases[locale].products[slug as keyof typeof cases["id"]["products"]];
 const labels = cases[locale].labels;
 const image=images[product.id];
 return <div className="min-h-[65vh] bg-gradient-to-b from-blue-50/70 to-background">
  <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
   <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft size={16}/>{t.back}</Link>
   <div className="mt-10 flex flex-wrap items-center gap-2 text-xs">
    <span className="rounded-full border border-border bg-background px-3 py-1.5">{cat.categories[product.category as keyof typeof cat.categories]}</span>
    <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">{cat.policy.statuses[product.status as keyof typeof cat.policy.statuses]}</span>
   </div>
   <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{product.name}</h1>
   <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{product.description}</p>
   <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {image?<><div className="relative aspect-video"><Image src={`/images/portfolio/${image}-public-1440x810.webp`} alt={`${product.name} public page`} fill sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" priority/></div><p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">{t.shot}</p></>:<div className="flex aspect-video flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center"><Monitor className="size-16 text-primary" strokeWidth={1.3}/><p className="max-w-md text-sm text-slate-600">{t.noShot}</p></div>}
   </div>
   {image && <section className="mt-8 rounded-2xl border border-border bg-white p-6">
    <h2 className="text-lg font-semibold">{labels.evidence} — {labels.screenshot}</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.shot}</p>
    <div className="mt-5 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-center sm:gap-8">
      <div className="w-full max-w-[240px]"><div className="relative aspect-[430/900] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><Image src={`/images/portfolio/${image}-mobile-public.webp`} alt={`${product.name} mobile public page`} fill sizes="240px" className="object-contain" /></div></div>
      <div className="max-w-xs text-sm leading-7 text-slate-600">{labels.method}<p className="mt-3 text-xs text-muted-foreground">{t.note}</p></div>
    </div>
   </section>}
   <div className="mt-9 grid gap-5 md:grid-cols-2">
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><Info size={20}/>{t.summary}</h2><p className="mt-4 leading-7 text-muted-foreground">{product.description}</p><p className="mt-4 text-sm font-medium">{t.role}: {cat.categories[product.category as keyof typeof cat.categories]}</p></section>
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck size={20}/>{t.maturity}</h2><p className="mt-4 font-semibold text-primary">{cat.policy.statuses[product.status as keyof typeof cat.policy.statuses]}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{t.note}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{t.pending}</p></section>
   </div>
   <div className="mt-6 grid gap-5 md:grid-cols-2">
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{labels.challenge}</h2><p className="mt-3 leading-7 text-muted-foreground">{details.challenge}</p></section>
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{labels.approach}</h2><p className="mt-3 leading-7 text-muted-foreground">{details.approach}</p></section>
   </div>
   <section className="mt-6 rounded-2xl border border-border bg-white p-6">
    <h2 className="text-lg font-semibold">{labels.features}</h2>
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">{details.features.map((item)=><li key={item} className="flex gap-3 rounded-xl bg-blue-50/50 p-3 text-sm leading-6"><ShieldCheck size={17} className="mt-1 shrink-0 text-primary"/><span>{item}</span></li>)}</ul>
   </section>
   <div className="mt-6 grid gap-5 md:grid-cols-2">
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{labels.stack}</h2>{details.stack.length?<div className="mt-4 flex flex-wrap gap-2">{details.stack.map(tech=><span key={tech} className="rounded-full border border-border bg-muted/30 px-3 py-2 text-sm">{tech}</span>)}</div>:<p className="mt-3 text-sm text-muted-foreground">{labels.unknown}</p>}</section>
    <section className="rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{labels.role}</h2><p className="mt-3 leading-7 text-muted-foreground">{details.role}</p></section>
   </div>
   <section className="mt-6 rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{labels.limits}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{details.verification}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{labels.method}</p></section>
   <section className="mt-6 rounded-2xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">{t.evidence}</h2><div className="mt-5 flex flex-wrap gap-3">
    {product.url?<a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{t.url}<ArrowUpRight size={16}/></a>:<p className="text-sm text-muted-foreground">{t.noUrl}</p>}
    {product.repository&&<a href={product.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-muted"><Code2 size={16}/>{t.repo}<ArrowUpRight size={15}/></a>}
   </div></section>
   <div className="mt-10"><Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft size={16}/>{t.back}</Link></div>
  </div>
 </div>;
}
