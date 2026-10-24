"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, BrainCircuit, ShieldCheck, UsersRound, Truck, Wallet, LineChart, LayoutDashboard, Building2, FileText, Smartphone, BriefcaseBusiness, Boxes } from "lucide-react";
import { Link } from "@/i18n/navigation";

import catalogId from "@/content/portfolio-id.json";
import catalogEn from "@/content/portfolio-en.json";
import catalogZh from "@/content/portfolio-zh.json";

type Lang = "id" | "en" | "zh";
type Status = "production" | "uat" | "development" | "prototype" | "concept";
type Item = {
  id: string;
  name: string;
  category: string;
  status: Status;
  deployment: string;
  summary: Record<Lang, string>;
  url?: string;
  image?: string;
  note?: string;
};
const imageKeys: Record<string, string> = {
  "ida-gen3": "ida", "ida-labs": "labs", "proqpay-lite": "proqpay",
  "proqtrack": "proqtrack", "arah-fleet": "arah", "notagen": "notagen",
  "msg": "msg", "perada-group": "perada", "danawangsa": "danawangsa",
};
const catalogs = { id: catalogId, en: catalogEn, zh: catalogZh };
const items: Item[] = catalogId.products.map((product, index) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  status: product.status as Status,
  deployment: product.url ? "Public endpoint verified" : "Repository / concept",
  summary: {
    id: product.description,
    en: catalogEn.products[index].description,
    zh: catalogZh.products[index].description,
  },
  ...(product.url ? { url: product.url } : {}),
  ...(imageKeys[product.id] ? { image: imageKeys[product.id] } : {}),
  ...(product.id === "proqpay-lite" ? { note: "Payment provider validation pending" } : {}),
}));
const productIcons: Record<string, typeof BrainCircuit> = {
  "ida-gen3":BrainCircuit,"ida-labs":BrainCircuit,"ida-call-shield":ShieldCheck,
  "proqpay-lite":Wallet,"proqpay-enterprise":Wallet,"proqpay-ess":UsersRound,
  "proqtrade":LineChart,"proqacc":Wallet,"kawankas":Wallet,"proqtrack":UsersRound,
  "pay-hr":UsersRound,"perada-recruitment":UsersRound,"freejobid":UsersRound,
  "arah-fleet":Truck,"oms-perada":Boxes,"notagen":FileText,"saleguard":LineChart,
  "onework":LayoutDashboard,"msg":Building2,"perada-group":Building2,
  "danawangsa":BriefcaseBusiness,"mkb":Building2,"qjob-concept":BriefcaseBusiness,
  "bespoke-solar":Boxes,
};
const copy={id:{eyebrow:"PORTFOLIO PRODUK",title:"Produk digital & implementasi nyata",desc:"Produk yang telah diluncurkan, diuji, maupun sedang dikembangkan. Status fitur ditampilkan secara transparan.",all:"Semua",search:"Cari produk...",view:"Buka produk",more:"Lihat semua proyek",preview:"Tangkapan layar halaman publik · bukan bukti fitur setelah login",no:"Tidak ada produk yang cocok."},en:{eyebrow:"PRODUCT PORTFOLIO",title:"Digital products & real implementations",desc:"Launched, tested, and in-progress products. Feature maturity is stated transparently.",all:"All",search:"Search products...",view:"Visit product",more:"Explore all projects",preview:"Public-page screenshot · not evidence of authenticated features",no:"No matching products."},zh:{eyebrow:"产品作品集",title:"数字产品与实际实施",desc:"展示已上线、测试中和开发中的产品，并透明标注成熟度。",all:"全部",search:"搜索产品...",view:"访问产品",more:"查看所有项目",preview:"公开页面截图 · 不代表已验证登录后功能",no:"没有匹配的产品。"}};
export function PortfolioShowcase({locale,featured=false}:{locale:string;featured?:boolean}){
 const lang:Lang=locale==="zh"?"zh":locale==="en"?"en":"id";const t=copy[lang];const [filter,setFilter]=useState("All");const [statusFilter,setStatusFilter]=useState("all");const [query,setQuery]=useState("");
 const categories=["All",...Array.from(new Set(items.map(x=>x.category)))];
 const maturity=["all","production","uat","development","prototype","concept"] as const;
 const statusLabel=(status:string)=>status==="all"?t.all:catalogs[lang].policy.statuses[status as Status];
 const shown=useMemo(()=>items.filter(x=>(!featured||["ida-gen3","ida-labs","proqpay-lite","proqtrack","pay-hr","ida-call-shield","arah-fleet","msg"].includes(x.id))&&(filter==="All"||x.category===filter)&&(statusFilter==="all"||x.status===statusFilter)&&(`${x.name} ${x.summary[lang]}`.toLowerCase().includes(query.toLowerCase()))),[featured,filter,statusFilter,query,lang]);
 return <section id="portfolio" className="border-t border-border/60 bg-white/55 py-16 sm:py-24"><div className="mx-auto w-full max-w-7xl px-5 sm:px-8"><div className="mb-9 max-w-3xl"><p className="mb-3 text-xs font-bold tracking-[.2em] text-primary">{t.eyebrow}</p><h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{t.title}</h2><p className="mt-4 text-muted-foreground leading-7">{t.desc}</p></div>{!featured&&<div className="mb-7 flex flex-wrap items-center gap-3"><div className="relative min-w-52 flex-1"><Search aria-hidden className="absolute left-3 top-3 size-4 text-muted-foreground"/><input aria-label={t.search} className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm" placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="flex flex-wrap gap-2">{categories.map(c=><button type="button" key={c} onClick={()=>setFilter(c)} aria-pressed={filter===c} className={`rounded-full border px-3 py-2 text-xs transition ${filter===c?"border-primary bg-primary text-primary-foreground":"border-border hover:border-primary/50"}`}>{c==="All"?t.all:catalogs[lang].categories[c as keyof typeof catalogs["id"]["categories"]]}</button>)}</div><div role="group" aria-label={lang==="id"?"Filter status produk":lang==="zh"?"产品状态筛选":"Product maturity filter"} className="flex flex-wrap gap-2">{maturity.map(st=><button type="button" key={st} onClick={()=>setStatusFilter(st)} aria-pressed={statusFilter===st} className={`rounded-full border px-3 py-2 text-xs transition ${statusFilter===st?"border-primary bg-primary text-primary-foreground":"border-border hover:border-primary/50"}`}>{statusLabel(st)}</button>)}</div></div>}<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{shown.map(x=><article key={x.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(25,60,120,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(25,60,120,0.13)]"><div className="relative aspect-video overflow-hidden bg-muted/50">{x.image?<Image src={`/images/portfolio/${x.image}-public-1440x810.webp`} alt={`${x.name} public website preview`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"/>:<div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 text-indigo-700">{(() => { const Icon = productIcons[x.id] ?? Smartphone; return <Icon className="size-16 drop-shadow-sm" strokeWidth={1.4} aria-hidden />; })()}<span className="text-sm font-semibold">{x.name}</span></div>}</div><div className="flex flex-1 flex-col gap-3 p-4"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-border px-2.5 py-1 text-[11px]">{catalogs[lang].categories[x.category as keyof typeof catalogs["id"]["categories"]]}</span><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">{catalogs[lang].policy.statuses[x.status]}</span></div><h3 className="text-lg font-bold tracking-tight text-slate-950">{x.name}</h3><p className="flex-1 text-sm leading-6 text-muted-foreground">{x.summary[lang]}</p><p className="text-xs text-muted-foreground">{x.deployment}{x.note?` · ${x.note}`:""}</p>{x.image&&<p className="text-[11px] leading-4 text-muted-foreground/80">{t.preview}</p>}<Link href={`/projects/${x.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{lang==="id"?"Lihat studi kasus":lang==="zh"?"查看案例":"View case study"}<ArrowUpRight className="size-4"/></Link></div></article>)}</div>{shown.length===0&&<p className="py-10 text-center text-muted-foreground">{t.no}</p>}{featured&&<div className="mt-9 text-center"><Link href="/projects" className="inline-flex rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted">{t.more} →</Link></div>}</div></section>;
}
