import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import {
  ApiRequestError,
  enforcePublicApiGuard,
  parseLimitedJson,
  respondApiError,
} from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SMTP_FROM = "no-reply@arywibowo.id";
const DEFAULT_CONTACT_TO = "aku@arywibowo.id";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateContact(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
  const values = data as Record<string, unknown>;

  // Honeypot: bots may fill a field that is hidden from human visitors.
  if (typeof values.website === "string" && values.website.trim()) {
    return null;
  }
  if (
    typeof values.name !== "string" ||
    typeof values.email !== "string" ||
    typeof values.message !== "string"
  ) {
    throw new ApiRequestError(400, "VALIDATION_REQUIRED");
  }

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  if (!name || !email || !message) {
    throw new ApiRequestError(400, "VALIDATION_REQUIRED");
  }
  if (name.length > 120 || email.length > 254 || message.length > 4000) {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiRequestError(400, "INVALID_EMAIL");
  }
  return { name, email, message };
}

function getMailConfig() {
  const password = process.env.SMTP_PASSWORD?.trim();
  if (!password) throw new ApiRequestError(503, "NOT_CONFIGURED");

  const host = process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER?.trim() || DEFAULT_SMTP_FROM;
  if (port !== 465 && port !== 587) {
    throw new ApiRequestError(503, "NOT_CONFIGURED");
  }

  return {
    host,
    port,
    user,
    password,
    sender: process.env.SMTP_FROM?.trim() || DEFAULT_SMTP_FROM,
    recipient: process.env.CONTACT_TO?.trim() || DEFAULT_CONTACT_TO,
  };
}

export async function POST(request: Request) {
  const blocked = enforcePublicApiGuard(request, "contact", 5, 15 * 60 * 1000);
  if (blocked) return blocked;

  try {
    const input = validateContact(await parseLimitedJson(request, 8 * 1024));
    if (!input) {
      return NextResponse.json(
        { success: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const smtp = getMailConfig();
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      requireTLS: smtp.port === 587,
      auth: { user: smtp.user, pass: smtp.password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: true },
    });

    try {
      const result = await transport.sendMail({
        from: { name: "Ary Wibowo Portfolio", address: smtp.sender },
        to: smtp.recipient,
        replyTo: input.email,
        subject: `Website contact from ${input.name}`,
        text: [
          `Name: ${input.name}`,
          `Email: ${input.email}`,
          "",
          "Message:",
          input.message,
        ].join("\n"),
        html: `<h2>New contact from website</h2>
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
      });
      if (!result.accepted.some((value) => value.toLowerCase() === smtp.recipient.toLowerCase())) {
        throw new Error("SMTP recipient was not accepted");
      }
    } catch (error) {
      // Deliberately avoid printing SMTP auth credentials or message content.
      console.error(
        "Contact SMTP send failed:",
        error instanceof Error ? error.name : "Unknown"
      );
      throw new ApiRequestError(502, "SEND_FAILED");
    } finally {
      transport.close();
    }

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return respondApiError(error, "Contact SMTP API error");
  }
}
