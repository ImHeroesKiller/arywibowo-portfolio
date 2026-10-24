"use client";

import { ArrowUp, Loader2, MessageCircle, X, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ChatMessage } from "@/components/chat-message";
import { IdaConsultationForm } from "@/components/ida-consultation-form";
import { IdaAvatar } from "@/components/ida-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { consultationIntent, visitorConsultationSummary } from "@/lib/ida-consultation-intent";
import { consultationLanguage, consultationSummary, isConsultationStart, type ConsultationLocale } from "@/lib/ida-consultation-flow";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-primary/80 [animation-delay:-0.2s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/80 [animation-delay:-0.1s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/80" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function IdaChatbot() {
  const t = useTranslations("ida");
  const [open, setOpen] = useState(false);
  const [consultStage,setConsultStage]=useState<"questions"|"summary"|"form"|null>(null);
  const [consultAnswers,setConsultAnswers]=useState<string[]>([]);
  const [consultQuestions,setConsultQuestions]=useState<string[]>([]);
  const [consultGoal,setConsultGoal]=useState("");
  const [questionError,setQuestionError]=useState(false);
  const [consultLocale,setConsultLocale]=useState<ConsultationLocale>("id");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content: t("welcome"),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    // Desktop gets instant focus. On mobile, avoid forcing open the keyboard
    // and shrinking the conversation immediately.
    if (window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  async function askNextQuestion(goal:string, loc:ConsultationLocale, answers:string[], questions:string[]) {
    setLoading(true);setQuestionError(false);setError(null);
    try {
      const response=await fetch("/api/consultation-question",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal,language:loc,answers:answers.map((answer,index)=>({question:questions[index],answer}))})});
      const result=await response.json() as {question?:string;error?:string};
      if(!response.ok || !result.question)throw new Error(result.error||"AI_UNAVAILABLE");
      setConsultQuestions([...questions,result.question]);
      setMessages(prev=>[...prev,{id:createId(),role:"assistant",content:result.question!}]);
    }catch {
      setQuestionError(true);
      setMessages(prev=>[...prev,{id:createId(),role:"assistant",content:loc==="id"?"IDA belum berhasil membuat pertanyaan karena koneksi model sedang bermasalah. Kebutuhan Anda tetap tersimpan. Anda bisa mencoba ulang, menjelaskan kebutuhan lebih lanjut, atau membuka formulir konsultasi tanpa menunggu AI.":loc==="zh"?"IDA 目前无法生成问题，您的需求仍已保留。您可以重试，或直接继续填写咨询表单。":"IDA couldn't generate a question due to a model connection issue. Your request is preserved. Retry, or continue to the consultation form without waiting for AI."}]);
    }finally{setLoading(false);}
  }

  function startConsultation(firstMessage?:string) {
    const goal=firstMessage || messages.filter(m=>m.role==="user").at(-1)?.content || "Business consultation";
    const loc=consultationLanguage(goal, "id");
    setConsultLocale(loc);setConsultGoal(goal);
    setConsultAnswers([]);setConsultQuestions([]);setConsultStage("questions");setQuestionError(false);
    void askNextQuestion(goal,loc,[],[]);
  }

  async function handleSend(suggested?: string) {
    const trimmed = (suggested ?? input).trim();
    if (!trimmed || loading || trimmed.length > 750) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    if (consultStage === "questions") {
      if(questionError || consultQuestions.length!==consultAnswers.length+1){
        setMessages(messages);setInput(trimmed);return;
      }
      const updated=[...consultAnswers,trimmed];
      setConsultAnswers(updated);
      if (updated.length >= 4) {
        setConsultStage("summary");
        setMessages(prev=>[...prev,{id:createId(),role:"assistant",content:consultLocale==="id"?"Terima kasih. Berikut ringkasan dari empat jawaban Anda. Silakan periksa, koreksi jika perlu, lalu lanjutkan ke formulir konsultasi.":consultLocale==="zh"?"感谢您提供信息。请确认摘要，然后继续填写咨询表单。":"Thanks. Please review the summary of your four answers before continuing to the consultation form."}]);
      } else {
        void askNextQuestion(consultGoal,consultLocale,updated,consultQuestions);
      }
      return;
    }
    if (consultStage === "summary") {
      if (/^(?:ubah|edit|koreksi|change|revise|修改)/i.test(trimmed)) {
        setConsultStage("questions");setConsultAnswers([]);setConsultQuestions([]);
        void askNextQuestion(consultGoal,consultLocale,[],[]);
        return;
      }
      if (consultationIntent(trimmed)==="open-form" || /^(?:lanjut|iya|ya|yes|continue|next|submit|send|kirim|继续|下一步)/i.test(trimmed)) {
        setConsultStage("form");return;
      }
    }
    if (!consultStage && isConsultationStart(trimmed)) {
      startConsultation(trimmed);return;
    }
    const lastAssistant = [...messages].reverse().find(message => message.role === "assistant")?.content ?? "";
    const confirmedHandoff = /^(?:iya|ya|yes|oke|ok|boleh|baik|sure)(?:[.,! ]|$)/i.test(trimmed)
      && /(?:jadwalkan konsultasi|kirim formulir|request consultation|schedule a consultation|consultation form)/i.test(lastAssistant);
    const intent = confirmedHandoff ? "open-form" : consultationIntent(trimmed);
    if (intent === "open-form") {
      setMessages((prev)=>[...prev,{id:createId(),role:"assistant",content:t("formHandoff")}]);
      startConsultation(trimmed);
      return;
    }
    if (intent === "show-summary") {
      const summary = visitorConsultationSummary(nextMessages);
      setMessages((prev)=>[...prev,{id:createId(),role:"assistant",content:summary ? `${t("summaryIntro")}\n\n${summary}\n\n${t("summaryNext")}` : t("summaryEmpty")}]);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-8).map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        const errorKey = data.error ?? "SERVER_ERROR";
        throw new Error(errorKey);
      }

      if (!data.message) {
        throw new Error("EMPTY_RESPONSE");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: data.message!,
        },
      ]);
    } catch (err) {
      const code = err instanceof Error ? err.message : "SERVER_ERROR";
      const known = [
        "NOT_CONFIGURED", "AI_UNAVAILABLE", "EMPTY_RESPONSE", "SERVER_ERROR",
        "VALIDATION_REQUIRED", "RATE_LIMITED", "INVALID_REQUEST",
        "PAYLOAD_TOO_LARGE", "FORBIDDEN_ORIGIN", "UNSUPPORTED_MEDIA_TYPE",
      ];
      setError(t(`errors.${known.includes(code) ? code : "SERVER_ERROR"}` as "errors.SERVER_ERROR"));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          className={cn(
            "fixed inset-0 z-[80] flex h-[100dvh] w-full flex-col overflow-hidden bg-card shadow-2xl",
            "sm:relative sm:inset-auto sm:h-[min(40rem,calc(100dvh-7rem))] sm:w-[min(26rem,calc(100vw-2rem))] sm:rounded-2xl sm:border sm:border-border/70",
            "animate-in fade-in slide-in-from-bottom-3 duration-200"
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:py-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <IdaAvatar alt={t("title")} size="md" className="shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold leading-tight text-foreground">
                  {t("name")}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t("close")}
            >
              <X className="size-5" />
            </button>
          </header>

          <div
            className="ida-chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1" aria-label={t("suggestedLabel")}>
                {(["suggestedProduct", "suggestedServices", "suggestedConsultation"] as const).map((key) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => key === "suggestedConsultation" ? startConsultation(t(key)) : void handleSend(t(key))}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-left text-xs font-medium leading-5 text-primary transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            )}

            {consultStage === "questions" && (
              <div className="rounded-xl border border-primary/20 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700" role="status">
                {consultLocale==="id"?`Konsultasi dengan IDA · Pertanyaan ${consultAnswers.length+1} dari 4`:consultLocale==="zh"?`咨询 · 第 ${consultAnswers.length+1} / 4 个问题`:`Consultation · Question ${consultAnswers.length+1} of 4`}
              </div>
            )}
            {consultStage === "questions" && questionError && (
              <div className="grid gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3" role="status">
                <p className="text-sm text-amber-900">{consultLocale==="id"?"Model IDA sedang tidak tersedia. Kebutuhan Anda tidak hilang; belum ada email yang dikirim.":consultLocale==="zh"?"IDA 模型暂时不可用。您的需求已保留，尚未发送邮件。":"IDA is temporarily unavailable. Your request is preserved; no email has been sent."}</p>
                <button type="button" className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground" onClick={()=>void askNextQuestion(consultGoal,consultLocale,consultAnswers,consultQuestions)}>{consultLocale==="id"?"Coba tanya IDA lagi":consultLocale==="zh"?"重试提问":"Retry IDA question"}</button>
                <button type="button" className="rounded-xl border border-primary/40 bg-white px-4 py-3 text-sm font-semibold text-primary" onClick={()=>setConsultStage("summary")}>{consultLocale==="id"?"Lanjut ke ringkasan dan formulir":consultLocale==="zh"?"继续查看摘要和表单":"Continue to summary and form"}</button>
              </div>
            )}
            {consultStage === "summary" && (
              <section className="rounded-2xl border border-primary/25 bg-white p-4 shadow-sm" data-testid="ida-consult-summary">
                <h3 className="font-semibold">{consultLocale==="id"?"Ringkasan konsultasi":consultLocale==="zh"?"咨询摘要":"Consultation summary"}</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{consultationSummary(consultAnswers,consultLocale,consultQuestions) || consultGoal}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={()=>{setConsultStage("questions");setConsultAnswers([]);setConsultQuestions([]);void askNextQuestion(consultGoal,consultLocale,[],[]);}} className="rounded-xl border border-border px-3 py-3 text-sm font-medium">{consultLocale==="id"?"Ulangi / koreksi":consultLocale==="zh"?"修改摘要":"Edit answers"}</button>
                  <button type="button" onClick={()=>setConsultStage("form")} className="rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground">{consultLocale==="id"?"Lanjut ke formulir":consultLocale==="zh"?"填写咨询表单":"Continue to form"}</button>
                </div>
              </section>
            )}
            {consultStage === "form" && <IdaConsultationForm onBack={()=>setConsultStage("summary")} initialSummary={consultationSummary(consultAnswers,consultLocale,consultQuestions) || consultGoal} conversation={messages.map(({role,content})=>({role,content}))}/>}

            {loading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-3.5 py-2.5 shadow-sm">
                  <TypingIndicator label={t("typing")} />
                </div>
              </div>
            )}

            {error && (
              <p className="animate-in fade-in rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {consultStage !== "form" && consultStage !== "summary" && <footer className="shrink-0 border-t border-border/60 bg-card px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                aria-label={t("placeholder")}
                maxLength={750}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t("placeholder")}
                disabled={loading || (consultStage==="questions" && questionError)}
                className="max-h-28 min-h-12 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim() || (consultStage==="questions" && questionError)}
                aria-label={t("send")}
                className="shrink-0"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <button type="button" onClick={()=>startConsultation()} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"><Mail className="size-3.5" />{t("consultationLink")}</button>
              <span className="text-[11px] tabular-nums text-muted-foreground">{input.length}/750</span>
            </div>
          </footer>}
        </div>
      )}

      <Button
        type="button"
        size="icon-lg"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "size-12 rounded-full shadow-lg shadow-primary/20 transition-all duration-200 sm:size-14",
          open && "hidden sm:flex",
          !open && "gap-0 px-0"
        )}
        aria-expanded={open}
        aria-label={open ? t("close") : t("open")}
      >
        {open ? (
          <X className="size-5 transition-transform duration-200" />
        ) : (
          <MessageCircle className="size-5 transition-transform duration-200" />
        )}
      </Button>
    </div>
  );
}