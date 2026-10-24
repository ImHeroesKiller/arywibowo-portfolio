import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

// Regression suite is self-contained and never sends a live contact email.
const port = 3198;
const base = `http://127.0.0.1:${port}`;
const languages = ['id', 'en', 'zh'];
const products = JSON.parse(await readFile('content/portfolio-id.json','utf8')).products;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
  cwd: process.cwd(),
  env: {...process.env, SMTP_PASSWORD:'', IDA_API_KEY:'', PAGESPEED_API_KEY:''},
  stdio: 'ignore',
});
let tests = 0;
function check(ok, msg){ assert.ok(ok,msg); tests++; }
async function read(path){ const r=await fetch(base+path,{signal:AbortSignal.timeout(8000)});return {r,html:await r.text()}; }
async function ready(){for(let n=0;n<55;n++){if(server.exitCode!==null)throw Error('server exited');try{const {r}=await read('/');if(r.ok)return;}catch{}await new Promise(res=>setTimeout(res,250));}throw Error('server timeout');}
try{
 await ready();
 for(const locale of languages){
  const prefix=locale==='id'?'':`/${locale}`;
  for(const route of ['/', '/about','/services','/projects','/contact']){
   const {r,html}=await read(prefix+(route==='/'?'':route));
   check(r.status===200,`page ${locale} ${route}: HTTP ${r.status}`);
   check(html.includes('rel="canonical"'),`missing canonical ${locale} ${route}`);
   check(html.includes('id="main-content"'),`missing main ${locale} ${route}`);
  }
  for(const product of products){
   const path=`${prefix}/projects/${product.id}`;
   const {r,html}=await read(path);
   check(r.status===200,`${path}: HTTP ${r.status}`);
   check(html.includes('CreativeWork'),`${path}: missing structured data`);
   check(html.includes('rel="canonical"'),`${path}: missing canonical`);
   check(html.includes('application/ld+json'),`${path}: missing JSON-LD`);
  }
 }
 const {r:sitemapRes,html:xml}=await read('/sitemap.xml');
 check(sitemapRes.status===200,'sitemap HTTP');
 check((xml.match(/<loc>/g)||[]).length===products.length+5,'sitemap should contain 29 canonical routes');
 for(const product of products){
  check(xml.includes(`https://arywibowo.id/projects/${product.id}`),`missing sitemap product ${product.id}`);
  check(xml.includes(`https://arywibowo.id/en/projects/${product.id}`),`missing EN alternate ${product.id}`);
  check(xml.includes(`https://arywibowo.id/zh/projects/${product.id}`),`missing ZH alternate ${product.id}`);
 }
 const {r:unknown}=await read('/projects/not-a-product');
 check(unknown.status===404,'invalid case study must 404');
 const removed = ['freejobid','notagen','saleguard','onework'];
 check(products.length===20,'public product catalog has 20 products');
 for(const locale of languages){
  const prefix=locale==='id'?'':`/${locale}`;
  for(const slug of removed){
   const {r}=await read(`${prefix}/projects/${slug}`);
   check(r.status===404,`removed product ${slug} must 404 in ${locale}`);
  }
  const {html:page}=await read(prefix+'/projects');
  for(const forbidden of ['FreeJobID','NotaGen / PERADA Tools','SaleGuard','OneWork','github.com/ImHeroesKiller','AI Playground','Decision AI Dashboard']){
   check(!page.includes(forbidden),`${locale} portfolio should not expose ${forbidden}`);
  }
 }
 for(const resource of ['/manifest.webmanifest','/icon.png','/favicon.ico','/apple-icon.png','/icon-192.png','/icon-512.png','/icon-512-maskable.png']){
  const {r}=await read(resource);
  check(r.status===200,`PWA/fav icon ${resource} unavailable`);
 }
 const {html:manifest}=await read('/manifest.webmanifest');
 check(manifest.includes('Business & Technology Strategist'),'PWA branding is outdated');
 const {r:missingImg}=await read('/images/portfolio/ida-mobile-public.webp');
 check(missingImg.status===200 && missingImg.headers.get('content-type')?.includes('image/webp'),'mobile evidence WebP available');
 const contact=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'QA',email:'wrong',message:'QA only'})});
 check(contact.status===400 && (await contact.json()).error==='INVALID_EMAIL','invalid form cannot send mail');
 const {r:contactPage,html:contactHtml}=await read('/contact');
 check(contactPage.status===200 && contactHtml.includes('<form'),'contact page has form');
 const {r:projectsPage,html:projectsHtml}=await read('/projects');
 check(projectsPage.status===200 && projectsHtml.includes('portfolio-sort'),'sort control rendered');
 check(projectsHtml.includes('Search') || projectsHtml.includes('Cari produk'),'search input rendered');
 console.log(`P4.5 release regression passed: ${tests} assertions; ${products.length*languages.length} case-study routes`);
} finally {server.kill('SIGTERM');}
