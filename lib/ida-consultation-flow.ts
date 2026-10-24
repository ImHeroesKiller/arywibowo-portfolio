export type ConsultationLocale = 'id' | 'en' | 'zh';
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
export function consultationSummary(answers: string[],lang:ConsultationLocale,questions: string[]=[]): string {
  const label=lang==='id'?'Jawaban':lang==='zh'?'回答':'Answer';
  return answers.slice(0,4).map((answer,index)=>`${index+1}. ${questions[index]||`${label} ${index+1}`}\n${answer.trim()}`).join('\n\n').slice(0,3500);
}
