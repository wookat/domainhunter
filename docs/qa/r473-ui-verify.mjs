// R473 UI 验证：连接会话 Chrome（CDP 29229），本地 wrangler dev :8787，合成 dh:lastSearch:v1 恢复态（0 AI 调用）
// 序列化卡外观证明 ①-⑤，并截桌面/375 截图。
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = process.env.OUT ?? "/home/ubuntu/r473";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:8787";
const LANG = process.env.LANG_UI ?? "zh";
const THEME = process.env.THEME_UI ?? "light";

const sc = (n) => ({ length: n, readability: n, relevance: n, brandability: n });
const mk = (label, tld, s, status = "available", extra = {}) => ({
  domain: `${label}.${tld}`,
  label,
  tld,
  status,
  scores: sc(s),
  round: 1,
  theme: "pinyin",
  meaning: LANG === "zh" ? `「${label}」示例寓意，宠物+陪伴` : `Sample meaning for ${label}: pets + companionship`,
  ...extra,
});
// R469 复现：petwan/chongsi/tailwag 在 variant 0 同为 #FFD200；daysync ×3 TLD；pulseplan ×2；kaiwen 与 daysync 同色；kitely 与 pulseplan 同色
const rows = [
  mk("petwan", "com", 94),
  mk("petwan", "io", 92),
  mk("chongsi", "com", 91),
  mk("tailwag", "com", 90),
  mk("daysync", "com", 89),
  mk("daysync", "io", 88),
  mk("daysync", "dev", 87),
  mk("kaiwen", "com", 86),
  mk("pulseplan", "com", 85),
  mk("pulseplan", "dev", 84),
  mk("kitely", "com", 83),
  mk("castloom", "com", 82),
  mk("mintora", "com", 81),
  mk("verdant", "com", 80),
  mk("lumora", "com", 79),
  mk("penfold", "com", 78),
  mk("petjoy", "com", 77),
  mk("nimbly", "com", 76),
  mk("quillo", "com", 75, "unknown"),
  mk("paws", "com", 70, "taken"),
];
const saved = {
  values: { description: LANG === "zh" ? "宠物陪伴 App，温暖可爱" : "pet companionship app, warm and cute", tlds: ["com", "io", "dev"], style: "", lengthPref: "" },
  rows,
  rounds: [{ round: 1, noteKey: "agent.note.first", proposed: 20, checked: 20, available: 18 }],
  elapsedSec: 12,
  aiUnderstanding: null,
  refinements: [],
  triedLabels: [...new Set(rows.map((r) => r.label))],
  locked: [],
};

const browser = await chromium.connectOverCDP("http://localhost:29229");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
await page.setViewportSize({ width: 1440, height: 900 });

const usageBefore = await (await fetch(`${BASE}/api/usage`)).text().catch(() => "n/a");

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(
  ({ saved, lang, theme }) => {
    sessionStorage.clear();
    sessionStorage.setItem("dh:lastSearch:v1", JSON.stringify(saved));
    localStorage.setItem("domainhunter:lang", lang);
    localStorage.setItem("domainhunter:theme", theme);
    localStorage.setItem("dh:onboardDismissed:v1", "1");
  },
  { saved, lang: LANG, theme: THEME },
);
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForSelector('[data-brand-wall="top"]', { timeout: 15000 });

