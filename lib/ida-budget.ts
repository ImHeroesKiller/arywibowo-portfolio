import catalog from "@/content/portfolio-id.json";
import catalogEn from "@/content/portfolio-en.json";
import catalogZh from "@/content/portfolio-zh.json";

export const MAX_HISTORY_TURNS = 6;
export const MAX_INPUT_CHARS = 750;
const MAX_CONTEXT_CHARS = 900;
const MAX_HISTORY_CHARS = 3000;

export type ChatTurn = { role: "user" | "assistant"; content: string };

// Keep recent conversation context, bound the total prompt size; the last question is mandatory.
export function trimChatHistory(turns: ChatTurn[]): ChatTurn[] {
  const last = turns.at(-1);
  if (!last) return [];
  const selected: ChatTurn[] = [{role:"user",content:last.content.slice(0,MAX_INPUT_CHARS)}];
  let length = selected[0].content.length;
  for (let index = turns.length - 2; index >= 0 && selected.length < MAX_HISTORY_TURNS; index--) {
    const turn = turns[index];
    const available = MAX_HISTORY_CHARS - length;
    if (available <= 80) break;
    const content = turn.content.slice(-Math.min(available,MAX_INPUT_CHARS));
    selected.unshift({role:turn.role,content});
    length += content.length;
  }
  return selected;
}

export function relevantProducts(query: string) {
  const q = query.toLocaleLowerCase().normalize("NFKC");
  const matches = catalog.products.filter(p => {
    const name = p.name.toLocaleLowerCase();
    return q.includes(name) || name.split(/\s+/).some(part => part.length >= 4 && q.includes(part));
  });
  return matches.slice(0,3).map(p => `${p.name} [${p.status}]: ${p.description.slice(0,150)}`).join("\n").slice(0,MAX_CONTEXT_CHARS);
}

const replies = {
  id: { hello:"Halo! Saya IDA. Saya bisa membantu menjelaskan produk dan layanan di portfolio Ary Wibowo. Apa yang ingin Anda ketahui?", thanks:"Sama-sama! Jika ingin tahu tentang produk atau layanan di website ini, silakan tanya IDA.", outside:"IDA di sini khusus membantu informasi tentang portfolio, produk, dan layanan Ary Wibowo. Untuk pertanyaan umum di luar topik itu, silakan gunakan asisten AI umum.", contact:"Untuk menghubungi Ary Wibowo atau mendiskusikan kerja sama, silakan buka halaman Kontak: https://arywibowo.id/contact", empty:"Saya belum mempunyai informasi terverifikasi tentang itu. Silakan lihat katalog produk atau halaman Kontak di website ini."},
  en: { hello:"Hi! I'm IDA, here to help you explore Ary Wibowo's products and services. What would you like to know?", thanks:"You're welcome! Feel free to ask about the products or services on this website.", outside:"This IDA assistant focuses on Ary Wibowo's portfolio, products, and services. Please use a general AI assistant for unrelated questions.", contact:"For inquiries or collaboration, please visit https://arywibowo.id/contact", empty:"I don't have verified details about that. Please explore the product catalog or contact page."},
  zh: { hello:"您好！我是 IDA，可以介绍 Ary Wibowo 的产品和服务。您想了解什么？", thanks:"不客气！欢迎随时询问本网站的产品和服务。", outside:"这里的 IDA 主要回答 Ary Wibowo 的作品集、产品和服务问题。其他一般问题请使用通用 AI 助手。", contact:"如需联系或洽谈合作，请访问 https://arywibowo.id/contact", empty:"目前没有可验证的相关信息。请查看产品目录或联系页面。"},
};
function language(q:string): keyof typeof replies {
  if (/\p{Script=Han}/u.test(q)) return "zh";
  if (/\b(hello|hi|hey|thanks|thank you|weather|recipe|football|stock market)\b/i.test(q)) return "en";
  return "id";
}

export function localFallback(question: string): string | null {
  const q = question.trim().normalize("NFKC");
  const normalized=q.toLocaleLowerCase().replace(/[!?.。！？\s]+/g," ").trim();
  const t=replies[language(q)];
  if (/^(hai|halo|hi|hello|hey|pagi|siang|sore|malam|selamat pagi|selamat siang|你好|您好)$/.test(normalized)) return t.hello;
  if (/^(makasih|terima kasih|thanks|thank you|谢谢|多谢)$/.test(normalized)) return t.thanks;
  if (/^(kontak|hubungi|contact|email|alamat kontak|联系|联系方式)$/.test(normalized)) return t.contact;
  // Let IDA handle nuanced/off-topic questions naturally; no blanket canned refusal.
  return null;
}

/** Honest, no-credit response when both provider models are temporarily unavailable. */
export function outageFallback(question: string): string {
  const t = language(question);
  if (t === "en") return "IDA's AI service is temporarily unavailable. You can still explore verified product information at https://arywibowo.id/en/projects or visit Contact.";
  if (t === "zh") return "IDA AI 服务暂时不可用。您仍可访问 https://arywibowo.id/zh/projects 查看已核实的产品资料。";
  return "Layanan AI IDA sedang mengalami gangguan. Anda tetap bisa melihat informasi produk yang terverifikasi di https://arywibowo.id/projects atau melalui halaman Kontak.";
}
