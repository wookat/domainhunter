import json,base64,time
from playwright.sync_api import sync_playwright
root="/home/ubuntu/r537/agent-shots/"
paths=["/tld/de","/tld/ar","/tld/ca","/tld/fr","/guide/saas","/guide/tea","/guide/ecommerce","/guide/indiehacker","/vs/uk-vs-com","/vs/academy-vs-coach","/vs/academy-vs-school","/vs/agency-vs-co","/prices","/why","/mcp","/this-page-does-not-exist-r537","/s/V_-LuRIDhc","/","/advanced","/shortlist","/monitors","/tld","/guide","/vs"]
with sync_playwright() as p:
 b=p.chromium.connect_over_cdp("http://localhost:29229")
 page=next(x for x in b.contexts[0].pages if "hunt.zalize.com" in x.url)
 c=page.context.new_cdp_session(page)
 out=open("/home/ubuntu/r537/agent-matrix.jsonl","a",buffering=1)
 def shot(name):
  data=c.send("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})["data"]
  open(root+name+".png","wb").write(base64.b64decode(data))
 for path in paths:
  for lang in ["zh","en"]:
   r=page.goto("https://hunt.zalize.com"+path+"?lang="+lang+("&mode=exact" if path=="/" else ""),wait_until="networkidle")
   page.wait_for_timeout(400)
   for width in [375,1280]:
    c.send("Emulation.setDeviceMetricsOverride",{"width":width,"height":812 if width==375 else 900,"deviceScaleFactor":1,"mobile":False})
    for theme in ["light","dark"]:
     if page.evaluate("localStorage['domainhunter:theme']")!=theme:
      page.locator('header button[title="切换浅色/暗色"],header button[title="Toggle light/dark"]').click(no_wait_after=True)
     page.evaluate("window.scrollTo(0,0)")
     page.wait_for_timeout(250)
     name="matrix-"+(path.strip("/").replace("/","-") or "home")+"-"+lang+"-"+str(width)+"-"+theme
     shot(name)
     row=page.evaluate("""()=>({title:document.title,h1:document.querySelector('h1')?.innerText,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang,details:document.querySelectorAll('details').length})""")
     row.update(path=path,locale=lang,theme=theme,status=r.status,shot=name+".png")
     if path.count("/")==2 and not path.startswith("/s/"):
      details=page.locator("details").first
      if details.count():
       details.locator("summary").click(no_wait_after=True)
       page.wait_for_timeout(200)
       row["faqOpen"]=details.get_attribute("open") is not None
       row["faqText"]=details.inner_text()[:500]
       shot(name+"-faq")
       details.locator("summary").click(no_wait_after=True)
      row["moreTld"]=page.locator("section").evaluate_all("""es=>es.filter(e=>/更多 TLD|More TLD guides/.test(e.innerText)).map(e=>[...e.querySelectorAll('a')].map(a=>a.innerText))""")
     out.write(json.dumps(row,ensure_ascii=False)+"\n")
     print(path,lang,width,theme,r.status,row["scrollWidth"],flush=True)
