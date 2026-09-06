import fs from 'node:fs';
import assert from 'node:assert/strict';
const fixed='domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price,price_first_year_cny,price_renew_cny,price_first_year_usd,price_renew_usd,price_source';
// RFC4180-aware state machine, retaining whether each field was quoted.
function parse(text) {
 const rows=[]; let row=[],s='',q=false,quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(q){if(c==='"'){if(text[i+1]==='"'){s+='"';i++;}else q=false;}else s+=c;}
  else if(c==='"'&&!s){q=true;quoted=true;}
  else if(c===','||c==='\n'){row.push({s,quoted});s='';quoted=false;if(c==='\n'){rows.push(row);row=[];}}
  else if(c!=='\r')s+=c;
 }
 assert(!q,'unclosed quoted field');
 if(row.length||s){row.push({s,quoted});rows.push(row);}
 return rows;
}
for(const file of process.argv.slice(2)){
 const rows=parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
 const header=rows.shift().map(x=>x.s).join(',');
 const shortlist=file.includes('shortlist');
 assert.equal(header,fixed+(shortlist?',expires_at,note':',expires_at'));
 assert.equal(rows.length,shortlist?4:28);
 const statuses={},sources={};
 for(const r of rows){
  assert.equal(r.length,header.split(',').length);
  statuses[r[1].s]=(statuses[r[1].s]||0)+1;
  for(let i=10;i<14;i++){assert.match(r[i].s,/^(\d+(\.\d+)?)?$/);assert(!r[i].quoted);}
  if(r[1].s==='available'){
   assert(['porkbun_live','static_reference'].includes(r[14].s));
   assert(r[9].quoted);assert.match(r[9].s,/^首年 /);
   if(r[14].s==='static_reference'){assert.equal(r[12].s,'');assert.equal(r[13].s,'');}
   sources[r[14].s]=(sources[r[14].s]||0)+1;
  }else for(let i=10;i<=14;i++)assert.equal(r[i].s,'');
 }
 console.log(`PASS ${file}\nheader=${header}\nrows=${rows.length} statuses=${JSON.stringify(statuses)} sources=${JSON.stringify(sources)}\n4 numeric price fields: bare decimal or blank, no quotes/currency; taken/unknown 5 fields blank; compatibility label quoted; static USD blank.`);
 for(const status of ['available','taken','unknown']){
  const r=rows.find(r=>r[1].s===status);if(r)console.log(`example ${status}: ${JSON.stringify(r.map(x=>x.s))}`);
 }
}
