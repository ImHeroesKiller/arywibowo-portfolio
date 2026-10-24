export type ConsultationLocale = 'id' | 'en' | 'zh';
export const consultationPrompts: Record<ConsultationLocale, string[]> = {
  id: [
    'Apa kebutuhan atau tantangan utama yang ingin Anda selesaikan?',
    'Bagaimana proses atau sistem yang digunakan saat ini, dan bagian mana yang paling bermasalah?',
    'Hasil seperti apa yang Anda harapkan dari solusi ini?',
    'Kapan Anda ingin mulai, dan adakah batasan atau prioritas penting?',
  ],
  en: [
    'What main challenge or business need would you like to address?',
    'How does your current workflow or system operate, and what causes the biggest problem?',
    'What outcome would make this project successful for you?',
    'When would you like to begin, and are there important constraints or priorities?',
  ],
  zh: [
    '您最希望解决什么业务问题？',
    '目前使用什么流程或系统？最主要的困难是什么？',
    '您期待方案实现什么结果？',
    '您希望何时启动？有什么重要限制或优先事项？',
  ],
};
export function consultationLanguage(message: string, fallback:ConsultationLocale='id'): ConsultationLocale {
  if (/\p{Script=Han}/u.test(message)) return 'zh';
  if (/\b(saya|aku|ingin|mau|butuh|untuk|bisakah|perusahaan|konsultasi|belum|bagian|tolong|kirim|iya)\b/i.test(message)) return 'id';
  if (/\b(i|we|would|want|need|please|our|consultation|business|workflow|can you)\b/i.test(message)) return 'en';
  return fallback;
}
export function isConsultationStart(message: string): boolean {
  const q = message.normalize('NFKC').toLowerCase().trim();
  return /(?:ingin|mau|butuh|perlu|ajukan|mulai|adakan|buat|cari|minta|lanjut|jadwalkan|atur|kirim|kembangkan)[\s\S]{0,90}(?:konsultasi|sesi konsultasi|proposal|rancangan konsultasi)/i.test(q)
    || /(?:consultation|consulting session|consultation request|book a meeting|business consultation|request a proposal)/i.test(q)
    || /(?:咨询|洽谈|预约)/.test(q);
}
export function consultationSummary(answers: string[],lang:ConsultationLocale): string {
  const labels = lang==='id' ? ['Kebutuhan utama','Kondisi saat ini','Hasil yang diharapkan','Waktu dan prioritas'] : lang==='zh' ? ['核心需求','当前情况','预期成果','时间与优先事项'] : ['Business need','Current workflow','Desired outcome','Timeline and priorities'];
  return answers.slice(0,4).map((answer,index)=>`${labels[index]}: ${answer.trim()}`).join('\n').slice(0,3500);
}