const serialize = () =>
  page.evaluate(() => {
    const sig = (card) => {
      const bc = card.querySelector("[data-brand-look]");
      const cs = getComputedStyle(bc);
      const spans = [...bc.querySelectorAll("span")].map((s) => getComputedStyle(s).color).join("|");
      return { look: bc.dataset.brandLook, bg: cs.backgroundImage !== "none" ? cs.backgroundImage : cs.backgroundColor, text: spans };
    };
    const wall = (sel) =>
      [...document.querySelectorAll(`${sel} [data-brand-card]`)].map((c) => ({
        label: c.dataset.brandCard,
        primary: c.dataset.domainPrimary,
        pills: [...c.querySelectorAll("[data-tld-pills] button")].map((b) => {
          const r = b.getBoundingClientRect();
          return { text: b.textContent.trim(), h: Math.round(r.height), w: Math.round(r.width), aria: b.getAttribute("aria-label") || b.title, pressed: b.getAttribute("aria-pressed") };
        }),
        ...sig(c),
      }));
    return { top: wall('[data-brand-wall="top"]'), grid: wall('[data-brand-wall="grid"]') };
  });

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` ${detail}` : ""}`);
};

// 行视图（默认）：紧凑行色点
await page.click('[data-density-option="compact"]');
await page.waitForTimeout(300);
const rowInfo = await page.evaluate(() => {
  const list = document.querySelector("[data-density]");
  const rowsEl = [...document.querySelectorAll("[data-domain]")];
  const avail = rowsEl.filter((r) => !r.textContent.includes("已被注册") && !r.textContent.includes("Taken"));
  return {
    density: list?.dataset.density,
    rows: rowsEl.length,
    dots: rowsEl.filter((r) => r.querySelector("[data-brand-dot]")).length,
    dotSample: avail.slice(0, 3).map((r) => {
      const d = r.querySelector("[data-brand-dot]");
      const cs = d && getComputedStyle(d);
      return { domain: r.dataset.domain, size: d && `${Math.round(d.getBoundingClientRect().width)}x${Math.round(d.getBoundingClientRect().height)}`, bg: cs && (cs.backgroundImage !== "none" ? cs.backgroundImage : cs.backgroundColor), ariaHidden: d?.getAttribute("aria-hidden") };
    }),
    rowH: [...new Set(rowsEl.map((r) => Math.round((r.querySelector("[data-domain] > div") ?? r).getBoundingClientRect().height)))],
    heights: [...new Set(rowsEl.map((r) => Math.round(r.getBoundingClientRect().height)))],
  };
});
console.log("rows:", JSON.stringify(rowInfo));
await page.screenshot({ path: `${OUT}/${LANG}-${THEME}-rows-compact-desktop.png`, fullPage: false });

// 切到网格
await page.click('[aria-label="品牌卡视图"], [aria-label="Brand card view"]');
await page.waitForSelector('[data-brand-wall="grid"] [data-brand-card]');
const s = await serialize();
writeFileSync(`${OUT}/${LANG}-${THEME}-cards.json`, JSON.stringify(s, null, 2));

const labels = (w) => w.map((c) => c.label.toLowerCase());
// 默认筛选「可注册」：18 行 available → 14 个 label（unknown/taken 不在默认筛选内）
check("① Grid 无重复 label 卡（18 行 → 14 卡）", new Set(labels(s.grid)).size === s.grid.length && s.grid.length === 14, `(${s.grid.length} 卡 / ${new Set(labels(s.grid)).size} label)`);
check("② Top Picks 3 个不同 label", s.top.length === 3 && new Set(labels(s.top)).size === 3, `(${labels(s.top).join(",")})`);
const noAdj = (w) => w.every((c, i) => i === 0 || c.bg !== w[i - 1].bg);
check("③a Top Picks 相邻无同 palette", noAdj(s.top), `(${s.top.map((c) => c.look.split("/")[0]).join(",")})`);
check("③b Grid 相邻无同 palette", noAdj(s.grid), `(${s.grid.map((c) => c.look.split("/")[0]).join(",")})`);
const gridByLabel = new Map(s.grid.map((c) => [c.label.toLowerCase(), c]));
const eq = s.top.map((c) => {
  const g = gridByLabel.get(c.label.toLowerCase());
  return g && c.look === g.look && c.bg === g.bg && c.text === g.text;
});
check("④ 同名在 Top Picks 与 Grid 外观 byte-equal（look/bg/文字色）", eq.every(Boolean), `(${s.top.map((c) => c.look).join(" ; ")})`);
check("⑤ 紧凑行每行都有 12px aria-hidden 色点", rowInfo.density === "compact" && rowInfo.rows === 18 && rowInfo.dots === rowInfo.rows && rowInfo.dotSample.every((d) => d.size === "12x12" && d.ariaHidden === "true"), JSON.stringify(rowInfo.dotSample));
check("⑤b 紧凑行高仍为 26px", rowInfo.heights.length === 1 && rowInfo.heights[0] === 26, `(${rowInfo.heights.join(",")})`);
const dotMatchesCard = rowInfo.dotSample.every((d) => {
  const lbl = d.domain.split(".")[0];
  const g = gridByLabel.get(lbl);
  return g && (g.bg === d.bg || g.bg.includes(d.bg));
});
check("⑤c 色点颜色 = 同名卡主背景色/渐变首色", dotMatchesCard);
check("胶囊：Top Picks 同名多 TLD 卡下列出全部 TLD 且 44px 触点", s.top.filter((c) => c.pills.length > 0).every((c) => c.pills.every((p) => p.h >= 44)) && s.top.find((c) => c.label === "petwan")?.pills.length === 2, JSON.stringify(s.top.map((c) => c.pills.map((p) => `${p.text}@${p.h}`))));
check("胶囊：Grid 同名卡 TLD 胶囊含首年价，默认选中首个 TLD", (() => { const d = s.grid.find((c) => c.label === "daysync"); return d && d.pills.length === 3 && d.pills[0].pressed === "true" && d.primary === "daysync.com" && d.pills.every((p) => /[$¥]\s?\d/.test(p.text) && p.h >= 44); })(), JSON.stringify(s.grid.find((c) => c.label === "daysync")?.pills));
check("Grid 不含 taken 行", !s.grid.some((c) => c.label === "paws"));
// 全部筛选：unknown 行进 Grid（无绿勾），taken 仍不进

await page.getByRole("button", { name: /^全部|^All/ }).first().click();
await page.waitForTimeout(300);
const sAll = await serialize();
check("筛选全部：Grid 含 unknown 不含 taken，仍无重复、相邻不同色", sAll.grid.length === 15 && sAll.grid.some((c) => c.label === "quillo") && !sAll.grid.some((c) => c.label === "paws") && noAdj(sAll.grid) && sAll.top.every((c) => c.look === s.top.find((x) => x.label === c.label)?.look), `(${sAll.grid.map((c) => c.look.split("/")[0]).join(",")})`);
await page.getByRole("button", { name: /^可注册|^Available/ }).first().click();
await page.waitForTimeout(300);

// 胶囊切换：daysync 卡点 .io 后操作对象变为 daysync.io
const dayCard = page.locator('[data-brand-wall="grid"] [data-brand-card="daysync"]');
await dayCard.locator('[data-tld-pills="select"] button').nth(1).click();
const afterSwitch = await dayCard.evaluate((c) => ({ primary: c.dataset.domainPrimary, lockTitle: [...c.querySelectorAll("button[title]")].map((b) => b.title).find((t) => /^(锁定|Lock)/.test(t)), pressed: [...c.querySelectorAll("[data-tld-pills] button")].map((b) => b.getAttribute("aria-pressed")) }));
check("胶囊切换：点 .io 后收藏/锁定作用于 daysync.io", afterSwitch.primary === "daysync.io" && afterSwitch.lockTitle?.includes("daysync.io") && afterSwitch.pressed.join() === "false,true,false", JSON.stringify(afterSwitch));
await dayCard.locator('[data-tld-pills="select"] button').nth(0).click();

await page.screenshot({ path: `${OUT}/${LANG}-${THEME}-grid-desktop.png`, fullPage: false });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${OUT}/${LANG}-${THEME}-top-desktop.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/${LANG}-${THEME}-grid-desktop-full.png`, fullPage: true });

