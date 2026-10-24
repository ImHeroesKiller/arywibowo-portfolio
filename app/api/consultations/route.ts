import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { ApiRequestError, enforcePublicApiGuard, parseLimitedJson, respondApiError } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_FROM = "no-reply@arywibowo.id";
const DEFAULT_RECIPIENT = "aku@arywibowo.id";
const MAX_MESSAGE = 3500;
const received = new Map<string,{reference:string; timestamp:number}>();
const DUPLICATE_WINDOW_MS=15*60*1000;

type Consultation = {name:string;email:string;organization:string;service:string;summary:string;excerpt:string;website:string;consent:boolean; consentVersion:string; idempotencyKey:string};
const esc=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
function parseInput(input:unknown):Consultation | null {
  if (!input || typeof input!=="object" || Array.isArray(input)) throw new ApiRequestError(400,"INVALID_REQUEST");
  const raw=input as Record<string,unknown>;
  if (typeof raw.website==="string" && raw.website.trim()) return null;
  const fields=["name","email","organization","service","summary","excerpt","idempotencyKey","consentVersion"] as const;
  for(const field of fields){if(typeof raw[field]!=="string") throw new ApiRequestError(400,"VALIDATION_REQUIRED");}
  const v=Object.fromEntries(fields.map(key=>[key,(raw[key] as string).trim()])) as Pick<Consultation,typeof fields[number]>;
  if(raw.consent!==true || v.consentVersion!=="2026-10") throw new ApiRequestError(400,"CONSENT_REQUIRED");
  if(!v.name || !v.email || !v.service || !v.summary) throw new ApiRequestError(400,"VALIDATION_REQUIRED");
  if(v.name.length>120 || v.email.length>254 || v.organization.length>120 || v.service.length>140 || v.summary.length>MAX_MESSAGE || v.excerpt.length>1200)throw new ApiRequestError(400,"INVALID_REQUEST");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))throw new ApiRequestError(400,"INVALID_EMAIL");
  if(!/^[a-zA-Z0-9-]{8,80}$/.test(v.idempotencyKey))throw new ApiRequestError(400,"INVALID_REQUEST");
  return {...v,website:"",consent:true};
}

export async function POST(request:Request){
  const blocked=enforcePublicApiGuard(request,"consultation",3,15*60*1000);
  if(blocked)return blocked;
  try{
    const value=parseInput(await parseLimitedJson(request,8*1024));
    if(!value)return NextResponse.json({success:true,ignored:true},{headers:{"Cache-Control":"no-store"}});
    const now=Date.now();
    for(const [key,val] of received){if(now-val.timestamp>DUPLICATE_WINDOW_MS)received.delete(key);}
    const prior=received.get(value.idempotencyKey);
    if(prior)return NextResponse.json({success:true,reference:prior.reference,duplicate:true},{headers:{"Cache-Control":"no-store"}});
    const password=process.env.SMTP_PASSWORD?.trim();
    if(!password)throw new ApiRequestError(503,"NOT_CONFIGURED");
    const port=Number(process.env.SMTP_PORT||"465");
    if(![465,587].includes(port))throw new ApiRequestError(503,"NOT_CONFIGURED");
    const recipient=process.env.CONTACT_TO?.trim()||DEFAULT_RECIPIENT;
    const sender=process.env.SMTP_FROM?.trim()||DEFAULT_FROM;
    const ref=`IDA-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${randomUUID().slice(0,8).toUpperCase()}`;
    const lines=[`Reference: ${ref}`,`Name: ${value.name}`,`Email: ${value.email}`,`Organization: ${value.organization||"Not provided"}`,`Service: ${value.service}`,`Consent version: ${value.consentVersion}`,"","Consultation summary:",value.summary];
    if(value.excerpt)lines.push("","Visitor-approved conversation excerpt:",value.excerpt);
    const text=lines.join("\n");
    const transport=nodemailer.createTransport({host:process.env.SMTP_HOST?.trim()||"smtp.hostinger.com",port,secure:port===465,requireTLS:port===587,auth:{user:process.env.SMTP_USER?.trim()||DEFAULT_FROM,pass:password},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,tls:{rejectUnauthorized:true}});
    try{
      const sent=await transport.sendMail({from:{name:"IDA Portfolio Consultation",address:sender},to:recipient,replyTo:value.email,subject:`[${ref}] Consultation: ${value.service.replace(/[\r\n]/g," ").slice(0,90)}`,text,html:`<h2>IDA Consultation — ${esc(ref)}</h2><pre style="white-space:pre-wrap;font-family:system-ui">${esc(text)}</pre>`});
      if(!sent.accepted.some(address=>address.toLowerCase()===recipient.toLowerCase()))throw Error("recipient refused");
    }catch(error){console.error("Consultation SMTP failed",error instanceof Error?error.name:"unknown");throw new ApiRequestError(502,"SEND_FAILED");}
    finally{transport.close();}
    // This deduplication is per instance, not guaranteed across serverless replicas.
    received.set(value.idempotencyKey,{reference:ref,timestamp:now});
    return NextResponse.json({success:true,reference:ref},{headers:{"Cache-Control":"no-store"}});
  }catch(error){return respondApiError(error,"Consultation API error");}
}
