import fs from "fs";
import path from "path";

export type KnowledgeChunk = {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
};

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");

const QUERY_ALIASES: Record<string, string[]> = {
  perada: ["perdana", "perkasa", "logistik", "freight", "superapps", "portal"],
  solar: ["renewable", "energi", "bespoke", "battery", "ev", "listrik"],
  danawangsa: ["financial", "pembiayaan", "bridging", "restrukturisasi", "keuangan"],
  hr: ["sdm", "rekrutmen", "human", "resources", "outsourcing"],
  it: ["digital", "transformasi", "teknologi", "platform", "software"],
  bisnis: ["business", "development", "ekspansi", "growth", "umkm"],
  proyek: ["portfolio", "studi", "kasus", "project"],
};

let cachedChunks: KnowledgeChunk[] | null = null;

function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function expandQueryTokens(query: string) {
  const tokens = new Set(tokenize(query));
  const queryLower = query.toLowerCase();

  for (const [anchor, aliases] of Object.entries(QUERY_ALIASES)) {
    const anchorHit =
      tokens.has(anchor) ||
      aliases.some((alias) => tokens.has(alias) || queryLower.includes(alias));

    if (anchorHit) {
      tokens.add(anchor);
      aliases.forEach((alias) => tokens.add(alias));
    }
  }

  return Array.from(tokens);
}

function extractKeywordLine(markdown: string) {
  const match = markdown.match(/\*\*Keywords:\*\*\s*(.+)/i);
  return match?.[1]?.split(",").map((keyword) => keyword.trim().toLowerCase()) ?? [];
}

function splitMarkdownSections(
  markdown: string,
  source: string
): KnowledgeChunk[] {
  const fileKeywords = extractKeywordLine(markdown);
  const sections = markdown.split(/(?=^##\s)/m).filter(Boolean);
  const chunks: KnowledgeChunk[] = [];

  sections.forEach((section, index) => {
    const titleMatch =
      section.match(/^#\s+(.+)$/m) ?? section.match(/^##\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? `Section ${index + 1}`;
    const content = section.trim();

    if (content.length < 40) return;

    chunks.push({
      id: `${source}-${index}`,
      source,
      title,
      content,
      keywords: [
        ...fileKeywords,
        ...tokenize(`${title} ${content}`),
        ...tokenize(source.replace(/\.md$/, "").replace(/-/g, " ")),
      ],
    });
  });

  return chunks;
}

function loadMarkdownFile(filename: string): KnowledgeChunk[] {
  const filePath = path.join(KNOWLEDGE_DIR, filename);
  if (!fs.existsSync(filePath)) return [];

  const markdown = fs.readFileSync(filePath, "utf-8");
  return splitMarkdownSections(markdown, filename);
}

function loadAllMarkdownFiles(): KnowledgeChunk[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];

  return fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => loadMarkdownFile(filename));
}

export function loadKnowledgeBase(): KnowledgeChunk[] {
  if (cachedChunks) return cachedChunks;

  cachedChunks = loadAllMarkdownFiles();
  return cachedChunks;
}

function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[], queryLower: string) {
  if (queryTokens.length === 0) return 0;

  const keywordSet = new Set(chunk.keywords);
  const contentLower = chunk.content.toLowerCase();
  const titleLower = chunk.title.toLowerCase();
  const sourceLower = chunk.source.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (keywordSet.has(token)) score += 3;
    if (titleLower.includes(token)) score += 4;
    if (sourceLower.includes(token)) score += 3;
    if (contentLower.includes(token)) score += 1;
  }

  if (queryLower.includes("perada") && sourceLower.includes("perada")) score += 6;
  if (queryLower.includes("bespoke") && sourceLower.includes("bespoke")) score += 6;
  if (queryLower.includes("danawangsa") && sourceLower.includes("danawangsa")) score += 6;
  if (queryLower.includes("solar") && sourceLower.includes("bespoke")) score += 4;
  if (queryLower.includes("financial") && sourceLower.includes("financial")) score += 3;

  return score;
}

export function retrieveRelevantChunks(
  query: string,
  limit = 5
): KnowledgeChunk[] {
  const chunks = loadKnowledgeBase();
  const queryTokens = expandQueryTokens(query);
  const queryLower = query.toLowerCase();

  const ranked = chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, queryTokens, queryLower),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = ranked.slice(0, limit).map((item) => item.chunk);
  if (top.length > 0) return top;

  const fallbackSources = [
    "ary-services.md",
    "about.md",
    "faq.md",
  ];

  return chunks
    .filter((chunk) => fallbackSources.includes(chunk.source))
    .slice(0, 3);
}

export function buildRetrievalContext(query: string) {
  const chunks = retrieveRelevantChunks(query);

  if (chunks.length === 0) {
    return "Tidak ada cuplikan knowledge base yang relevan. Jawab hanya berdasarkan ruang lingkup layanan yang diketahui dan arahkan ke Kontak jika perlu.";
  }

  return chunks
    .map(
      (chunk, index) =>
        `[Sumber ${index + 1}: ${chunk.source} — ${chunk.title}]\n${chunk.content}`
    )
    .join("\n\n");
}