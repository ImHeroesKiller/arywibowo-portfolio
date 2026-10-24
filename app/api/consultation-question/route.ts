import { NextResponse } from "next/server";
import { ApiRequestError, enforcePublicApiGuard, parseLimitedJson, respondApiError } from "@/lib/api-guard";
import { normalizeIdaResponse } from "@/lib/ida-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;
const url = "https://api-ida.arywibowo.id/api/v1/chat/completions";
type Language = "id" | "en" | "zh";
type Pair = {question: string; answer: string};
function validate(value: unknown): {language: Language; goal: string; answers: Pair[]} {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiRequestError(400,"INVALID_REQUEST");
  const raw = value as Record<string,unknown>;
  if (!["id","en","zh"].includes(String(raw.language))) throw new ApiRequestError(400,"INVALID_REQUEST");
  if (typeof raw.goal !== "string" || !raw.goal.trim() || raw.goal.length>750) throw new ApiRequestError(400,"INVALID_REQUEST");
  if (!Array.isArray(raw.answers) || raw.answers.length>3) throw new ApiRequestError(400,"INVALID_REQUEST");
  const answers: Pair[] = raw.answers.map((pair:unknown)=>{
    if (!pair || typeof pair!=="object") throw new ApiRequestError(400,"INVALID_REQUEST");
    const p=pair as Record<string,unknown>;
    if (typeof p.question!=="string" || typeof p.answer!=="string" || !p.question.trim() || !p.answer.trim() || p.question.length>350 || p.answer.length>750) throw new ApiRequestError(400,"INVALID_REQUEST");
    return {question:p.question.trim(),answer:p.answer.trim()};
  });
  return {language:raw.language as Language,goal:raw.goal.trim(),answers};
}

export async function POST(request:Request){
  const denied=enforcePublicApiGuard(request,"consultation-question",8,10*60*1000);
  if(denied)return denied;
  try {
    const {language,goal,answers}=validate(await parseLimitedJson(request,8*1024));
    const secret=process.env.IDA_API_KEY?.trim();
    if(!secret) throw new ApiRequestError(503,"NOT_CONFIGURED");
    const history=answers.map((a,i)=>`Question ${i+1}: ${a.question}\nVisitor: ${a.answer}`).join("\n");
    const lang=language==="id"?"Bahasa Indonesia":language==="zh"?"Simplified Chinese":"English";
    const system=`You are IDA, a skilled business and technology discovery consultant for Ary Wibowo. Ask exactly ONE new, meaningful, concise question in ${lang}, based specifically on the visitor's stated goal and answers. This is question ${answers.length+1} of 4 in a discovery flow. Do not repeat or paraphrase earlier questions. Focus on missing practical discovery dimensions (current process, pain points, scope/users/integrations, desired outcomes, constraints/timeline) according to what is still unknown. Do NOT default to a fixed questionnaire. Do NOT answer the visitor's question, promise to send email or book meetings, provide a summary, give HTML/code/JSON, or ask several questions. Output ONLY the single question, max 42 words. If user has already covered common dimensions, ask about the most important unresolved business decision.`;
    const endpoint=process.env.IDA_MOCK_TEST==="true" && process.env.IDA_MOCK_ENDPOINT==="http://127.0.0.1:3199/chat/completions" ? process.env.IDA_MOCK_ENDPOINT : url;
    async function completion(model:string){
      let response:Response;
      try {response=await fetch(endpoint,{method:"POST",headers:{Authorization:`Bearer ${secret}`,"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"system",content:system},{role:"user",content:`Business request: ${goal}\n${history}\nAsk the next most useful specific question.`}],max_tokens:125,temperature:0.5,stream:false,ida:{web_search:false}}),cache:"no-store",signal:AbortSignal.timeout(30000)});}catch{throw new ApiRequestError(504,"AI_UNAVAILABLE");}
      if(!response.ok)return {status:response.status,question:""};
      let data:unknown;
      try{data=await response.json();}catch{return {status:502,question:""};}
      const raw=(data as {choices?:Array<{message?:{content?:unknown}}>})?.choices?.[0]?.message?.content;
      if(typeof raw!=="string")return {status:502,question:""};
      let question=normalizeIdaResponse(raw).replace(/^[\s"']+|[\s"']+$/g,"").trim();
      if(question.length>350)question=question.slice(0,350).trim();
      if(!question || question.length<12 || /<[^>]+>|```/.test(question))return {status:502,question:""};
      if(!/[?？]$/.test(question))question += language==="zh"?"？":"?";
      return {status:200,question};
    }
    let result=await completion("ida-chat-fast");
    if([502,503,504].includes(result.status))result=await completion("ida-chat");
    if(result.status!==200)throw new ApiRequestError(result.status===429?429:503,result.status===429?"RATE_LIMITED":"AI_UNAVAILABLE");
    return NextResponse.json({question:result.question,step:answers.length+1},{headers:{"Cache-Control":"no-store"}});
  }catch(error){return respondApiError(error,"Consultation question API error");}
}
