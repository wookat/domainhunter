/**
 * R549 取证/守门脚本：/vs 正文（compares.ts zh/en verdict + pickA/pickB）里会随时间漂移的价格数字。
 *
 * 同页 R521 价格表读 KV 实时快照，而正文里手写的「站内参考价 .io 首年 259 元、续费 419 元」是静态快照，
 * 两套数字必然漂移（R545 P1-2）。本脚本逐句扫描并分类：
 *   abs   —— 绝对零售价：zh「NN 元」、en「¥NN」、en「$NN」（非批发/拍卖事实）
 *   ratio —— 依赖价格比值的相对表述：「不到 .com 一半」「续费约为 .com 的五倍」「about 5x」「¥200 a year below」等
 *   fact  —— 政策/注册局事实里的金额（ICANN 批发价 $10.26、拍卖 $41,501,000、.ai 两年起注首笔一千元出头），保留不算漂移
 * 并把 abs 数字与 types.ts TLD_PRICES 静态参考价、/api/prices 实时价（Porkbun USD × USD_TO_CNY）比对，输出偏差分布。
 *
 * 用法：
 *   node scripts/verify-r549.mjs                              # 只扫 compares.ts，打印摘要
 *   node scripts/verify-r549.mjs --prices /tmp/api_prices.json --out docs/audits/r549/scan-before.md
 *   node scripts/verify-r549.mjs --gate                       # abs 句数 > 0 时退出码 1（vitest 之外的守门）
 *   node scripts/verify-r549.mjs --compares /tmp/compares.orig.ts --out docs/audits/r549/scan-before.md   # 扫改前快照
 */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(join(root, "apps/web/package.json"));
const { build } = require(require.resolve("esbuild", { paths: [require.resolve("vite", { paths: [join(root, "apps/web")] })] }));
const srcDir = join(root, "apps/web/src");

const args = process.argv.slice(2);
const optValue = (name, dflt) => {
  const i = args.findIndex((x) => x === `--${name}` || x.startsWith(`--${name}=`));
  if (i === -1) return dflt;
  const eq = args[i].indexOf("=");
  if (eq !== -1) return args[i].slice(eq + 1);
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
};
const pricesFile = optValue("prices", null);
const outFile = optValue("out", null);
const gate = Boolean(optValue("gate", false));
const comparesFile = optValue("compares", null);

