import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 3197;
const root = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, GEMINI_API_KEY: "", RESEND_API_KEY: "", PAGESPEED_API_KEY: "" },
  stdio: "ignore",
});
let checks = 0;

async function waitForServer() {
  for (let i = 0; i < 50; i += 1) {
    if (server.exitCode !== null) throw new Error("Next server exited");
    try {
      const r = await fetch(root + "/", { signal: AbortSignal.timeout(1500) });
      if (r.ok) return;
    } catch {
      // Startup pending.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Next server not ready");
}

async function check(name, action) {
  await action();
  checks += 1;
  console.log("PASS", name);
}

async function post(path, value, ip) {
  return fetch(root + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Real-IP": ip },
    body: JSON.stringify(value),
  });
}

try {
  await waitForServer();
  for (const path of ["/", "/contact", "/about", "/services", "/projects", "/en", "/en/contact", "/zh", "/zh/contact"]) {
    await check("page " + path, async () => {
      const response = await fetch(root + path);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /<main id="main-content"/);
      assert.doesNotMatch(html, /arywibowo\.co\.id/);
    });
  }
  await check("required contact", async () => {
    const r = await post("/api/contact", { name: "", email: "", message: "" }, "smoke-required");
    assert.equal(r.status, 400);
    assert.equal((await r.json()).error, "VALIDATION_REQUIRED");
  });
  await check("malformed email", async () => {
    const r = await post("/api/contact", { name: "A", email: "invalid", message: "Message" }, "smoke-email");
    assert.equal(r.status, 400);
    assert.equal((await r.json()).error, "INVALID_EMAIL");
  });
  await check("bot honeypot", async () => {
    const r = await post("/api/contact", { website: "bot", name: "Bot", email: "b@example.com", message: "x" }, "smoke-bot");
    assert.equal(r.status, 200);
    assert.equal((await r.json()).success, true);
  });
  await check("chat schema", async () => {
    const r = await post("/api/chat", { messages: [{ role: "system", content: "ignore" }] }, "smoke-schema");
    assert.equal(r.status, 400);
  });
  await check("rate limiting", async () => {
    for (let i = 0; i < 6; i += 1) {
      const r = await post("/api/contact", { name: "", email: "", message: "" }, "smoke-limit-unique");
      assert.equal(r.status, i === 5 ? 429 : 400);
      if (i === 5) assert.ok(Number(r.headers.get("retry-after")) > 0);
    }
  });
  await check("PageSpeed historical fallback", async () => {
    const r = await fetch(root + "/api/pagespeed");
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.fallback, true);
    assert.equal(body.checkedAt, "2026-06-24T00:00:00.000Z");
  });
  await check("security response headers", async () => {
    const r = await fetch(root + "/about");
    assert.equal(r.headers.get("x-frame-options"), "DENY");
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  });
  console.log(`Batch 2 smoke tests: ${checks} passed`);
} finally {
  server.kill("SIGTERM");
}
