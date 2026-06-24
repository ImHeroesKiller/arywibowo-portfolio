"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
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
        throw new Error(data.error ?? t("errorFailed"));
      }

      setStatus("success");
      e.currentTarget.reset();
    } catch (error) {
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
      className="space-y-6 rounded-xl border border-border/60 bg-card/50 p-6 sm:p-8"
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
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
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