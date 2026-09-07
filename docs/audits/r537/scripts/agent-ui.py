import sys,json,base64
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.connect_over_cdp("http://localhost:29229")
 page=next(x for x in b.contexts[0].pages if "hunt.zalize.com" in x.url)
 c=page.context.new_cdp_session(page)
 def shot(name):
  page.bring_to_front()
  data=c.send("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})["data"]
  open("/home/ubuntu/r537/agent-shots/"+name+".png","wb").write(base64.b64decode(data))
 def nav(path):
  page.goto("https://hunt.zalize.com"+path)
  page.wait_for_timeout(1000)
 def size(w):
  c.send("Emulation.setDeviceMetricsOverride",{"width":w,"height":900 if w==1280 else 812,"deviceScaleFactor":1,"mobile":False})
 def info():
  print(json.dumps(page.evaluate("""() => ({url:location.href,title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,theme:localStorage['domainhunter:theme'],lang:localStorage['domainhunter:lang'],buttons:[...document.querySelectorAll('button')].filter(x=>x.getBoundingClientRect().height).map(x=>({text:x.innerText,title:x.title,aria:x.getAttribute('aria-label')}))})"""),ensure_ascii=False))
 exec(sys.argv[1])
