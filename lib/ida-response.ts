/** Normalize unexpected full HTML documents from IDA's chat model to safe readable text. */
export function normalizeIdaResponse(content: string): string {
  const raw = content.trim();
  // Models sometimes prepend an HTML mockup and then provide the actual answer.
  // Prefer the natural-language answer when a fenced HTML example is embedded.
  const proseOnly = raw.replace(/```html\s*[\s\S]*?```/gi, "").trim();
  if (proseOnly && proseOnly !== raw) return proseOnly;
  const html = raw.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
  if (!/^(?:<!doctype\s+html|<html[\s>]|<head[\s>]|<body[\s>])/i.test(html)) return raw;
  // Treat generated HTML as data, not executable markup. Drop hidden/code sections.
  const visible = html
    .replace(/<!--[^]*?-->/g, "")
    .replace(/<(?:head|script|style|template|svg|noscript)\b[^>]*>[^]*?<\/(?:head|script|style|template|svg|noscript)>/gi, "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(?:p|h[1-6]|li|div|section|article|main|blockquote)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/\n[\t ]*\n[\t \n]*/g, "\n\n")
    .trim();
  return visible.length >= 12 ? visible.slice(0, 4000) : "";
}
