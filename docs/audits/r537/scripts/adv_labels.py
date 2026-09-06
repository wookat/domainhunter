import json
from playwright.sync_api import sync_playwright
out={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome",args=["--no-sandbox"])
    for route in ["/advanced?lang=en","/shortlist?lang=en","/?lang=en"]:
        pg=b.new_page(); pg.goto("https://hunt.zalize.com"+route,wait_until="networkidle"); pg.wait_for_timeout(1200)
        out[route]=pg.evaluate("""()=>[...document.querySelectorAll('input,textarea,select')].map(e=>{
          const par=e.parentElement; const gp=par&&par.parentElement;
          const prevText=(gp?gp.innerText:par.innerText).split('\\n').slice(0,3).join(' / ').slice(0,120);
          return {tag:e.tagName.toLowerCase(),type:e.type,id:e.id,name:e.name,aria:e.getAttribute('aria-label'),labelledby:e.getAttribute('aria-labelledby'),title:e.title,placeholder:(e.placeholder||'').slice(0,50),wrappedInLabel:!!e.closest('label'),parentTag:par.tagName.toLowerCase(),context:prevText}})""")
        pg.close()
    b.close()
json.dump(out,open("browser/form-controls-detail.json","w"),ensure_ascii=False,indent=1)
for r,v in out.items():
    print("==",r)
    for c in v: print(" ",c['tag'],c['type'],'id=%r name=%r aria=%r title=%r wrapLabel=%s parent=%s | %s'%(c['id'],c['name'],c['aria'],c['title'],c['wrappedInLabel'],c['parentTag'],c['context']))
