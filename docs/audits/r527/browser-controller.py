import asyncio, json, sys, traceback, base64, datetime
from pathlib import Path
from playwright.async_api import async_playwright

OUT=Path('/home/ubuntu/repos/domainhunter/docs/audits/r527')
SHOTS=OUT.parent/'screenshots-r527'
events=[]; requests=[]; visits=[]; current='setup'
def save(name, data):
    (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2))
def hook(p):
    p.on('request',lambda r: requests.append(dict(page=current,url=r.url,method=r.method,resource=r.resource_type)))
    p.on('console',lambda m: events.append(dict(page=current,type=m.type,text=m.text,url=p.url)) if m.type in ['warning','error'] else None)
    p.on('pageerror',lambda e: events.append(dict(page=current,type='pageerror',text=str(e),url=p.url)))
    p.on('requestfailed',lambda r: events.append(dict(page=current,type='requestfailed',text=r.failure,url=r.url)))
async def dump():
    return await page.evaluate("() => ({localStorage:Object.fromEntries(Object.entries(localStorage)),sessionStorage:Object.fromEntries(Object.entries(sessionStorage))})")
async def shot(name):
    await page.bring_to_front()
    data=await cdp.send('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})
    path=SHOTS/(name+'.png'); path.write_bytes(base64.b64decode(data['data']))
    return str(path)
async def viewport(width):
    await cdp.send('Emulation.setDeviceMetricsOverride',dict(width=width,height=900,deviceScaleFactor=1,mobile=False))
async def go(path,lang='zh'):
    global current
    current=path+' '+lang
    url='https://hunt.zalize.com'+path+('&' if '?' in path else '?')+'lang='+lang
    response=await page.goto(url,wait_until='load')
    await page.wait_for_timeout(900)
    await page.add_style_tag(content='::-webkit-scrollbar{display:none}')
    visits.append(dict(url=url,status=response.status))
    return response
async def main():
    global pw,browser,ctx,page,cdp,backup
    pw=await async_playwright().start()
    browser=await pw.chromium.connect_over_cdp('http://localhost:29229')
    ctx=browser.contexts[0]
    await ctx.route('**/api/ai-search*',lambda r:r.abort())
    ctx.on('page',hook)
    for p in ctx.pages: hook(p)
    candidates=[p for p in ctx.pages if p.url.startswith('https://hunt.zalize.com')]
    if candidates:
        page=candidates[0]; note='Existing origin tab, dumped before navigation.'
    else:
        page=await ctx.new_page()
        await page.goto('about:blank')
        await page.goto('https://hunt.zalize.com/why',wait_until='load')
        note='No origin tab existed: about:blank → /why; dumped immediately on load before interaction.'
    backup=await dump()
    save('storage-backup.json',backup)
    save('storage-backup-metadata.json',dict(note=note,url=page.url,utc=datetime.datetime.now(datetime.timezone.utc).isoformat()))
    cdp=await ctx.new_cdp_session(page)
    await page.bring_to_front()
    print('READY storage backup saved',flush=True)
    while True:
        line=await asyncio.to_thread(sys.stdin.readline)
        if not line: break
        try:
            code=json.loads(line)['code']
            exec('async def command():\n'+''.join('    '+s+'\n' for s in code.splitlines()),globals())
            result=await globals()['command']()
            print('RESULT '+json.dumps(result,ensure_ascii=False,default=str),flush=True)
        except Exception:
            print(traceback.format_exc(),flush=True)
        save('browser-events-raw.json',events)
        save('browser-requests.json',requests)
        save('browser-visits.json',visits)
        save('ai-search-request-count.json',dict(count=len([r for r in requests if '/api/ai-search' in r['url']]),requests=[r for r in requests if '/api/ai-search' in r['url']],guard='context.route abort + page.on request on every page'))
asyncio.run(main())
