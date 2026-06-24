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

let cachedChunks: KnowledgeChunk[] | null = null;

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function splitMarkdownSections(
  markdown: string,
  source: string
): KnowledgeChunk[] {
  const sections = markdown.split(/(?=^##\s)/m).filter(Boolean);
  const chunks: KnowledgeChunk[] = [];

  sections.forEach((section, index) => {
    const titleMatch = section.match(/^#\s+(.+)$/m) ?? section.match(/^##\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? `Section ${index + 1}`;
    const content = section.trim();

    if (content.length < 40) return;

    chunks.push({
      id: `${source}-${index}`,
      source,
      title,
      content,
      keywords: tokenize(`${title} ${content}`),
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

function loadServicesJson(): KnowledgeChunk[] {
  const filePath = path.join(KNOWLEDGE_DIR, "services.json");
  if (!fs.existsSync(filePath)) return [];

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    services: Array<{
      id: string;
      title: string;
      keywords: string[];
      summary: string;
      features: string[];
    }>;
  };

  return raw.services.map((service) => {
    const content = [
      `Layanan: ${service.title}`,
      service.summary,
      "Fitur:",
      ...service.features.map((feature) => `- ${feature}`),
    ].join("\n");

    return {
      id: `services-${service.id}`,
      source: "services.json",
      title: service.title,
      content,
      keywords: [
        ...service.keywords.map((keyword) => keyword.toLowerCase()),
        ...tokenize(content),
      ],
    };
  });
}

export function loadKnowledgeBase(): KnowledgeChunk[] {
  if (cachedChunks) return cachedChunks;

  const chunks = [
    ...loadMarkdownFile("about.md"),
    ...loadMarkdownFile("faq.md"),
    ...loadServicesJson(),
  ];

  cachedChunks = chunks;
  return chunks;
}

function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[]) {
  if (queryTokens.length === 0) return 0;

  const keywordSet = new Set(chunk.keywords);
  let score = 0;

  for (const token of queryTokens) {
    if (keywordSet.has(token)) score += 2;

    if (chunk.content.toLowerCase().includes(token)) score += 1;
    if (chunk.title.toLowerCase().includes(token)) score += 3;
  }

  return score;
}

export function retrieveRelevantChunks(
  query: string,
  limit = 5
): KnowledgeChunk[] {
  const chunks = loadKnowledgeBase();
  const queryTokens = tokenize(query);

  return chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}

export function buildRetrievalContext(query: string) {
  const chunks = retrieveRelevantChunks(query);

  if (chunks.length === 0) {
    return "Tidak ada cuplikan knowledge base yang relevan. Jawab hanya berdasarkan ruang lingkup layanan yang diketahui.";
  }

  return chunks
    .map(
      (chunk, index) =>
        `[Sumber ${index + 1}: ${chunk.source} — ${chunk.title}]\n${chunk.content}`
    )
    .join("\n\n");
}