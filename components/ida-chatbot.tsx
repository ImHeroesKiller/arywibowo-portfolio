"use client";

import { ArrowUp, Loader2, MessageCircle, X, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ChatMessage } from "@/components/chat-message";
import { IdaConsultationForm } from "@/components/ida-consultation-form";
import { IdaAvatar } from "@/components/ida-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [consulting,setConsulting]=useState(false);
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

          {consulting ? <IdaConsultationForm onBack={()=>setConsulting(false)} conversation={messages.map(({role,content})=>({role,content}))}/> : <div
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
                    onClick={() => void handleSend(t(key))}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-left text-xs font-medium leading-5 text-primary transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            )}

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
          </div>}

          {!consulting && <footer className="shrink-0 border-t border-border/60 bg-card px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:p-4">
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
                disabled={loading}
                className="max-h-28 min-h-12 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
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
              <button type="button" onClick={()=>setConsulting(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"><Mail className="size-3.5" />{t("consultationLink")}</button>
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