const tmp = mkdtempSync(join(tmpdir(), "r549-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `export { TLD_COMPARES } from "${comparesFile ? resolve(comparesFile).replace(/\.ts$/, "") : `${srcDir}/content/compares`}";
export { tldPrice } from "${srcDir}/types";
export { toCny } from "${srcDir}/lib/currency";
export { USD_TO_CNY } from "${srcDir}/content/tld-list";
export { PRICE_PLACEHOLDER_RE, parsePricePlaceholder, placeholderTlds } from "${srcDir}/content/compare-prices";
`,
);
const bundle = join(tmp, "bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "silent" });
const { TLD_COMPARES, tldPrice, toCny, USD_TO_CNY, PRICE_PLACEHOLDER_RE, parsePricePlaceholder, placeholderTlds } = await import(pathToFileURL(bundle).href);
rmSync(tmp, { recursive: true, force: true });

const live = (() => {
  if (!pricesFile) return null;
  const parsed = JSON.parse(readFileSync(pricesFile, "utf8"));
  return { prices: parsed.prices ?? {}, fetchedAt: parsed.fetchedAt ?? null };
})();

// —— 句子切分：zh 按 。！？；，en 按 「. 」+ 大写/引号 —— 与 faq.test.ts 同口径
export const splitSentences = (text, lang) =>
  text
    .split(lang === "zh" ? /(?<=[。！？；])/ : /(?<=\.)\s+(?=[A-Z"“(])/)
    .map((s) => s.trim())
    .filter(Boolean);

// —— 分类正则 ——
/** 绝对价：zh「NN 元」（含「两百元」类中文数词整百）、en「¥NN」「$NN」 */
const ABS = {
  zh: /(\d[\d,]*)\s*元|([两三四五六七八九])百(?:多)?元/g,
  en: /(?:¥|\$)\s?(\d[\d,]*(?:\.\d+)?)/g,
};
const CN_HUNDREDS = { 两: 200, 三: 300, 四: 400, 五: 500, 六: 600, 七: 700, 八: 800, 九: 900 };
/**
 * 政策/注册局事实里的金额（不随注册商零售价漂移，保留）：ICANN 批发价、ICANN 拍卖价、两年起注的首笔账单等。
 * 只看数字前后的短窗口，不整句判定（同一句常同时含批发价与零售价）。与 scripts/r549-templatize.mjs 同口径。
 */
const FACT = {
  zh: { near: 10, far: 12, nearRe: /两年起注|一千元出头|首笔|保证金|押金|罚款/, farRe: /批发价|批发|拍卖|成交|售出|卖出|卖了|转手|估值|融资|注册局[^。；]{0,6}收/ },
  en: { near: 25, far: 45, nearRe: /two-year minimum|first bill|deposit|fine of|registry fee|costs registrars|\$\s?[\d,.]+\s*(?:million|billion|m\b|bn\b|k\b)/i, farRe: /wholesale|auction|sold|sale price|resold|changed hands|acquired for|valuation|raised/i },
};
const isFactNumber = (lang, sentence, idx, len) => {
  const f = FACT[lang];
  const tail = (n) => sentence.slice(idx, idx + len + n);
  return f.nearRe.test(sentence.slice(Math.max(0, idx - f.near), idx) + " " + tail(lang === "zh" ? 4 : 12)) || f.farRe.test(sentence.slice(Math.max(0, idx - f.far), idx) + " " + tail(12));
};
/** 依赖价格比值/差额的相对表述（比值随实时价漂移）：命中词 + 句内有价格语境 + 排除非价格用法（长度/人口/双关等） */
const RATIO = {
  zh: /一半|[两二三四五六七八九十\d.]+\s*倍|[二三四五六七八九十]分之[一二三四五]|[两三四五六七八九]成(?![立本])|减半|翻倍|(?:差价|价差)\s*[约近]?\s*(?:\d|[两二三四五六七八九十]+倍)/g,
  en: /\bhalf\b|\btwice\b|\bdouble\b|\btriple\b|\d+(?:\.\d+)?\s?x\b|\d+(?:–|-|\s?to\s?)\d+x\b|\btimes\b|\bthird of\b|\b(?:two|three|four|five|six|seven|eight|nine|ten)fold\b/gi,
};
const RATIO_CONTEXT = {
  zh: /续费|首年|价|成本|费|预算|账本|持有|注册与/,
  en: /renew|price|cost|hold|budget|register|cheap|expensive|gap|pay|bill|promo|teaser|intro|year one|first year|tier/i,
};
const RATIO_EXCLUDE = {
  zh: /短一半|字母|人口|体量|游客|科研|注册量|市场|规模|行程差价|折扣差价|双关|数量|双注册|成本翻倍但|已被注册|四五位数/,
  en: /half the length|half a billion|half of Africa|half the world|left half|second half|half will|Half Oaks|Half-price|double meaning|double life|double reading|double play|double act|double as|double-|Double-|think twice|twice as upscale|changed hands|two-and-a-half|1X Technologies|times more hits|registrations|market|residents|population|tee times|several times|many times|three times per IANA|reading twice|promo-then-double|typing [a-z]+ twice|costs are twofold|registration base/i,
};
const ratioHits = (lang, sentence) => {
  if (!RATIO_CONTEXT[lang].test(sentence)) return [];
  return [...sentence.matchAll(RATIO[lang])].filter((m) => {
    const win = sentence.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30);
    return !RATIO_EXCLUDE[lang].test(win);
  }).map((m) => m[0]);
};

const rows = [];
/** 占位符（方案 B）：全部必须可解析，且 TLD ∈ {a,b} 且有静态参考价（渲染层回落用） */
const placeholders = { total: 0, kinds: {}, bad: [] };
for (const cmp of Object.values(TLD_COMPARES)) {
  for (const lang of ["zh", "en"]) {
    const loc = cmp[lang];
    const fields = [
      ["verdict", loc.verdict],
      ...loc.pickA.map((s, i) => [`pickA[${i}]`, s]),
      ...loc.pickB.map((s, i) => [`pickB[${i}]`, s]),
    ];
    for (const [field, text] of fields) {
      for (const m of text.matchAll(/\{\{[^}]*\}\}/g)) {
        placeholders.total += 1;
        const ph = PRICE_PLACEHOLDER_RE.test(m[0]) ? parsePricePlaceholder(m[0]) : null;
        PRICE_PLACEHOLDER_RE.lastIndex = 0;
        if (!ph) { placeholders.bad.push({ slug: cmp.slug, lang, field, raw: m[0], why: "unparseable" }); continue; }
        placeholders.kinds[ph.kind] = (placeholders.kinds[ph.kind] ?? 0) + 1;
        for (const t of placeholderTlds(ph)) {
          if (t !== cmp.a && t !== cmp.b) placeholders.bad.push({ slug: cmp.slug, lang, field, raw: m[0], why: `tld .${t} 不是本页两侧` });
          else if (!tldPrice(t)) placeholders.bad.push({ slug: cmp.slug, lang, field, raw: m[0], why: `.${t} 无 TLD_PRICES 静态参考价` });
        }
      }
      for (const sentence of splitSentences(text, lang)) {
        const nums = [...sentence.matchAll(ABS[lang])].map((m) => ({
          raw: m[0],
          value: m[2] ? CN_HUNDREDS[m[2]] : Number(m[1].replace(/,/g, "")),
          fact: isFactNumber(lang, sentence, m.index, m[0].length),
        }));
        const abs = nums.filter((n) => !n.fact);
        const facts = nums.filter((n) => n.fact);
        const ratios = ratioHits(lang, sentence);
        let kind = null;
        if (abs.length) kind = "abs";
        else if (ratios.length) kind = "ratio";
        else if (facts.length) kind = "fact";
        if (!kind) continue;
        rows.push({ slug: cmp.slug, a: cmp.a, b: cmp.b, lang, field, kind, sentence, nums: abs, facts, ratio: ratios.length > 0, ratios });
      }
    }
  }
}

// —— 偏差：把 abs 数字归到两侧 TLD 的静态首年/续费（数字完全等于 TLD_PRICES 时归属），再与实时价比 ——
const dev = [];
const unattributed = [];
for (const r of rows.filter((x) => x.kind === "abs")) {
  for (const n of r.nums) {
    let hit = null;
    for (const tld of [r.a, r.b]) {
      const s = tldPrice(tld);
      if (!s) continue;
      if (s.first === n.value) hit = { tld, kind: "first", static: s.first };
      else if (s.renew === n.value) hit = { tld, kind: "renew", static: s.renew };
      if (hit) break;
    }
    if (!hit) {
      unattributed.push({ ...r, n });
      continue;
    }
    const lp = live?.prices?.[hit.tld];
    const liveCny = lp ? toCny(hit.kind === "first" ? lp.registration : lp.renewal) : null;
    dev.push({ slug: r.slug, lang: r.lang, field: r.field, tld: hit.tld, priceKind: hit.kind, text: n.value, static: hit.static, liveCny, rel: liveCny ? (n.value - liveCny) / liveCny : null });
  }
}

const by = (xs, key) => {
  const m = new Map();
  for (const x of xs) m.set(key(x), (m.get(key(x)) ?? 0) + 1);
  return [...m.entries()].sort((p, q) => q[1] - p[1]);
};
const pagesWith = (kind) => new Set(rows.filter((r) => r.kind === kind).map((r) => r.slug));
const absRows = rows.filter((r) => r.kind === "abs");
const ratioRows = rows.filter((r) => r.kind === "ratio");
const factRows = rows.filter((r) => r.kind === "fact");
const absTlds = by(dev, (d) => d.tld);
const pct = (x) => `${(x * 100).toFixed(1)}%`;

const lines = [];
const P = (s = "") => lines.push(s);
P(`# R549 /vs 正文价格扫描（${outFile?.includes("after") ? "after" : "before"}）`);
P();
P(`- 扫描对象：\`apps/web/src/content/compares.ts\` ${Object.keys(TLD_COMPARES).length} 页 × zh/en 的 verdict + pickA/pickB；句子切分口径同 faq.test.ts。`);
P(`- 实时价：${live ? `/api/prices 快照 fetchedAt=${live.fetchedAt ? new Date(live.fetchedAt).toISOString() : "null"}（${Object.keys(live.prices).length} TLD，USD×${USD_TO_CNY}）` : "未提供（--prices 缺省）"}。`);
P(`- 分类：abs=绝对零售价（会漂移）；ratio=依赖价格比值/差额的相对表述（会漂移）；fact=批发价/拍卖/两年起注等政策事实金额（保留）。`);
P();
P(`## 总览`);
P();
P(`| 类别 | 句数 | 页数 | zh 句 | en 句 | verdict 句 | pick 句 |`);
P(`|---|---:|---:|---:|---:|---:|---:|`);
for (const [name, xs] of [["abs", absRows], ["ratio", ratioRows], ["fact", factRows]]) {
  P(`| ${name} | ${xs.length} | ${pagesWith(name).size} | ${xs.filter((r) => r.lang === "zh").length} | ${xs.filter((r) => r.lang === "en").length} | ${xs.filter((r) => r.field === "verdict").length} | ${xs.filter((r) => r.field !== "verdict").length} |`);
}
P();
P(`abs 数字总数 ${absRows.reduce((s, r) => s + r.nums.length, 0)}，其中可归属到两侧 TLD_PRICES 首年/续费 ${dev.length}，未归属 ${unattributed.length}。`);
P();
P(`## abs 涉及 TLD（可归属数字）`);
P();
P(`| TLD | 数字个数 | 静态首年/续费 | 实时首年/续费（¥） |`);
P(`|---|---:|---|---|`);
for (const [tld, n] of absTlds) {
  const s = tldPrice(tld);
  const lp = live?.prices?.[tld];
  P(`| .${tld} | ${n} | ${s.first}/${s.renew} | ${lp ? `${toCny(lp.registration)}/${toCny(lp.renewal)}` : "无实时价"} |`);
}
P();
if (live) {
  P(`## abs 数字 vs 实时价偏差分布（正文数字 − 实时 ¥）/ 实时 ¥`);
  P();
  const withLive = dev.filter((d) => d.rel !== null);
  const buckets = [
    ["|rel| ≤ 5%", (x) => Math.abs(x) <= 0.05],
    ["5% < |rel| ≤ 15%", (x) => Math.abs(x) > 0.05 && Math.abs(x) <= 0.15],
    ["15% < |rel| ≤ 30%", (x) => Math.abs(x) > 0.15 && Math.abs(x) <= 0.3],
    ["|rel| > 30%", (x) => Math.abs(x) > 0.3],
  ];
  P(`| 偏差区间 | 数字个数 |`);
  P(`|---|---:|`);
  for (const [label, f] of buckets) P(`| ${label} | ${withLive.filter((d) => f(d.rel)).length} |`);
  P(`| 无实时价 | ${dev.length - withLive.length} |`);
  P();
  P(`| TLD | 项 | 正文数字 | 静态参考价 | 实时 ¥ | 偏差 | 出现次数 |`);
  P(`|---|---|---:|---:|---:|---:|---:|`);
  for (const [k, n] of by(dev, (d) => `${d.tld}|${d.priceKind}|${d.text}`)) {
    const d = dev.find((x) => `${x.tld}|${x.priceKind}|${x.text}` === k);
    P(`| .${d.tld} | ${d.priceKind} | ${d.text} | ${d.static} | ${d.liveCny ?? "—"} | ${d.rel === null ? "—" : pct(d.rel)} | ${n} |`);
  }
  P();
}
P(`## 正文数字 vs TLD_PRICES 静态参考价`);
P();
P(`可归属数字全部等于当前 TLD_PRICES（归属规则即相等）；**未归属**数字 ${unattributed.length} 个如下（= 手写时的旧参考价或第三方数字，已与 TLD_PRICES 不同步）：`);
P();
for (const u of unattributed) P(`- ${u.slug} ${u.lang} ${u.field}：\`${u.n.raw}\` —— ${u.sentence}`);
P();
P(`## 占位符（方案 B）`);
P();
P(`- 总数 ${placeholders.total}；按类型：${Object.entries(placeholders.kinds).map(([k, v]) => `${k}=${v}`).join("，") || "—"}`);
P(`- 不合法/越界 ${placeholders.bad.length}`);
for (const b of placeholders.bad) P(`  - **${b.slug}** ${b.lang} ${b.field} \`${b.raw}\`：${b.why}`);
P();
P(`## abs 句清单（${absRows.length}）`);
P();
for (const r of absRows) P(`- **${r.slug}** ${r.lang} ${r.field}${r.ratio ? "（含比值）" : ""}：${r.sentence}`);
P();
P(`## ratio 句清单（不含绝对价、只含比值/差额，${ratioRows.length}）`);
P();
for (const r of ratioRows) P(`- **${r.slug}** ${r.lang} ${r.field}：${r.sentence}`);
P();
P(`## fact 句清单（保留，${factRows.length}）`);
P();
for (const r of factRows) P(`- **${r.slug}** ${r.lang} ${r.field}：${r.sentence}`);

const md = lines.join("\n") + "\n";
if (outFile) {
  mkdirSync(dirname(resolve(root, outFile)), { recursive: true });
  writeFileSync(resolve(root, outFile), md);
  console.log(`written ${outFile}`);
}
console.log(`abs ${absRows.length} 句 / ${pagesWith("abs").size} 页；ratio ${ratioRows.length} 句 / ${pagesWith("ratio").size} 页；fact ${factRows.length} 句；未归属数字 ${unattributed.length}；占位 ${placeholders.total}（不合法 ${placeholders.bad.length}）`);
if (gate && (absRows.length > 0 || ratioRows.length > 0 || placeholders.bad.length > 0)) process.exit(1);
