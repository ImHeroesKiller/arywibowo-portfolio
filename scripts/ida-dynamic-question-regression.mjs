import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
let requestCount=0;
let received=[];
let status=200;
const mock=createServer(async(req,res)=>{
 let raw='';for await(const chunk of req)raw+=chunk;
 const body=JSON.parse(raw);received.push(body);requestCount++;
 const response=status===200?{choices:[{message:{content:body.messages[1].content.includes('Question 1:')?'Apa target waktu respons untuk tiket masuk?':'Apa tantangan operasional terbesar di contact center Anda?'}}]}:{error:{code:'UPSTREAM_ERROR'}};
 res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(response));
});
await new Promise(done=>mock.listen(3199,'127.0.0.1',done));
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3195'],{cwd:process.cwd(),env:{...process.env,IDA_API_KEY:'ida_live_test',IDA_MOCK_TEST:'true',IDA_MOCK_ENDPOINT:'http://127.0.0.1:3199/chat/completions'},stdio:'ignore'});
async function ready(){for(let i=0;i<70;i++){try{const r=await fetch('http://127.0.0.1:3195/en');if(r.ok)return;}catch{}await new Promise(done=>setTimeout(done,250));}throw Error('server unavailable');}
let n=0;
async function post(data){const r=await fetch('http://127.0.0.1:3195/api/consultation-question',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':`198.51.100.${++n}`},body:JSON.stringify(data)});return {status:r.status,body:await r.json()};}
try{
 await ready();
 const initial={goal:'I need AI for inbound contact center ticketing',language:'en',answers:[]};
 let r=await post(initial);assert.equal(r.status,200);assert.equal(r.body.step,1);assert.match(r.body.question,/contact center/);
 assert.equal(received.at(-1).model,'ida-chat-fast');assert.equal(received.at(-1).max_tokens,125);
 assert.equal(received.at(-1).ida.web_search,false);
 r=await post({...initial,answers:[{question:r.body.question,answer:'Manual inbound tickets are often delayed'}]});
 assert.equal(r.status,200);assert.equal(r.body.step,2);assert.match(r.body.question,/respons/);
 assert.match(received.at(-1).messages[1].content,/Manual inbound tickets/);
 assert.equal((await post({...initial,answers:[{question:'?',answer:''}]})).status,400);
 assert.equal((await post({...initial,answers:[{question:'A',answer:'B'},{question:'C',answer:'D'},{question:'E',answer:'F'},{question:'G',answer:'H'}]})).status,400);
 status=502;
 r=await post(initial);assert.equal(r.status,503);assert.equal(received.at(-2).model,'ida-chat-fast');assert.equal(received.at(-1).model,'ida-chat');
 console.log('IDA dynamic consultation question regression PASS: contextual LLM, model, 125-token limit, errors and safe fallback');
}finally{app.kill('SIGTERM');mock.close();}
