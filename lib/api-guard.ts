import { isIP } from "node:net";
import { NextResponse } from "next/server";

export class ApiRequestError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

/**
 * Best-effort per-instance limiter. A Vercel WAF rule or shared Redis backend
 * is still required for a global, multi-region rate-limit guarantee.
 */
const counters = new Map<string, { count: number; reset: number }>();
const MAX_BUCKETS = 4000;

export function takeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: boolean; retryAfter: number } {
  const current = counters.get(key);
  if (!current || current.reset <= now) {
    if (counters.size >= MAX_BUCKETS) {
      for (const [id, bucket] of counters) {
        if (bucket.reset <= now) counters.delete(id);
      }
      if (counters.size >= MAX_BUCKETS) {
        const oldest = counters.keys().next().value;
        if (oldest) counters.delete(oldest);
      }
    }
    counters.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.reset - now) / 1000)),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function enforcePublicApiGuard(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "FORBIDDEN_ORIGIN" }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "UNSUPPORTED_MEDIA_TYPE" }, { status: 415 });
  }
  // Vercel overwrites x-forwarded-for to prevent client-supplied IP spoofing.
  // Prefer its dedicated header, then the platform-forwarded address. Do NOT
  // prefer a caller's x-real-ip header or arbitrary user-provided identifiers.
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim() || "";
  const ip = isIP(candidate) ? candidate.toLowerCase() : "unidentified";
  const result = takeRateLimit(`${scope}:${ip}`, limit, windowMs);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfter), "Cache-Control": "no-store" },
      }
    );
  }
  return null;
}

export async function parseLimitedJson(request: Request, maxBytes: number): Promise<unknown> {
  const declaredSize = Number(request.headers.get("content-length"));
  if (declaredSize > maxBytes) throw new ApiRequestError(413, "PAYLOAD_TOO_LARGE");
  if (!request.body) throw new ApiRequestError(400, "INVALID_REQUEST");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new ApiRequestError(413, "PAYLOAD_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer)) as unknown;
  } catch {
    throw new ApiRequestError(400, "INVALID_REQUEST");
  }
}

export function respondApiError(error: unknown, label: string): NextResponse {
  if (error instanceof ApiRequestError) {
    return NextResponse.json({ error: error.code }, { status: error.status });
  }
  console.error(label, error instanceof Error ? error.name : "Unknown");
  return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
}
