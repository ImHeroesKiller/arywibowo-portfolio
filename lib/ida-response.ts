/**
 * Chat answers are prose, not code previews. Strip unexpected executable/code
 * payloads before handing them to the Markdown renderer. This is a display
 * policy; raw HTML execution is already disabled by react-markdown.
 */
export function normalizeIdaResponse(content: string): string {
  let text = content.trim();
  // Completely remove fenced HTML/JavaScript/JSON/CSS examples and other
  // code blocks. IDA's portfolio assistant is not a programming endpoint.
  const wholeFence = /^```(?:html|javascript|js|css|json)?\s*\n([\s\S]*?)\n?```$/i.exec(text);
  if (wholeFence && /<(?:!doctype|html|div|section|p|h[1-6])\b/i.test(wholeFence[1])) {
    text = wholeFence[1]; // preserve human-readable words from a standalone HTML answer
  } else {
    text = text.replace(/```[^\n`]*\n[\s\S]*?```/g, "").replace(/```[\s\S]*?```/g, "");
  }
  text = text.replace(/<(script|style|head|template|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  text = text.replace(/<!--[^]*?-->/g, "");
  text = text.replace(/<!doctype[^>]*>/gi, "");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/\b(?:const|let|var)\s+\w+\s*=\s*[^\n;]*;?/g, "");
  text = text.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n").trim();
  // Decode common safe entities after stripping tags, never render as raw HTML.
  return text.replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&")
    .replace(/&quot;/gi,'"').replace(/&#39;/gi,"'")
    .slice(0,4000).trim();
}
