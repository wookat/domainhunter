// 用法：node errors.js [port]
// 错误态证据：拦截 /api/ai-search 返回构造的 NDJSON error 事件（errorKind=rate-limit / quota），0 次真实 AI 调用。
// 覆盖：rate-limit 30s 倒计时 + 取消 + 自动重试一次 + 第二次仍限流退回手动；quota 无重试 + 双入口 + 结果不清空；
// 移动端摘要行 aria-expanded / 44px 触点 / 展开态截图。
const { chromium } = require("playwright");
const { fixture } = require("./fixture");
const fs = require("fs");

const port = process.argv[2] || "8787";
const out = process.env.OUT || `${__dirname}/shots`;
fs.mkdirSync(out, { recursive: true });

const T = {
  zh: { more: "再来一轮", confirm: "再点一次确认", cancel: "取消自动重试", retry: "重试本轮", quick: "精确核验", bulk: "批量核验", auto: /(\d+) 秒后自动重试一次/, again: "仍被限流", quota: "AI 配额已用尽" },
  en: { more: "One more round", confirm: "Click again to confirm", cancel: "Cancel auto-retry", retry: "Retry round", quick: "Exact check", bulk: "Bulk check", auto: /automatically in (\d+)s/, again: "still rate-limited", quota: "AI quota is exhausted" },
};

function ndjson(events) {
  return events.map((e) => JSON.stringify(e)).join("\n") + "\n";
}

async function open(browser, { width, height, lang, kinds, clock }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  const calls = [];
  await ctx.route("**/api/ai-search", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    calls.push({ more: body.more, excludeLabels: (body.excludeLabels || []).length });
    const kind = kinds[Math.min(calls.length - 1, kinds.length - 1)];
    await route.fulfill({
      status: 200,
      headers: { "content-type": "application/x-ndjson" },
      body: ndjson([
        { type: "round", round: 1, availableCount: 0, target: 10 },
        { type: "error", round: 1, errorKind: kind, detail: kind === "quota" ? "llm-http-401" : "llm-http-429", guard: null },
      ]),
    });
  });
  const page = await ctx.newPage();
  if (clock) await page.clock.install();
  await page.addInitScript(
    ({ fx, lang }) => {
      sessionStorage.setItem("dh:lastSearch:v1", JSON.stringify(fx));
      localStorage.setItem("domainhunter:lang", lang);
      localStorage.setItem("domainhunter:theme", "dark");
      localStorage.setItem("dh:onboardDismissed:v1", "1");
    },
    { fx: fixture(lang), lang },
  );
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("h2:has-text('Top Picks')");
  return { ctx, page, calls };
}

// 底部 sticky 栏「再来一轮」：R465 恢复态两步确认 → 点两次才真正发起
async function fireMore(page, lang) {
  const bar = page.locator(".fixed.inset-x-0.bottom-0");
  const btn = bar.getByRole("button", { name: new RegExp(T[lang].more) });
  await btn.click();
  const confirm = bar.getByRole("button", { name: new RegExp(T[lang].confirm) });
  await confirm.waitFor();
  await confirm.click();
}

const results = {};
const check = (name, cond, detail) => {
  results[name] = { pass: Boolean(cond), detail };
  console.log(cond ? "PASS" : "FAIL", name, detail ?? "");
};

