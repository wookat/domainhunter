"""Screenshot the recorded hunt.zalize.com tab viewport via CDP. Usage: shot.py <name> [full]
Writes /home/ubuntu/r545/shots/<NN>-<name>.png (NN auto-increment)."""
import os, sys, glob
from playwright.sync_api import sync_playwright

name = sys.argv[1]
full = len(sys.argv) > 2 and sys.argv[2] == "full"
d = "/home/ubuntu/r545/shots"; os.makedirs(d, exist_ok=True)
n = len(glob.glob(d + "/*.png")) + 1
path = f"{d}/{n:02d}-{name}.png"
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = [pg for pg in ctx.pages if "hunt.zalize.com" in pg.url][-1]
    page.screenshot(path=path, full_page=full)
    print(path, page.url)
