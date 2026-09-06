#!/usr/bin/env python3
"""Backup / restore / diff hunt.zalize.com localStorage+sessionStorage in the session Chrome via CDP."""
import json, sys, time
from playwright.sync_api import sync_playwright

ORIGIN = "https://hunt.zalize.com"
mode = sys.argv[1]
path = sys.argv[2] if len(sys.argv) > 2 else "/home/ubuntu/r537/storage_backup.json"

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.goto(ORIGIN + "/shortlist?r537=storage", wait_until="domcontentloaded")
    time.sleep(1)
    if mode == "backup":
        data = page.evaluate("""() => ({
          local: Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])),
          session: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, sessionStorage.getItem(k)])),
          at: new Date().toISOString(), href: location.href })""")
        json.dump(data, open(path, "w"), ensure_ascii=False, indent=2)
        print("backup", path, "local keys:", sorted(data["local"].keys()), "session keys:", sorted(data["session"].keys()))
    elif mode == "restore":
        data = json.load(open(path))
        page.evaluate("""(d) => { localStorage.clear(); sessionStorage.clear();
          for (const [k,v] of Object.entries(d.local)) localStorage.setItem(k, v);
          for (const [k,v] of Object.entries(d.session)) sessionStorage.setItem(k, v); }""", data)
        print("restored", len(data["local"]), "local,", len(data["session"]), "session keys")
    elif mode == "diff":
        data = json.load(open(path))
        now = page.evaluate("""() => ({
          local: Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])),
          session: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, sessionStorage.getItem(k)])) })""")
        same = now["local"] == data["local"] and now["session"] == data["session"]
        print("IDENTICAL" if same else "DIFFERENT")
        for scope in ("local", "session"):
            for k in set(now[scope]) | set(data[scope]):
                if now[scope].get(k) != data[scope].get(k):
                    print(f"  {scope}:{k}: backup={data[scope].get(k)!r} now={now[scope].get(k)!r}")
    page.close()