// 375
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await page.addStyleTag({ content: "::-webkit-scrollbar{display:none}" });
await page.waitForTimeout(500);
const m = await page.evaluate(() => {
  const over = [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > 375.5).map((el) => `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`);
  return { scrollWidth: document.documentElement.scrollWidth, innerWidth: innerWidth, over: over.slice(0, 5) };
});
check("375px 无横向溢出", m.scrollWidth <= 375, JSON.stringify(m));
const s375 = await serialize();
check("375px Top Picks/Grid 外观与桌面一致", JSON.stringify(s375.top.map((c) => c.look)) === JSON.stringify(s.top.map((c) => c.look)) && JSON.stringify(s375.grid.map((c) => c.look)) === JSON.stringify(s.grid.map((c) => c.look)));
const pill375 = await page.evaluate(() => [...document.querySelectorAll("[data-tld-pills] button")].map((b) => Math.round(b.getBoundingClientRect().height)));
check("375px 胶囊触点 ≥44px", pill375.every((h) => h >= 44), `(${[...new Set(pill375)].join(",")})`);
await page.bringToFront();
const shot = async (name) => {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(`${OUT}/${name}`, Buffer.from(data, "base64"));
};
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await shot(`${LANG}-${THEME}-top-375.png`);
await page.evaluate(() => document.querySelector('[data-brand-wall="grid"]')?.scrollIntoView());
await page.waitForTimeout(300);
await shot(`${LANG}-${THEME}-grid-375.png`);
await cdp.send("Emulation.clearDeviceMetricsOverride");

const usageAfter = await (await fetch(`${BASE}/api/usage`)).text().catch(() => "n/a");
const days = (s) => { try { return JSON.stringify(JSON.parse(s).days); } catch { return s; } };
check("0 次 AI 调用（/api/usage.days 前后一致）", days(usageBefore) === days(usageAfter), `(${days(usageBefore)} → ${days(usageAfter)})`);

writeFileSync(`${OUT}/${LANG}-${THEME}-results.json`, JSON.stringify({ results, rowInfo, cards: s }, null, 2));
await page.close();
await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} FAILED` : "\nALL PASS");
process.exit(failed ? 1 : 0);
