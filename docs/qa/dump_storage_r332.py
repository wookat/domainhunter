import json, sys
from playwright.sync_api import sync_playwright

out = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = None
    for pg in ctx.pages:
        if "hunt.zalize.com" in pg.url:
            page = pg
            break
    if page is None:
        page = ctx.new_page()
        page.goto("https://hunt.zalize.com/", wait_until="domcontentloaded")
    data = page.evaluate("""() => {
        const l = {}, s = {};
        for (let i=0;i<localStorage.length;i++){const k=localStorage.key(i);l[k]=localStorage.getItem(k);}
        for (let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i);s[k]=sessionStorage.getItem(k);}
        return {local:l, session:s};
    }""")
    json.dump(data, open(out,"w"), ensure_ascii=False, indent=2, sort_keys=True)
    print("dumped", out, "local keys:", list(data["local"].keys()))
