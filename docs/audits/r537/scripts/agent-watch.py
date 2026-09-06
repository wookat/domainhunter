import asyncio,json,time
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.connect_over_cdp("http://localhost:29229")
  f=open("/home/ubuntu/r537/agent-network.jsonl","a",buffering=1)
  def log(kind,**kw): f.write(json.dumps(dict(at=time.time(),kind=kind,**kw),ensure_ascii=False)+"\n")
  async def response(r):
   if "/api/" in r.url or r.request.resource_type=="document":
    log("response",url=r.url,status=r.status)
    if "/api/search" in r.url:
     try: log("search-body",url=r.url,body=await r.text())
     except: pass
  def page_hooks(page):
   page.on("request",lambda r: log("request",url=r.url,method=r.method) if "/api/" in r.url else None)
   page.on("response",response)
   page.on("console",lambda m: log("console",type=m.type,text=m.text,url=page.url))
   page.on("pageerror",lambda e: log("pageerror",text=str(e),url=page.url))
  for c in b.contexts:
   for page in c.pages: page_hooks(page)
   c.on("page",page_hooks)
  print("WATCH READY",flush=True)
  await asyncio.Event().wait()
asyncio.run(main())
