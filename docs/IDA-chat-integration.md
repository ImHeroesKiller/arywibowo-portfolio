# IDA Labs Chat Integration — Portfolio

Documentation: https://dash-ida.arywibowo.id/docs

## Backend

The portfolio browser sends messages to its own `POST /api/chat` route. Only the Next.js server calls `POST https://api-ida.arywibowo.id/api/v1/chat/completions`. Authentication is server-side `Authorization: Bearer ${IDA_API_KEY}`. **Never expose the key through `NEXT_PUBLIC_*` or client scripts**.

- Model: `ida-chat-fast` (IDA mini); `max_tokens: 220`; `stream: false`.
- Web search: `ida.web_search: false` for the portfolio to avoid requiring a search scope or incurring web-search credit costs.
- System context: compact published-product matches (up to three) and truncated matching knowledge snippets. Unpublished products are excluded. Recent conversation limited to four turns, 1,800 characters in history; latest user question <=750 characters. Common greetings, thanks, contact keywords, and clearly out-of-scope questions use static local replies without provider calls.
- Validated role and message limits, origin checks, request size limit, per-instance throttling remain active.
- Timeout: request 170 seconds; documented provider-client recommendation >= 180 seconds. Vercel function duration configured at 180 seconds (check plan support).
- Provider 429 -> `RATE_LIMITED`; auth/scope errors -> `NOT_CONFIGURED`; malformed/empty responses -> `AI_UNAVAILABLE`/`EMPTY_RESPONSE`. No provider credentials or error bodies sent to browser.

## Provisioning required

1. In IDA Labs dashboard create an API key with **chat** scope enabled; if the plan is Free, verify required account contact details.
2. Add `IDA_API_KEY` as **encrypted server-side** variable for the `arywibowo-portfolio` Vercel project in both Preview and Production. Do not reuse Ubuntu `platform_engine_token`; it is not an `ida_live_` key.
3. Redeploy Preview; test one real conversation on a safe prompt and check provider credits and model response. Redeploy Production only after live Preview validation succeeds.
4. Optionally revoke obsolete `GEMINI_API_KEY` from the portfolio project **after** confirming no other features still depend on it. No secret is removed automatically in this change.

## Tests

`node scripts/ida-chat-contract.mjs` runs a local mock API and verifies Bearer auth, model, system context, response mapping, scope/rate-limit handling, and no deleted products in prompt, **without using a paid provider key**. `node scripts/batch2-smoke.mjs` checks invalid input, rate limits and missing-key error.

## Release gate

Key was provisioned and live IDA responses were verified during the preceding release. Each later rollout still requires preview CI and production smoke testing.
