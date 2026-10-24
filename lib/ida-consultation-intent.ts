/**
 * Commands here are explicit interface actions, not model-generated tool calls.
 * Do not infer consent to send email from any chat message.
 */
export type ConsultationIntent = "open-form" | "show-summary" | null;
export function consultationIntent(message: string): ConsultationIntent {
  const q = message.normalize("NFKC").trim().toLocaleLowerCase();
  if (q.length > 145) return null;
  // User explicitly requests a consultation form, sending their inquiry, or a meeting.
  if (/(?:kirim(?:kan)?|buka|tampilkan|isi|minta|kasih|mau|ingin|boleh)\s+(?:saya\s+|aku\s+)?(?:form(?:ulir)?(?:nya)?|form konsultasi)/i.test(q)
      || /(?:jadwalkan|atur jadwal|buat janji|booking|schedule|book|set up)\s+(?:a\s+|an\s+|a time for\s+)?(?:konsultasi|consultation|meeting|call)/i.test(q)
      || /(?:kirim|submit|send|email)\s+(?:permintaan |request |my |the )?(?:konsultasi|consultation|inquiry)/i.test(q)
      || /(?:send|show|open|give me|fill in)\s+(?:me\s+)?(?:the\s+|a\s+)?(?:consultation\s+)?form/i.test(q)
      || /(?:发送|填写|打开)(?:咨询)?表单|预约咨询/.test(q)) return "open-form";
  if (/(?:ringkas(?:an)?nya|buat ringkasan|coba ringkasannya|summary|summarize|summarise|总结|摘要)/i.test(q)) return "show-summary";
  return null;
}

/** Summary contains the visitor's own words only, never fabricated AI promises. */
export function visitorConsultationSummary(messages: Array<{role:string;content:string}>): string {
  return messages.filter(m=>m.role==="user")
    .filter(m=>!consultationIntent(m.content))
    .map(m=>m.content.trim())
    .filter(m=>m.length>6)
    .slice(-5).join("\n").slice(0,3000);
}

export function serviceFromConversation(summary: string): string {
  if (/payroll|gaji|penggajian|slip gaji/i.test(summary)) return "Payroll & HR Operations";
  if (/finance|keuang|accounting|akuntansi/i.test(summary)) return "Finance & Business Operations";
  if (/outsourc|tenaga kerja|workforce/i.test(summary)) return "Workforce & HR Solutions";
  if (/ai|artificial intelligence|kecerdasan buatan/i.test(summary)) return "AI & Digital Transformation";
  return "Business & Technology Consultation";
}
