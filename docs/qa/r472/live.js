// Usage: node live.js <lang zh|en> <width 375|1440> <theme dark|light> <kind1,kind2,...|success>  — holds CDP connection open, intercepts /api/ai-search
const { chromium } = require("playwright");
const { fixture } = require("./fixture");
const [lang = "zh", widthS = "375", theme = "dark", kindsS = "rate-limit,rate-limit"] = process.argv.slice(2);
const width = Number(widthS);
const kinds = kindsS.split(",");
const ndjson = (ev) => ev.map((e) => JSON.stringify(e)).join("\n") + "\n";
(async () => {
  const browser = await chromium.connectOverCDP("http://localhost:29229");
  const ctx = browser.contexts()[0];
  let calls = 0;
  await ctx.route("**/api/ai-search", async (route) => {
    calls++;
    const kind = kinds[Math.min(calls - 1, kinds.length - 1)];
    const body = JSON.parse(route.request().postData() || "{}");
    console.log(`[${new Date().toISOString()}] INTERCEPTED /api/ai-search #${calls} kind=${kind} more=${body.more} excl=${(body.excludeLabels||[]).length}`);
    if (kind === "abort") return route.abort("failed");
    const events = kind === "success"
      ? [{ type: "round", round: 2, availableCount: 8, target: 10 }, { type: "done", availableCount: 8, target: 10, reachedTarget: false }]
      : [{ type: "round", round: 1, availableCount: 0, target: 10 }, { type: "error", round: 1, errorKind: kind, detail: kind === "quota" ? "llm-http-429" : "llm-http-429", guard: null }];
    await route.fulfill({ status: 200, headers: { "content-type": "application/x-ndjson" }, body: ndjson(events) });
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.bringToFront();
  const cdp = await ctx.newCDPSession(page);
  if (width < 768) await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: 667, deviceScaleFactor: 1, mobile: true });
  else await cdp.send("Emulation.clearDeviceMetricsOverride");
  await page.goto("http://localhost:8787/robots.txt");
  await page.evaluate(({ fx, lang, theme }) => {
    sessionStorage.clear();
    sessionStorage.setItem("dh:lastSearch:v1", JSON.stringify(fx));
    localStorage.setItem("domainhunter:lang", lang);
    localStorage.setItem("domainhunter:theme", theme);
    localStorage.setItem("dh:onboardDismissed:v1", "1");
  }, { fx: fixture(lang), lang, theme });
  await page.goto("http://localhost:8787/", { waitUntil: "networkidle" });
  console.log(`READY lang=${lang} width=${width} theme=${theme} kinds=${kinds.join(",")}`);
  // stay alive until killed
  process.stdin.resume();
})();
