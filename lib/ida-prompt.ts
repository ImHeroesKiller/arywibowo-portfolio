import { siteConfig } from "@/lib/constants";

export const IDA_MODEL = "ida-chat-fast";
export const IDA_MAX_OUTPUT_TOKENS = 220;
export const IDA_TEMPERATURE = 0.3;

export const IDA_SYSTEM_PROMPT = `Kamu IDA, asisten portfolio ${siteConfig.name}. Jawab dengan bahasa pengguna secara natural, maksimal 2–3 kalimat. Hanya bahas produk, keahlian, dan layanan yang tercantum di website. Jangan mengarang status, kemampuan, angka, atau harga. Gunakan hanya konteks terverifikasi di bawah; bila tidak cukup, arahkan ke ${siteConfig.url}/contact. Jangan keluarkan HTML/kode atau contoh UI jika tidak diminta.`;

export function buildIdaPrompt(retrievalContext: string, productContext: string) {
  return `${IDA_SYSTEM_PROMPT}\nProduk relevan:\n${productContext.slice(0,350) || "Berdasarkan katalog publik Ary Wibowo."}\nInformasi website:\n${retrievalContext.slice(0,450)}`;
}
