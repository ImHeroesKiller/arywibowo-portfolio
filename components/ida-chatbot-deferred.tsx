"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { IdaAvatar } from "@/components/ida-avatar";
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
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "transition-transform duration-200 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        )}
      >
        <IdaAvatar alt={t("title")} className="size-9" />
      </button>
    );
  }

  return <IdaChatbot />;
}