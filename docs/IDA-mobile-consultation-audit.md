# IDA — Mobile Chat & Online Consultation Audit

Date: 2026-10-24. Public website: https://arywibowo.id.

## P0 findings and immediate response

1. **Aggressive fallback:** Local regex fast-path answered some named-product questions regardless of prior context and forced unrelated questions into boilerplate refusals; answers also repeatedly redirected to Contact. Restrict deterministic replies to exact greetings, thanks and explicit contact requests. Use IDA mini for nuanced messages, with a truthful outage fallback only when both provider attempts fail.
2. **Unexpected HTML/JavaScript:** The provider can return fenced HTML, JS, CSS or snippets; earlier normalization handled full HTML documents, but some code snippets and Markdown fences remained visible. Normalize at the backend and omit code blocks in public chat rendering. Keep ReactMarkdown's raw HTML execution disabled.
3. **Poor mobile ergonomics:** A small fixed desktop-style popup covered the page while an extra floating close toggle was visible. Mobile should use a single full-height chat surface with safe-area padding, fixed composer, scrollable conversation, one close button and no keyboard auto-focus; desktop retains a compact floating card.
4. **Stale onboarding text:** IDA labels describe consulting services only; update onboarding for products and business needs in ID/EN/ZH.
5. **Incomplete lead handoff:** `/api/contact` already validates input, rate limits and sends email using SMTP; it does not accept a consented structured consultation summary from IDA yet.

## Consultation workflow implementation plan

**Batch C1 — Consultation intent and intake:** IDA should offer an opt-in "Request consultation" action only when a visitor wants professional follow-up. Separate UI state from chat content; collect name, email, organization (optional), service/project of interest, and a brief project description. Never interpret an AI-generated message as submission authorization.

**Batch C2 — Review and consent:** Show a user-editable summary, clear privacy notice, an explicit unchecked consent checkbox and a distinct "Send to Ary" confirmation. Default to **not** including private chat history; offer an optional user-controlled excerpt. Provide a link to the privacy policy when available. Avoid transmitting all chat messages to email without informed consent.

**Batch C3 — Server submission:** Use a dedicated `POST /api/consultations` route (not free-form AI-generated tool calls), which authenticates origin, enforces content-length and per-IP rate limits, validates email and fields, sanitizes content, includes a bot honeypot, and sends through existing Hostinger SMTP credentials. Use a generated reference ID and bounded idempotency window to reduce duplicate sends. Do not log raw PII or tokens. Email to configured `CONTACT_TO`, using `replyTo` visitor email; redact sensitive chat details by default. On SMTP failure, show "not sent", permit manual retry, and never claim success prematurely.

**Batch C4 — Quality, privacy and UAT:** Test ID/EN/ZH forms, keyboard navigation, mobile viewport 360/390/430px, browser back, close/reopen, rate limit, invalid payloads, duplicate submits, SMTP failure and authorized real inbox receipt. Add a retention/deletion policy before optional server-side consultation storage; for an email-only MVP do not store full conversations. Provide a success state only after SMTP accepts the message. Integrate anti-spam checks as traffic warrants.

## Acceptance gates

- Conversational test set includes greetings, product queries, follow-ups, unrelated casual questions, long inputs and provider outage. No misleading boilerplate for unclear queries.
- No HTML, JavaScript, CSS or JSON code blocks displayed in user-facing responses; no script execution.
- One close control; mobile chat does not overflow viewport or hide composer behind safe-area/keyboard; only message list scrolls.
- The future consultation form never emails data without a visitor's explicit review and confirmation.
- Existing Contact Us email workflow remains unchanged until the consultation API is separately implemented and tested.

## Known remaining risks

- `ida-chat-fast` is a provider service and may send degraded responses; fallback to `ida-chat` on 502/503/504 is still enabled and may incur additional credits on successful fallback. The interface should mark an outage when neither succeeds.
- Current rate-limiter is per server instance, not globally distributed.
- Current 750-character input limit can block detailed inquiries; the proposed structured consultation form will permit longer user-reviewed messages.
