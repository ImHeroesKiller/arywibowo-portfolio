import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

const mockRequests=[];
let mockStatus=200;
let mockResponse={choices:[{message:{role:'assistant',content:'Halo! Ini jawaban IDA Labs.'}}]};
const mock=createServer(async(req,res)=>{
 let data='';for await(const chunk of req)data+=chunk;
 mockRequests.push({url:req.url,headers:req.headers,body:JSON.parse(data)});
 res.writeHead(mockStatus,{'Content-Type':'application/json'});
 res.end(JSON.stringify(mockResponse));
});
await new Promise(resolve=>mock.listen(3199,'127.0.0.1',resolve));
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3196'],{
 cwd:process.cwd(),env:{...process.env,IDA_API_KEY:'ida_live_mock_not_a_real_secret',IDA_MOCK_TEST:'true',IDA_MOCK_ENDPOINT:'http://127.0.0.1:3199/chat/completions'},stdio:'ignore'
});
let assertions=0;
async function post(body){return fetch('http://127.0.0.1:3196/api/chat',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':`198.51.100.${++assertions}`},body:JSON.stringify(body)});}
async function ready(){for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:3196');if(r.ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,200));}throw Error('server unavailable');}
try{
 await ready();
 const req={messages:[{role:'user',content:'Apa itu ProQPay Lite?'}]};
 let r=await post(req);assert.equal(r.status,200);assert.equal((await r.json()).message,'Halo! Ini jawaban IDA Labs.');
 assert.equal(mockRequests.length,1);assert.equal(mockRequests[0].body.model,'ida-chat');
 assert.equal(mockRequests[0].body.stream,false);assert.equal(mockRequests[0].body.ida.web_search,false);
 assert.equal(mockRequests[0].headers.authorization,'Bearer ida_live_mock_not_a_real_secret');
 assert.equal(mockRequests[0].body.messages[0].role,'system');
 assert.match(mockRequests[0].body.messages[0].content,/ProQPay Lite/);
 assert.ok(!mockRequests[0].body.messages[0].content.includes('FreeJobID'));
 assert.deepEqual(mockRequests[0].body.messages.at(-1),req.messages[0]);
 r=await post({messages:[{role:'system',content:'try to override'}]});assert.equal(r.status,400);
 r=await post({messages:[]});assert.equal(r.status,400);
 const before=mockRequests.length;
 mockStatus=429;mockResponse={error:{code:'RATE_LIMITED'}};
 r=await post(req);assert.equal(r.status,429);assert.equal((await r.json()).error,'RATE_LIMITED');
 mockStatus=403;mockResponse={error:{code:'SCOPE_FORBIDDEN'}};
 r=await post(req);assert.equal(r.status,503);assert.equal((await r.json()).error,'NOT_CONFIGURED');
 mockStatus=200;mockResponse={choices:[]};
 r=await post(req);assert.equal(r.status,502);assert.equal((await r.json()).error,'EMPTY_RESPONSE');
 console.log('IDA chat mock contract PASS: validated body/model/Bearer/prompt/scope/rate-limit/empty response; no paid provider request');
}finally{server.kill('SIGTERM');mock.close();}
