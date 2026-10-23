import { NextResponse } from "next/server";
import {
  ApiRequestError,
  enforcePublicApiGuard,
  parseLimitedJson,
  respondApiError,
} from "@/lib/api-guard";
import {
  IDA_MAX_OUTPUT_TOKENS,
  IDA_MODEL,
  IDA_TEMPERATURE,
  buildIdaPrompt,
} from "@/lib/ida-prompt";
import { buildRetrievalContext } from "@/lib/rag";

export const dynamic = "force-dynamic";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_LENGTH = 10000;

type ChatMessage = { role: "user" | "assistant"; content: string };
type GeminiContent = { role: "user" | "model"; parts: Array<{ text: string }> };

function validateMessages(payload: unknown): ChatMessage[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
  const messages = (payload as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ApiRequestError(400, "VALIDATION_REQUIRED");
  }
  if (messages.length > MAX_MESSAGES) {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
  const safe: ChatMessage[] = [];
  let totalLength = 0;
  for (const message of messages) {
    if (
      !message ||
      typeof message !== "object" ||
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string" ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      throw new ApiRequestError(400, "INVALID_REQUEST");
    }
    const content = message.content.trim();
    if (!content) throw new ApiRequestError(400, "VALIDATION_REQUIRED");
    totalLength += content.length;
    safe.push({ role: message.role, content });
  }
  if (totalLength > MAX_TOTAL_LENGTH) throw new ApiRequestError(400, "INVALID_REQUEST");
  if (safe.at(-1)?.role !== "user") throw new ApiRequestError(400, "VALIDATION_REQUIRED");
  return safe;
}

async function callGemini(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new ApiRequestError(503, "NOT_CONFIGURED");
  const contents: GeminiContent[] = messages.map(({ role, content }) => ({
    role: role === "assistant" ? "model" : "user",
    parts: [{ text: content }],
  }));

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_BASE}/${IDA_MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: IDA_TEMPERATURE,
          maxOutputTokens: IDA_MAX_OUTPUT_TOKENS,
        },
      }),
    });
  } catch {
    throw new ApiRequestError(504, "AI_UNAVAILABLE");
  }
  if (!response.ok) {
    // Avoid logging provider response bodies, which may contain user content.
    console.error("Gemini API status:", response.status);
    throw new ApiRequestError(502, "AI_UNAVAILABLE");
  }
  const body = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const answer = body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!answer) throw new ApiRequestError(502, "EMPTY_RESPONSE");
  return answer;
}

export async function POST(request: Request) {
  const blocked = enforcePublicApiGuard(request, "chat", 12, 10 * 60 * 1000);
  if (blocked) return blocked;

  try {
    const payload = await parseLimitedJson(request, 32 * 1024);
    const messages = validateMessages(payload);
    const context = buildRetrievalContext(messages.at(-1)!.content);
    const message = await callGemini(buildIdaPrompt(context), messages);
    return NextResponse.json({ message }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return respondApiError(error, "IDA chat error");
  }
}
