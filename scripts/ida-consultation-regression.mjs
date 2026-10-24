import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3194'],{cwd:process.cwd(),env:{...process.env,SMTP_PASSWORD:''},stdio:'ignore'});
const base='http://127.0.0.1:3194';let n=0;
const body={name:'UAT No Delivery',email:'uat@example.test',organization:'Test Inc',service:'Enterprise IT',summary:'We need a proposal for enterprise workflow improvements.',excerpt:'',website:'',consent:true,consentVersion:'2026-10',idempotencyKey:'uat-consult-20261024'};
async function ready(){for(let i=0;i<70;i++){try{let r=await fetch(base+'/en');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw Error('Server unavailable');}
async function post(data,origin=null){let headers={'Content-Type':'application/json','X-Forwarded-For':`198.51.100.${++n}`};if(origin)headers.Origin=origin;let r=await fetch(base+'/api/consultations',{method:'POST',headers,body:JSON.stringify(data)});return {status:r.status,data:await r.json()};}
try{
 await ready();
 let r=await post({...body,consent:false});assert.equal(r.status,400);assert.equal(r.data.error,'CONSENT_REQUIRED');
 r=await post({...body,consentVersion:'wrong'});assert.equal(r.status,400);
 r=await post({...body,email:'wrong'});assert.equal(r.status,400);assert.equal(r.data.error,'INVALID_EMAIL');
 r=await post({...body,summary:''});assert.equal(r.status,400);
 r=await post({...body,summary:'a'.repeat(3501)});assert.equal(r.status,400);
 r=await post({...body,idempotencyKey:'bad'});assert.equal(r.status,400);
 r=await post({...body,website:'spam'});assert.equal(r.status,200);assert.equal(r.data.ignored,true);
 r=await post(body,'https://malicious.invalid');assert.equal(r.status,403);
 r=await post(body);assert.equal(r.status,503);assert.equal(r.data.error,'NOT_CONFIGURED');
 const form=await fetch(base+'/en');const html=await form.text();assert.equal(form.status,200);assert.ok(html.includes('IDA'));
 console.log('IDA consultation regression PASS: invalid consent, malformed fields, oversized summary, honeypot, origin, no SMTP config, homepage');
} finally {server.kill('SIGTERM');}
