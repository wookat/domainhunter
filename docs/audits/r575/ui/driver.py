import asyncio,json,pathlib,time,re,traceback
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/home/ubuntu/r575/ui')
UUID=json.loads((ROOT/'webhook_site_token.json').read_text())['uuid']
HOOK='https://webhook.site/'+UUID
def redact(v):
    return re.sub(r'("token"\s*:\s*")[^"]+',r'\1<redacted-share-token>',str(v).replace(UUID,UUID[:8]+'-…'))
def save(name,data):
    (ROOT/name).write_text(redact(json.dumps(data,ensure_ascii=False,indent=2)))
net=[]; responses=[]; blocked=[]
async def main():
    global browser,ctx,page,cdp
    pw=await async_playwright().start()
    browser=await pw.chromium.connect_over_cdp('http://localhost:29229')
    ctx=browser.contexts[0]
    page=ctx.pages[0]
    await page.bring_to_front()
    cdp=await ctx.new_cdp_session(page)
    await cdp.send('Emulation.setDeviceMetricsOverride',dict(width=1280,height=900,deviceScaleFactor=1,mobile=False))
    async def guard(route):
        u=route.request.url
        if '/api/ai-search' in u or ('/api/check' in u and sum('/api/check' in x['url'] and x['method']=='POST' for x in net)>4):
            blocked.append(u);save('blocked.json',blocked)
            await route.abort()
        else: await route.continue_()
    await ctx.route('**/api/ai-search**',guard)
    await ctx.route('**/api/check**',guard)
    def req(r):
        if '/api/' in r.url:
            net.append(dict(time=time.time(),method=r.method,url=r.url,body=redact(r.post_data or '')))
            save('network.json',net)
    async def resp(r):
        if '/api/' not in r.url:return
        item=dict(time=time.time(),url=r.url,status=r.status,headers=await r.all_headers())
        if any(s in r.url for s in ['/api/check','/api/search','/api/monitor','/api/share']):
            try:item['body']=redact(await r.text())
            except Exception as e:item['error']=str(e)
        responses.append(item);save('responses.json',responses)
    ctx.on('request',req);ctx.on('response',lambda r:asyncio.create_task(resp(r)))
    await page.add_init_script("""document.addEventListener('DOMContentLoaded',()=>{
    const s=document.createElement('style');s.textContent='input[type=url]{-webkit-text-security:disc!important}';document.head.appendChild(s);
    });""")
    async def client(reader,writer):
        data=await reader.readline()
        code=json.loads(data)['code']
        try:
            exec('async def cmd():\n'+''.join('    '+l+'\n' for l in code.splitlines()),globals())
            result=await globals()['cmd']()
            out=dict(ok=True,result=result)
        except Exception:out=dict(ok=False,error=traceback.format_exc())
        writer.write((redact(json.dumps(out,ensure_ascii=False,default=str))+'\n').encode())
        await writer.drain();writer.close()
    server=await asyncio.start_server(client,'127.0.0.1',29375)
    print('READY',flush=True)
    async with server:await server.serve_forever()
async def viewport(w,h=900):
    await cdp.send('Emulation.setDeviceMetricsOverride',dict(width=w,height=h,deviceScaleFactor=1,mobile=False))
    await page.wait_for_timeout(400)
async def shot(name,full=False):
    await page.bring_to_front()
    await page.screenshot(path=str(ROOT/'shots'/f'{name}.png'),full_page=full)
    return str(ROOT/'shots'/f'{name}.png')
async def lang(l):
    current=await page.locator('html').get_attribute('lang')
    if not (current or '').startswith(l):
        await page.locator('header button').filter(has_text=re.compile('^(EN|中)$')).click()
        await page.wait_for_timeout(250)
async def theme(light=True):
    islight=await page.locator('html').evaluate("e=>e.classList.contains('light')")
    if islight!=light:
        await page.locator('header button').filter(has=page.locator('svg.lucide-sun,svg.lucide-moon')).click()
        await page.wait_for_timeout(250)
async def geometry():
    return await page.evaluate("""()=>({url:location.href,scrollY,innerWidth,innerHeight,docW:document.documentElement.scrollWidth,clientW:document.documentElement.clientWidth,chipTop:document.querySelector('[data-recheck]')?.getBoundingClientRect().top,quickTop:document.querySelector('[data-quick-check]')?.getBoundingClientRect().top})""")
async def notify_measure(label):
    card=page.locator('section[aria-labelledby="monitor-notify-heading"]')
    await card.scroll_into_view_if_needed()
    data=await card.evaluate("""e=>({badge:e.querySelector('[data-testid=notify-state]').textContent,masked:e.querySelector('[data-testid=notify-masked]')?.textContent,controls:[...e.querySelectorAll('[data-testid=notify-state],input,button')].map(x=>({tag:x.tagName,id:x.id,text:x.innerText,width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height,disabled:x.disabled})),docW:document.documentElement.scrollWidth,innerWidth})""")
    data['prefilledMatches']=await page.locator('#monitor-webhook-input').evaluate('(e,v)=>e.value===v',HOOK) if await page.locator('#monitor-webhook-input').count() else None
    save(label+'.json',data);await shot(label)
    return data
asyncio.run(main())
