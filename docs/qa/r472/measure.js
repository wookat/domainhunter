// 用法：node measure.js <tag> [port]
// 恢复态 fixture 下量 375×667 / 1440×900 首屏几何 + 截图；拦截 /api/ai-search 保证 0 次 AI 调用
const { chromium } = require("playwright");
const { fixture } = require("./fixture");
const fs = require("fs");

const tag = process.argv[2] || "base";
const port = process.argv[3] || "8787";
const out = process.env.OUT || `${__dirname}/shots`;
fs.mkdirSync(out, { recursive: true });

async function open(browser, { width, height, lang, theme = "dark" }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  let aiCalls = 0;
  await ctx.route("**/api/ai-search", (route) => {
    aiCalls++;
    route.abort();
  });
  const page = await ctx.newPage();
  await page.addInitScript(
    ({ fx, lang, theme }) => {
      sessionStorage.setItem("dh:lastSearch:v1", JSON.stringify(fx));
      localStorage.setItem("domainhunter:lang", lang);
      localStorage.setItem("domainhunter:theme", theme);
      localStorage.setItem("dh:onboardDismissed:v1", "1");
    },
    { fx: fixture(lang), lang, theme },
  );
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("h2:has-text('Top Picks')");
  return { ctx, page, aiCalls: () => aiCalls };
}

async function geometry(page) {
  return page.evaluate(() => {
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top), bottom: Math.round(b.bottom), height: Math.round(b.height), text: (el.textContent || "").trim().slice(0, 40) };
    };
    const h2 = [...document.querySelectorAll("h2")].find((e) => e.textContent.includes("Top Picks"));
    const grid = h2?.parentElement?.nextElementSibling;
    const card = grid?.firstElementChild;
    const domainEl = card?.querySelector(".font-mono.text-2xl");
    const main = document.querySelector("main");
    const h1 = document.querySelector("h1");
    const bottomBar = document.querySelector(".fixed.inset-x-0.bottom-0");
    const barTop = bottomBar ? bottomBar.getBoundingClientRect().top : innerHeight;
    const header = document.querySelector("header");
    // header 与 main 之间的所有横幅
    const between = [];
    let el = header?.nextElementSibling;
    while (el && el !== main) {
      if (el.getBoundingClientRect().height > 0) between.push(r(el));
      el = el.nextElementSibling;
    }
    return {
      viewport: { w: innerWidth, h: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      header: r(header),
      banners: between,
      h1: r(h1),
      topPicksHeading: r(h2),
      firstCard: r(card),
      firstDomain: r(domainEl),
      firstDomainInViewport: domainEl ? domainEl.getBoundingClientRect().bottom <= innerHeight : null,
      bottomBarTop: Math.round(barTop),
      firstDomainAboveBottomBar: domainEl ? domainEl.getBoundingClientRect().bottom <= barTop : null,
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const report = {};
  for (const lang of ["zh", "en"]) {
    for (const vp of [
      { width: 375, height: 667, name: "375" },
      { width: 1440, height: 900, name: "desktop" },
    ]) {
      const { ctx, page, aiCalls } = await open(browser, { ...vp, lang });
      const g = await geometry(page);
      const name = `${tag}-${vp.name}-${lang}`;
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
      report[name] = { ...g, aiCalls: aiCalls() };
      await ctx.close();
    }
  }
  fs.writeFileSync(`${out}/${tag}-geometry.json`, JSON.stringify(report, null, 2));
  for (const [k, v] of Object.entries(report)) {
    console.log(k, "firstCard.top=", v.firstCard?.top, "firstDomain.bottom=", v.firstDomain?.bottom, "inViewport=", v.firstDomainInViewport, "aboveStickyBar(top=" + v.bottomBarTop + ")=", v.firstDomainAboveBottomBar, "scrollWidth=", v.scrollWidth, "aiCalls=", v.aiCalls);
    console.log("   banners:", v.banners.map((b) => `[${b.top}-${b.bottom}] ${b.text}`).join(" | "));
    console.log("   h1:", v.h1 && `[${v.h1.top}-${v.h1.bottom}]`, "topPicksHeading:", v.topPicksHeading && `[${v.topPicksHeading.top}-${v.topPicksHeading.bottom}]`);
  }
  await browser.close();
})();
