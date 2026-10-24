import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
// Import the small pure client-side intent helper without depending on a browser.
const source=await readFile('lib/ida-consultation-intent.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {consultationIntent,visitorConsultationSummary,serviceFromConversation}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
for(const phrase of ['Iya kirim formnya','Jadwalkan konsultasi','Send the consultation form','Please open the form','预约咨询','Kirim permintaan konsultasi']){
 assert.equal(consultationIntent(phrase),'open-form',`must launch form: ${phrase}`);
}
for(const phrase of ['Coba ringkasannya','Tolong buat ringkasan','Summarize our discussion','总结']){
 assert.equal(consultationIntent(phrase),'show-summary',`must preview summary: ${phrase}`);
}
for(const phrase of ['Bagian payroll','Saya butuh efisiensi finance','Apakah sudah dikirim emailnya?','Bagaimana solusi payroll terbaik?']){
 assert.equal(consultationIntent(phrase),null,`must remain conversational: ${phrase}`);
}
const chat=[{role:'user',content:'Saya butuh efisiensi operational finance untuk perusahaan outsourcing'},{role:'assistant',content:'Bisa saya bantu.'},{role:'user',content:'Bagian payroll'},{role:'user',content:'Iya kirim formnya'}];
const summary=visitorConsultationSummary(chat);
assert.ok(summary.includes('outsourcing') && summary.includes('payroll'));
assert.ok(!summary.includes('kirim formnya'));
assert.equal(serviceFromConversation(summary),'Payroll & HR Operations');
console.log('IDA handoff intent regression PASS: form requests, summary requests, conversation preserved, service prefill');
