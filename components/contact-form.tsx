"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

const API_ERROR_CODES = [
  "NOT_CONFIGURED",
  "VALIDATION_REQUIRED",
  "INVALID_EMAIL",
  "SEND_FAILED",
  "SERVER_ERROR",
] as const;

type ApiErrorCode = (typeof API_ERROR_CODES)[number];

function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.includes(value as ApiErrorCode);
}

export function ContactForm() {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);

  function getErrorMessage(code?: string) {
    if (code && isApiErrorCode(code)) {
      return t(`errors.${code}`);
    }

    return t("errorDefault");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFallbackHref(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(getErrorMessage(data.error));
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      // Preserve the visitor's message. Offer a user-initiated mailto link
      // until the authenticated Resend sender domain is verified.
      const name = String(payload.name || "");
      const email = String(payload.email || "");
      const message = String(payload.message || "");
      const subject = encodeURIComponent(`Website inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      setFallbackHref(`mailto:aku@arywibowo.id?subject=${subject}&body=${body}`);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("errorDefault")
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-primary">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("successDescription")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border/60 bg-card/50 p-6 sm:space-y-6 sm:p-8"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          {t("name")}
        </label>
        <Input
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          required
          disabled={status === "loading"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          required
          disabled={status === "loading"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("messagePlaceholder")}
          rows={5}
          required
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && (
        <div className="space-y-2" role="alert">
          <p className="text-sm text-destructive">{errorMessage}</p>
          {fallbackHref && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("fallbackNote")}</p>
              <a
                href={fallbackHref}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/50 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t("fallbackButton")}
                <Send className="size-4" aria-hidden />
              </a>
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            {t("sending")}
            <Loader2 className="animate-spin" />
          </>
        ) : (
          <>
            {t("send")}
            <Send />
          </>
        )}
      </Button>
    </form>
  );
}