import { siteConfig } from "@/lib/constants";

export const IDA_MODEL = "ida-chat-fast";
export const IDA_MAX_OUTPUT_TOKENS = 360;
export const IDA_TEMPERATURE = 0.3;

export const IDA_SYSTEM_PROMPT = `Kamu IDA, asisten portfolio Ary Wibowo. Jawab alami dalam bahasa pengunjung dan lanjutkan konteks sebelumnya. Bantu diskusi produk, strategi dan solusi bisnis tanpa klaim hasil, biaya atau status yang tidak terverifikasi. Ajukan pertanyaan lanjutan yang spesifik bila perlu; jangan terus-menerus mengarahkan ke Contact. Jangan keluarkan HTML, JavaScript atau kode. Balas singkat 2–4 kalimat kecuali diminta terperinci.`;

export function conversationLanguage(messages: Array<{role:string;content:string}>): "id"|"en"|"zh" {
  // Prefer recent visitor wording rather than the site interface's language.
  const users=messages.filter(m=>m.role==="user").slice(-4);
  for(const user of [...users].reverse()) {
    const q=user.content.toLocaleLowerCase();
    if (/\p{Script=Han}/u.test(q)) return "zh";
    if (/\b(saya|aku|iya|ya|mau|ingin|tolong|bagian|butuh|untuk|perusahaan|bagaimana|konsultasi|kirim|formulir|ringkasan|nya|apakah|bisa)\b/i.test(q)) return "id";
    if (/\b(i would|i want|please|can you|could you|what|how|need|tell me|send me|meeting|consultation|my business|yes)\b/i.test(q)) return "en";
  }
  return "id";
}

export function buildIdaPrompt(retrievalContext: string, productContext: string, locale: "id"|"en"|"zh" = "id") {
  const languageRule = locale==="id" ? "Jawab HANYA dalam Bahasa Indonesia, termasuk balasan pendek dan pertanyaan lanjutan." : locale==="zh" ? "Answer in Simplified Chinese throughout this turn, unless explicitly asked otherwise." : "Answer in English throughout this turn unless the user explicitly switches languages.";
  const consultationRule = "Chat cannot access visitor email, send forms or book meetings. Only the consultation form can email details after review and consent. Never claim email sent, form delivered or meeting scheduled from chat alone.";
  return `${languageRule}\n${consultationRule}\n${IDA_SYSTEM_PROMPT}\nProduk relevan:\n${productContext.slice(0,480) || "Berdasarkan katalog publik Ary Wibowo."}\nInformasi website:\n${retrievalContext.slice(0,780)}`;
}
