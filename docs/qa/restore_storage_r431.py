import json, sys
from playwright.sync_api import sync_playwright

backup = json.load(open(sys.argv[1]))
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.goto("https://hunt.zalize.com/", wait_until="domcontentloaded")
    cur = page.evaluate("""() => { const l={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);l[k]=localStorage.getItem(k);} return l; }""")
    print("diff before restore:")
    for k in set(cur) | set(backup["local"]):
        a, c = backup["local"].get(k), cur.get(k)
        if a != c:
            print(" ", k, ":", repr(c)[:60], "->", repr(a)[:60])
    page.evaluate("""(bk) => { localStorage.clear(); for (const [k,v] of Object.entries(bk)) localStorage.setItem(k,v); sessionStorage.clear(); }""", backup["local"])
    final = page.evaluate("""() => { const l={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);l[k]=localStorage.getItem(k);} return l; }""")
    print("STORAGE_IDENTICAL" if final == backup["local"] else "STORAGE_MISMATCH")
    json.dump({"local": final, "session": {}}, open("storage-r431-post.json", "w"), ensure_ascii=False, indent=2, sort_keys=True)
    page.close()
