import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  ApiRequestError,
  enforcePublicApiGuard,
  parseLimitedJson,
  respondApiError,
} from "@/lib/api-guard";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "aku@arywibowo.id";
// Verify the sender domain in Resend before expecting live delivery.
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() ||
  "Ary Wibowo Portfolio <noreply@arywibowo.id>";

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

  // Honeypot: real visitors cannot see this input; never send spam to Resend.
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

export async function POST(request: Request) {
  const blocked = enforcePublicApiGuard(request, "contact", 5, 15 * 60 * 1000);
  if (blocked) return blocked;

  try {
    const input = validateContact(await parseLimitedJson(request, 8 * 1024));
    if (!input) {
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) throw new ApiRequestError(503, "NOT_CONFIGURED");

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: input.email,
      subject: `New contact from ${input.name}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
      html: `<h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
    });
    if (error) {
      console.error("Resend send failed:", error.name);
      throw new ApiRequestError(502, "SEND_FAILED");
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return respondApiError(error, "Contact form error");
  }
}
