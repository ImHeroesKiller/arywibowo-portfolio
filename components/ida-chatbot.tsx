"use client";

import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ChatMessage } from "@/components/chat-message";
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
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

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
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
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
      setError(t(`errors.${code}` as "errors.SERVER_ERROR"));
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
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          className={cn(
            "flex h-[min(32rem,calc(100dvh-5.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-md",
            "animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-300"
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card/80 px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <IdaAvatar alt={t("title")} size="lg" className="shrink-0" />
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
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("close")}
            >
              <X className="size-4" />
            </button>
          </header>

          <div
            className="ida-chat-scroll flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-4"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

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

          <footer className="shrink-0 border-t border-border/60 bg-card/80 p-3 sm:p-3.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t("placeholder")}
                disabled={loading}
                className="max-h-24 min-h-10 flex-1 resize-none rounded-xl border border-border/70 bg-background/80 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
                  <Send className="size-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              {t("disclaimer")}
            </p>
          </footer>
        </div>
      )}

      <Button
        type="button"
        size="icon-lg"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "size-12 rounded-full shadow-lg shadow-primary/20 transition-all duration-200 sm:size-14",
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