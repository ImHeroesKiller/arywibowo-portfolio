import { NextResponse } from "next/server";
import { ApiRequestError, enforcePublicApiGuard, parseLimitedJson, respondApiError } from "@/lib/api-guard";
import { IDA_MAX_OUTPUT_TOKENS, IDA_MODEL, IDA_TEMPERATURE, buildIdaPrompt } from "@/lib/ida-prompt";
import { buildRetrievalContext } from "@/lib/rag";
import { normalizeIdaResponse } from "@/lib/ida-response";
import { MAX_INPUT_CHARS, localFallback, relevantProducts, trimChatHistory } from "@/lib/ida-budget";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// IDA's documented response time can be longer when the provider is busy.
export const maxDuration = 180;

const IDA_CHAT_URL = "https://api-ida.arywibowo.id/api/v1/chat/completions";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_LENGTH = 10000;

type ChatMessage = { role: "user" | "assistant"; content: string };
type Completion = { choices?: Array<{ message?: { content?: unknown } }> };

function validateMessages(payload: unknown): ChatMessage[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
  const messages = (payload as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) throw new ApiRequestError(400, "VALIDATION_REQUIRED");
  if (messages.length > MAX_MESSAGES) throw new ApiRequestError(400, "INVALID_REQUEST");

  const safe: ChatMessage[] = [];
  let totalLength = 0;
  for (const message of messages) {
    if (!message || typeof message !== "object" ||
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string" || message.content.length > MAX_MESSAGE_LENGTH) {
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

async function callIda(messages: ChatMessage[]) {
  const apiKey = process.env.IDA_API_KEY?.trim();
  if (!apiKey) throw new ApiRequestError(503, "NOT_CONFIGURED");

  // No client-supplied URL is accepted. Test override is opt-in only for local mock tests.
  const endpoint = process.env.IDA_MOCK_TEST === "true" &&
    process.env.IDA_MOCK_ENDPOINT === "http://127.0.0.1:3199/chat/completions"
    ? process.env.IDA_MOCK_ENDPOINT : IDA_CHAT_URL;

  const question = messages.at(-1)!.content;
  const context = buildRetrievalContext(question);
  const productContext = relevantProducts(question);
  const body = {
    model: IDA_MODEL,
    messages: [
      { role: "system", content: buildIdaPrompt(context, productContext) },
      ...trimChatHistory(messages),
    ],
    max_tokens: IDA_MAX_OUTPUT_TOKENS,
    temperature: IDA_TEMPERATURE,
    stream: false,
    ida: { web_search: false },
  };

  async function requestCompletion(model: string): Promise<{response: Response; result: Completion | null; providerCode: string}> {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({...body, model}),
        cache: "no-store",
        signal: AbortSignal.timeout(35_000),
      });
    } catch {
      throw new ApiRequestError(504, "AI_UNAVAILABLE");
    }
    let data: unknown = null;
    try { data = await response.json(); } catch { /* provider sometimes returns an empty error body */ }
    const parsed = data && typeof data === "object" ? data as {error?: {code?: unknown}} : {};
    const rawCode = parsed.error?.code;
    const providerCode = typeof rawCode === "string" && /^[A-Z_]{2,50}$/.test(rawCode) ? rawCode : "UNKNOWN";
    return {response, result: response.ok ? data as Completion : null, providerCode};
  }

  let {response, result, providerCode} = await requestCompletion(IDA_MODEL);
  // One controlled fallback only when mini provider is temporarily unavailable.
  if (!response.ok && [502,503,504].includes(response.status)) {
    console.warn("IDA mini temporarily unavailable; attempting balanced model fallback", {status:response.status,code:providerCode});
    ({response,result,providerCode} = await requestCompletion("ida-chat"));
  }
  if (!response.ok) {
    console.warn("IDA upstream request failed", {status:response.status,code:providerCode});
    if (response.status === 429) throw new ApiRequestError(429,"RATE_LIMITED");
    if (response.status === 401 || response.status === 403) throw new ApiRequestError(503,"NOT_CONFIGURED");
    if (response.status === 402) throw new ApiRequestError(503,"AI_UNAVAILABLE");
    throw new ApiRequestError(502,"AI_UNAVAILABLE");
  }
  if (!result) throw new ApiRequestError(502,"AI_UNAVAILABLE");
  const message = result.choices?.[0]?.message?.content;
  if (typeof message !== "string" || !message.trim()) throw new ApiRequestError(502, "EMPTY_RESPONSE");
  const normalized = normalizeIdaResponse(message);
  if (!normalized) throw new ApiRequestError(502, "EMPTY_RESPONSE");
  return normalized;
}

export async function POST(request: Request) {
  const blocked = enforcePublicApiGuard(request, "chat", 12, 10 * 60 * 1000);
  if (blocked) return blocked;
  try {
    const messages = validateMessages(await parseLimitedJson(request, 32 * 1024));
    const last = messages.at(-1)!.content;
    if (last.length > MAX_INPUT_CHARS) throw new ApiRequestError(400,"INVALID_REQUEST");
    const reply = localFallback(last);
    const message = reply ?? await callIda(messages);
    return NextResponse.json({ message }, { headers: { "Cache-Control": "no-store", "X-IDA-Route": reply ? "local" : "model" } });
  } catch (error) {
    return respondApiError(error, "IDA chat API error");
  }
}