(async () => {
  const browser = await chromium.launch();

  // ---- rate-limit：倒计时 + 自动重试一次 + 第二次仍限流退回手动（用虚拟时钟推进 30s） ----
  for (const lang of ["zh", "en"]) {
    for (const vp of [{ width: 375, height: 667, name: "375" }, { width: 1440, height: 900, name: "desktop" }]) {
      const { ctx, page, calls } = await open(browser, { ...vp, lang, kinds: ["rate-limit", "rate-limit"], clock: true });
      await fireMore(page, lang);
      const banner = page.locator("p.text-destructive");
      await banner.waitFor();
      await page.clock.runFor(1200); // 等 run() 的 finally 收尾，回到 results 视图
      const t0 = await banner.innerText();
      const m0 = T[lang].auto.exec(t0);
      check(`${lang}-${vp.name} rate-limit shows 30s countdown`, m0 && Number(m0[1]) >= 28, t0);
      check(`${lang}-${vp.name} cancel button present`, await page.getByRole("button", { name: T[lang].cancel }).count() === 1);
      check(`${lang}-${vp.name} manual retry hidden during countdown`, await page.getByRole("button", { name: T[lang].retry }).count() === 0);
      const live = page.locator('[aria-live="polite"].sr-only');
      const live0 = await live.innerText();
      await page.clock.runFor(5000);
      const live5 = await live.innerText();
      const vis5 = await banner.locator("[aria-hidden]").innerText();
      await page.clock.runFor(6000);
      const live11 = await live.innerText();
      check(`${lang}-${vp.name} aria-live unchanged within 10s`, live0 === live5 && /30/.test(live0), `${live0} | ${live5} | visible@5s: ${vis5}`);
      check(`${lang}-${vp.name} aria-live steps to 20 after 10s`, live11 !== live0 && /20/.test(live11), live11);
      if (vp.name === "375" || lang === "zh") await page.screenshot({ path: `${out}/ratelimit-countdown-${vp.name}-${lang}.png` });
      check(`${lang}-${vp.name} no auto retry before 30s`, calls.length === 1, `calls=${calls.length}`);
      await page.clock.runFor(21000);
      await page.waitForFunction((txt) => document.body.innerText.includes(txt), T[lang].again, { timeout: 5000 }).catch(() => {});
      await page.clock.runFor(1500);
      check(`${lang}-${vp.name} auto retry fired exactly once at 30s`, calls.length === 2, `calls=${calls.length}`);
      const t2 = await banner.innerText();
      check(`${lang}-${vp.name} second rate-limit falls back to manual retry`, t2.includes(T[lang].again) && (await page.getByRole("button", { name: T[lang].retry }).count()) === 1 && (await page.getByRole("button", { name: T[lang].cancel }).count()) === 0, t2);
      await page.clock.runFor(40000);
      check(`${lang}-${vp.name} no further auto retry`, calls.length === 2, `calls=${calls.length}`);
      check(`${lang}-${vp.name} results kept after error`, (await page.locator("h2:has-text('Top Picks')").count()) === 1);
      if (vp.name === "375") await page.screenshot({ path: `${out}/ratelimit-manual-${vp.name}-${lang}.png` });
      await ctx.close();
    }
  }

  // ---- rate-limit：取消自动重试 ----
  {
    const { ctx, page, calls } = await open(browser, { width: 375, height: 667, lang: "zh", kinds: ["rate-limit"], clock: true });
    await fireMore(page, "zh");
    await page.getByRole("button", { name: T.zh.cancel }).click();
    await page.clock.runFor(1200);
    check("zh-375 cancel → manual retry button", (await page.getByRole("button", { name: T.zh.retry }).count()) === 1 && (await page.getByRole("button", { name: T.zh.cancel }).count()) === 0);
    await page.clock.runFor(40000);
    check("zh-375 cancel → no auto retry", calls.length === 1, `calls=${calls.length}`);
    await ctx.close();
  }

  // ---- quota：无重试、双入口、结果不清空 ----
  for (const lang of ["zh", "en"]) {
    const { ctx, page, calls } = await open(browser, { width: 375, height: 667, lang, kinds: ["quota"] });
    await fireMore(page, lang);
    const banner = page.locator("p.text-destructive");
    await banner.waitFor();
    await page.waitForTimeout(800);
    const txt = await banner.innerText();
    check(`${lang}-375 quota wording`, txt.includes(T[lang].quota), txt);
    check(`${lang}-375 quota no retry button`, (await page.getByRole("button", { name: T[lang].retry }).count()) === 0 && (await page.getByRole("button", { name: T[lang].cancel }).count()) === 0);
    const quick = page.locator(`a[href="/?mode=exact"]:has-text("${T[lang].quick}")`);
    const bulk = page.locator(`a[href="/advanced"]:has-text("${T[lang].bulk}")`);
    const qb = await quick.boundingBox();
    const bb = await bulk.boundingBox();
    check(`${lang}-375 quota CTA links (44px)`, qb && bb && qb.height >= 44 && bb.height >= 44, `quick=${qb?.height} bulk=${bb?.height}`);
    check(`${lang}-375 quota keeps results`, (await page.locator("h2:has-text('Top Picks')").count()) === 1 && (await page.locator(".font-mono.text-2xl").count()) > 0);
    check(`${lang}-375 quota bottom more disabled`, await page.locator(".fixed.inset-x-0.bottom-0 button.bg-brand").isDisabled());
    check(`${lang}-375 zero real AI calls (all intercepted)`, calls.length === 1, `intercepted=${calls.length}`);
    await page.screenshot({ path: `${out}/quota-375-${lang}.png` });
    if (lang === "zh") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/quota-desktop-${lang}.png` });
    }
    await ctx.close();
  }

  // ---- 375 摘要行：aria-expanded / 44px / 展开态 ----
  for (const lang of ["zh", "en"]) {
    const { ctx, page } = await open(browser, { width: 375, height: 667, lang, kinds: ["quota"] });
    const btn = page.locator("button[aria-expanded]").first();
    const box = await btn.boundingBox();
    check(`${lang}-375 summary toggle 44px`, box && box.height >= 44, `h=${box?.height}`);
    check(`${lang}-375 summary aria-expanded=false`, (await btn.getAttribute("aria-expanded")) === "false");
    const panelId = await btn.getAttribute("aria-controls");
    check(`${lang}-375 panel hidden when collapsed`, await page.locator(`[id="${panelId}"]`).isHidden());
    await btn.click();
    check(`${lang}-375 summary aria-expanded=true`, (await btn.getAttribute("aria-expanded")) === "true");
    const chips = page.locator(`[id="${panelId}"] button.rounded-full`);
    const n = await chips.count();
    const hs = [];
    for (let i = 0; i < n; i++) hs.push((await chips.nth(i).boundingBox())?.height);
    check(`${lang}-375 4 refine chips ≥44px in panel`, n === 4 && hs.every((h) => h >= 44), `heights=${hs.join(",")}`);
    check(`${lang}-375 refine chips enabled when idle`, !(await chips.first().isDisabled()));
    check(`${lang}-375 panel has restore actions`, (await page.locator(`[id="${panelId}"]`).innerText()).includes(lang === "zh" ? "开始新搜索" : "Start a new search"));
    check(`${lang}-375 no horizontal overflow (expanded)`, (await page.evaluate(() => document.documentElement.scrollWidth)) === 375);
    await page.screenshot({ path: `${out}/summary-expanded-375-${lang}.png` });
    await ctx.close();
  }

  fs.writeFileSync(`${out}/errors-results.json`, JSON.stringify(results, null, 2));
  const fails = Object.entries(results).filter(([, r]) => !r.pass);
  console.log(`\n${Object.keys(results).length - fails.length}/${Object.keys(results).length} checks passed`);
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})();
