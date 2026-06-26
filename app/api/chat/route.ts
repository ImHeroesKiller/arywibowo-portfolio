import { NextResponse } from "next/server";

import {
  IDA_MAX_OUTPUT_TOKENS,
  IDA_MODEL,
  buildIdaPrompt,
} from "@/lib/ida-prompt";
import { buildRetrievalContext } from "@/lib/rag";

export const dynamic = "force-dynamic";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = {
  messages?: ChatMessage[];
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function toGeminiHistory(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

async function callGemini(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("NOT_CONFIGURED");
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/${IDA_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: toGeminiHistory(messages),
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: IDA_MAX_OUTPUT_TOKENS,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error("Gemini API error:", response.status, body.slice(0, 500));
    throw new Error(`GEMINI_ERROR_${response.status}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("EMPTY_RESPONSE");
  }

  return text;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatPayload;
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "VALIDATION_REQUIRED" }, { status: 400 });
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!lastUserMessage?.content.trim()) {
      return NextResponse.json({ error: "VALIDATION_REQUIRED" }, { status: 400 });
    }

    const retrievalContext = buildRetrievalContext(lastUserMessage.content);
    const systemPrompt = buildIdaPrompt(retrievalContext);
    const reply = await callGemini(systemPrompt, messages);

    return NextResponse.json({ message: reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "SERVER_ERROR";

    if (message === "NOT_CONFIGURED") {
      return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 500 });
    }

    if (message.startsWith("GEMINI_ERROR_")) {
      return NextResponse.json({ error: "AI_UNAVAILABLE" }, { status: 502 });
    }

    if (message === "EMPTY_RESPONSE") {
      return NextResponse.json({ error: "EMPTY_RESPONSE" }, { status: 502 });
    }

    console.error("Chat API error:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}