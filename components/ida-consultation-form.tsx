"use client";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { visitorConsultationSummary, serviceFromConversation } from "@/lib/ida-consultation-intent";

type Props={ onBack:()=>void; conversation: Array<{role:"user"|"assistant";content:string}> };
const newKey=()=>`${Date.now()}-${Math.random().toString(36).slice(2,12)}`;

export function IdaConsultationForm({onBack,conversation}:Props){
 const t=useTranslations("consultation");
 const [name,setName]=useState("");const [email,setEmail]=useState("");const [organization,setOrganization]=useState("");
 const initialSummary=visitorConsultationSummary(conversation);
 const [service,setService]=useState(serviceFromConversation(initialSummary));
 const [summary,setSummary]=useState(initialSummary);
 const [includeExcerpt,setIncludeExcerpt]=useState(false);
 const [consent,setConsent]=useState(false);
 const [review,setReview]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState<string|null>(null);
 const [reference,setReference]=useState<string|null>(null);
 const [website,setWebsite]=useState("");
 const [key,setKey]=useState(newKey);
 const approvedExcerpt=includeExcerpt?conversation.filter(m=>m.role==="user").slice(-3).map(m=>m.content).join("\n").slice(0,1200):"";
 const field="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary";
 async function send(){if(busy||!consent)return;setBusy(true);setError(null);
  try{
   const response=await fetch("/api/consultations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,organization,service,summary,excerpt:approvedExcerpt,website,consent:true,consentVersion:"2026-10",idempotencyKey:key})});
   const data=await response.json() as {success?:boolean;reference?:string;error?:string};
   if(!response.ok||!data.success||!data.reference)throw new Error(data.error||"SEND_FAILED");
   setReference(data.reference);
  }catch(err){setError(t("sendError")+" ("+(err instanceof Error?err.message:"SEND_FAILED")+")");}
  finally{setBusy(false);}
 }
 if(reference)return <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center" role="status"><CheckCircle2 className="size-12 text-emerald-600"/><h2 className="text-lg font-semibold">{t("success")}</h2><p className="text-sm text-muted-foreground">{t("reference")}</p><code className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold">{reference}</code><p className="text-sm text-muted-foreground">{t("successDescription")}</p><Button type="button" variant="outline" onClick={onBack}>{t("backChat")}</Button></div>;
 return <div className="ida-chat-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5" data-testid="ida-consultation-form">
  <button type="button" onClick={()=>{setReview(false);onBack();}} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary"><ArrowLeft className="size-4"/>{t("backChat")}</button>
  <h2 className="text-xl font-semibold tracking-tight">{review?t("reviewTitle"):t("title")}</h2>
  <p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground">{review?t("reviewDescription"):t("description")}</p>
  <form onSubmit={event=>{event.preventDefault();if(review){void send();}else{setReview(true);setKey(newKey());}}} className="space-y-4">
   <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"/></label></div>
   <label className="block text-sm font-medium">{t("name")} *<input className={field+" mt-1"} value={name} onChange={e=>{setName(e.target.value);setReview(false);}} maxLength={120} required disabled={busy} autoComplete="name"/></label>
   <label className="block text-sm font-medium">{t("email")} *<input className={field+" mt-1"} type="email" value={email} onChange={e=>{setEmail(e.target.value);setReview(false);}} maxLength={254} required disabled={busy} autoComplete="email"/></label>
   <label className="block text-sm font-medium">{t("organization")}<input className={field+" mt-1"} value={organization} onChange={e=>{setOrganization(e.target.value);setReview(false);}} maxLength={120} disabled={busy} autoComplete="organization"/></label>
   <label className="block text-sm font-medium">{t("service")} *<input className={field+" mt-1"} value={service} onChange={e=>{setService(e.target.value);setReview(false);}} maxLength={140} required disabled={busy} placeholder={t("servicePlaceholder")}/></label>
   <label className="block text-sm font-medium">{t("summary")} *<textarea rows={5} className={field+" mt-1 resize-y"} value={summary} onChange={e=>{setSummary(e.target.value);setReview(false);}} maxLength={3500} required disabled={busy} placeholder={t("summaryPlaceholder")}/></label>
   <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={includeExcerpt} onChange={e=>{setIncludeExcerpt(e.target.checked);setReview(false);}} disabled={busy} className="mt-1 size-4 accent-primary"/><span>{t("excerptOptIn")}</span></label>
   {includeExcerpt&&<div className="rounded-xl border border-border bg-muted/40 p-3 text-sm"><p className="mb-1 font-medium">{t("excerptPreview")}</p><p className="whitespace-pre-wrap break-words text-muted-foreground">{approvedExcerpt||t("noExcerpt")}</p></div>}
   {review&&<div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm"><p className="font-semibold">{t("reviewNotice")}</p><p className="mt-2 text-muted-foreground">{t("reviewDescription")}</p><p className="mt-2 font-medium">{email}</p></div>}
   <label className="flex cursor-pointer items-start gap-3 text-sm leading-6"><input className="mt-1 size-4 shrink-0 accent-primary" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required disabled={busy}/><span>{t("consent")}</span></label>
   {error&&<p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
   <Button className="w-full" type="submit" disabled={busy||!consent||!name.trim()||!email.trim()||!service.trim()||!summary.trim()}>
    {busy?<Loader2 className="mr-2 size-4 animate-spin"/>:review?<Send className="mr-2 size-4"/>:null}{review?t("send"):t("review")}
   </Button>
  </form>
 </div>;
}
