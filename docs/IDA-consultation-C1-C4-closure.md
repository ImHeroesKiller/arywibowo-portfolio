# IDA C1–C4 — Online Consultation Release Verification

**Date:** 24 October 2026
**App:** arywibowo-portfolio / IDA assistant
**Implementation:** `components/ida-consultation-form.tsx`, `app/api/consultations/route.ts`

## Feature scope

- C1: Consultation intake embedded in IDA; name, email, optional organization, service/topic, editable needs summary. Empty form cannot be submitted.
- C2: Separate review-and-send steps, explicit unchecked consent, opt-in inclusion of **visitor's own** chat messages only; assistant messages and full conversation are not sent. The consent text identifies email sharing and purpose.
- C3: Server-validated, SMTP-based email to configured `CONTACT_TO` using the Contact Us configuration. Receipt of successful SMTP acceptance produces a reference ID; failure never shows a success acknowledgement. Basic IP rate limit, honeypot and size limits; 15-minute per-instance idempotency cache.
- C4: Tests for missing consent, malformed/oversized fields, honeypot, disallowed origins, missing SMTP secret, localized pages, and mobile viewport form.

## QA results

- Build, ESLint, TypeScript, npm audit (moderate): PASS; no new package dependency.
- `scripts/ida-consultation-regression.mjs`: PASS with SMTP disabled; no mail sent by this automated test.
- Existing `scripts/ida-chat-contract.mjs` and `scripts/p45-release-regression.mjs` (395 assertions): PASS.
- Mobile Chrome 390×844: consultation form visible, same viewport dimensions as IDA fullscreen, scrollable fields, review button disabled with required fields missing; desktop chat remains bounded.
- One **synthetic** SMTP UAT via the protected Vercel Preview sent on 2026-10-24. Server accepted and returned reference `IDA-20261024-1C0F7D9D`. Verified inbound receipt in `aku@arywibowo.id` Hostinger Mail inbox (subject contains the exact reference). The email body is clearly marked as synthetic QA and is not a real customer lead.
- Production must be verified after merging to main; preview SMTP acceptance and receipt do not by themselves prove production deployment.

## Privacy and operations

- No chat transcript, contact information, or API secret is persisted to an application database. Visitor-provided information exists in the outbound email, as explicitly reviewed/approved.
- Because the email is sent to an inbox, inbox retention/access controls should follow the business privacy policy; no separate consultation database/retention job exists yet.
- The anti-duplicate map and rate limiter are **per server instance**, not distributed across multiple replicas or cold starts. For production traffic growth, add a shared idempotency/rate-limit store (e.g. Redis or durable database) and additional abuse controls.
- An SMTP `accepted` response confirms handoff to mail infrastructure, not the ultimate delivery into every recipient inbox. The synthetic UAT above separately confirmed actual inbox receipt.
- No automatic email from AI model output; a distinct visitor action is required. Failed SMTP attempts remain unconfirmed and may be retried manually.
