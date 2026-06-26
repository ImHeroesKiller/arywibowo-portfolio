"use client";

import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const IdaChatbot = dynamic(
  () => import("@/components/ida-chatbot").then((mod) => mod.IdaChatbot),
  { ssr: false, loading: () => null }
);

export function IdaChatbotDeferred() {
  const t = useTranslations("ida");
  const [shouldLoad, setShouldLoad] = useState(false);

  const activate = useCallback(() => setShouldLoad(true), []);

  useEffect(() => {
    if (shouldLoad) return;

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => setShouldLoad(true), {
        timeout: 5000,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => setShouldLoad(true), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [shouldLoad]);

  if (!shouldLoad) {
    return (
      <button
        type="button"
        onClick={activate}
        aria-label={t("buttonLabel")}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full sm:size-14",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "transition-all duration-200 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        )}
      >
        <MessageCircle className="size-5" aria-hidden />
      </button>
    );
  }

  return <IdaChatbot />;
}