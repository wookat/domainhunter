import json, sys, asyncio
from playwright.async_api import async_playwright

ORIGIN = "https://hunt.zalize.com"
BACKUP = "/home/ubuntu/r558/usage/storage_backup.json"

async def main(mode):
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = await ctx.new_page()
        await page.goto(ORIGIN + "/robots.txt", wait_until="domcontentloaded")
        if mode == "backup":
            data = await page.evaluate("() => ({local: {...localStorage}, session: {...sessionStorage}})")
            open(BACKUP, "w").write(json.dumps(data, ensure_ascii=False, sort_keys=True))
            print("backed up", len(data["local"]), "local keys,", len(data["session"]), "session keys")
            print(json.dumps({k: (v[:80] + '...' if len(v) > 80 else v) for k, v in data["local"].items()}, ensure_ascii=False, indent=1))
        elif mode == "restore":
            data = json.load(open(BACKUP))
            await page.evaluate("""(d) => { localStorage.clear(); sessionStorage.clear();
                for (const [k,v] of Object.entries(d.local)) localStorage.setItem(k,v);
                for (const [k,v] of Object.entries(d.session)) sessionStorage.setItem(k,v); }""", data)
            now = await page.evaluate("() => ({local: {...localStorage}, session: {...sessionStorage}})")
            same = json.dumps(now, ensure_ascii=False, sort_keys=True) == json.dumps(data, ensure_ascii=False, sort_keys=True)
            print("restored; byte-identical:", same)
        elif mode == "dump":
            data = await page.evaluate("() => ({local: {...localStorage}, session: {...sessionStorage}})")
            orig = json.load(open(BACKUP))
            print("identical to backup:", json.dumps(data, ensure_ascii=False, sort_keys=True) == json.dumps(orig, ensure_ascii=False, sort_keys=True))
            print(json.dumps({k: (v[:80] + '...' if len(v) > 80 else v) for k, v in data["local"].items()}, ensure_ascii=False, indent=1))
        await page.close()

asyncio.run(main(sys.argv[1]))
