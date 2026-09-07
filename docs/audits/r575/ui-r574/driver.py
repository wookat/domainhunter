import asyncio,json,pathlib,time,re,traceback,base64,datetime
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/home/ubuntu/r575/ui-r574')
def utc():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save(name,data):(ROOT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2))
net=[];responses=[];blocked=[]
async def main():
    global browser,ctx,page,cdp
    pw=await async_playwright().start()
    browser=await pw.chromium.connect_over_cdp('http://localhost:29229')
    ctx=browser.contexts[0];page=ctx.pages[0]
    await page.bring_to_front();cdp=await ctx.new_cdp_session(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled',{'cacheDisabled':True})
    await viewport(1280)
    async def guard(route):
        r=route.request;u=r.url
        deny=any(x in u for x in ['/api/ai-search','/api/check','/api/monitor/webhook-test','/api/share','/api/monitor/add','/api/monitor/toggle'])
        if '/api/search' in u and sum('/api/search' in x['url'] and x['method']=='POST' for x in net)>4:deny=True
        if deny:
            blocked.append({'utc':utc(),'url':u});save('blocked.json',blocked);await route.abort()
        else:await route.continue_()
    await ctx.route('**/api/**',guard)
    def req(r):
        if '/api/' in r.url:
            net.append(dict(utc=utc(),time=time.time(),method=r.method,url=r.url,body=r.post_data or ''));save('network.json',net)
    async def resp(r):
        if '/api/' not in r.url:return
        item=dict(utc=utc(),url=r.url,status=r.status,headers=await r.all_headers())
        if '/api/search' in r.url or '/api/monitor/' in r.url:
            try:item['body']=await r.text()
            except Exception as e:item['error']=str(e)
        responses.append(item);save('responses.json',responses)
    ctx.on('request',req);ctx.on('response',lambda r:asyncio.create_task(resp(r)))
    async def client(reader,writer):
        code=json.loads(await reader.readline())['code']
        try:
            exec('async def cmd():\n'+''.join('    '+l+'\n' for l in code.splitlines()),globals())
            out={'ok':True,'result':await globals()['cmd']()}
        except Exception:out={'ok':False,'error':traceback.format_exc()}
        writer.write((json.dumps(out,ensure_ascii=False,default=str)+'\n').encode());await writer.drain();writer.close()
    server=await asyncio.start_server(client,'127.0.0.1',29376)
    print('READY',flush=True)
    async with server:await server.serve_forever()
async def viewport(w,h=None):
    await cdp.send('Emulation.setDeviceMetricsOverride',dict(width=w,height=h or (812 if w==375 else 900),deviceScaleFactor=1,mobile=w==375))
    await page.wait_for_timeout(200)
async def shot(name):
    await page.bring_to_front()
    data=await cdp.send('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})
    p=ROOT/'shots'/f'{name}.png';p.write_bytes(base64.b64decode(data['data']));return str(p)
async def lang(l):
    if not (await page.locator('html').get_attribute('lang') or '').startswith(l):
        await page.locator('header button').filter(has_text=re.compile('^(EN|中)$')).click();await page.wait_for_timeout(200)
async def theme(light=True):
    if (await page.locator('html').evaluate("e=>e.classList.contains('light')"))!=light:
        await page.locator('header button[title]').last.click();await page.wait_for_timeout(200)
async def measure_rows(label):
    data=await page.evaluate("""()=>({utc:new Date().toISOString(),url:location.href,lang:document.documentElement.lang,innerWidth,docW:document.documentElement.scrollWidth,rows:[...document.querySelectorAll('[data-recheck]')].map(b=>{
      let r=b.parentElement,s=b.querySelector('span');let x=r.querySelector('[data-expiry=unknown]');
      return {domain:b.dataset.recheck,rowText:r.innerText,reason:r.dataset.unknownReason||r.closest('[data-unknown-reason]')?.dataset.unknownReason,rect:b.getBoundingClientRect().toJSON(),aria:b.getAttribute('aria-label'),title:b.title,icon:!!b.querySelector('svg'),label:s?{text:s.textContent,class:s.className,display:getComputedStyle(s).display,rect:s.getBoundingClientRect().toJSON()}:null,expiry:x?{text:x.textContent,title:x.title,display:getComputedStyle(x).display,rect:x.getBoundingClientRect().toJSON()}:null};
    })})""")
    save(label+'.json',data);return data
async def notify(label):
    card=page.locator('section[aria-labelledby="monitor-notify-heading"]')
    await card.scroll_into_view_if_needed()
    d=await card.evaluate("""e=>({utc:new Date().toISOString(),url:location.href,lang:document.documentElement.lang,innerWidth,docW:document.documentElement.scrollWidth,badge:e.querySelector('[data-testid=notify-state]').textContent,controls:[...e.querySelectorAll('input,button')].map(x=>({tag:x.tagName,text:x.innerText,id:x.id,rect:x.getBoundingClientRect().toJSON(),computedHeight:getComputedStyle(x).height})),masked:e.querySelector('[data-testid=notify-masked]')?.textContent})""")
    save(label+'.json',d);await shot(label);return d
async def observer():
    await page.evaluate("""()=>{
      window.auditObserver?.disconnect();window.auditStop=false;window.auditFrames=[];window.auditMutations=[];let prior='';
      const sample=kind=>{let c=document.querySelector('[data-testid=bulk-progress]');if(!c)return;
      let s=c.querySelector('[role=status]'),p=c.querySelector('[role=progressbar]');let d={utc:new Date().toISOString(),ms:performance.now(),kind,lang:document.documentElement.lang,width:innerWidth,text:s?.textContent,now:p?.getAttribute('aria-valuenow'),spinner:!!s?.querySelector('.animate-spin')};
      let key=JSON.stringify([d.text,d.now,d.spinner,d.lang,d.width]);if(kind==='mutation'||key!==prior){window.auditFrames.push(d);prior=key;}};
      window.auditObserver=new MutationObserver(ms=>{let relevant=ms.filter(m=>m.target.closest?.('[data-testid=bulk-progress]')||m.target.parentElement?.closest('[data-testid=bulk-progress]')||[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-testid=bulk-progress]')||n.querySelector?.('[data-testid=bulk-progress]'))));if(relevant.length){window.auditMutations.push({utc:new Date().toISOString(),ms:performance.now(),changes:relevant.map(m=>({type:m.type,attribute:m.attributeName,old:m.oldValue,text:m.target.textContent?.slice(0,300)}))});sample('mutation');}});
      window.auditObserver.observe(document.querySelector('main'),{subtree:true,childList:true,characterData:true,characterDataOldValue:true,attributes:true,attributeFilter:['aria-valuenow'],attributeOldValue:true});
      function frame(){if(window.auditStop)return;sample('raf');requestAnimationFrame(frame)}requestAnimationFrame(frame);
    }""")
asyncio.run(main())
