/**
 * 静态参考价 vs Porkbun 实时价偏差审计（R531，手动/审计脚本，不进 vitest）。
 *
 * 对 apps/web/src/types.ts TLD_PRICES（人民币）与 /api/prices（美元）逐 TLD 比对：
 *   staticUsd = toUsd(first) = round(first / 7.2)（与页面「≈$」展示口径、R527 static-vs-live-prices.json 同法）
 *   relDiff   = (staticUsd − liveRegistration) / liveRegistration
 * 输出按 |relDiff| 降序的偏差表（首年 + 续费两列），并在任一首年偏差 > 阈值（默认 50%）时以退出码 1 结束。
 *
 * 用法：
 *   node scripts/check-static-prices.mjs <api-prices.json>        # 用已保存的 /api/prices 响应
 *   node scripts/check-static-prices.mjs --live                    # 抓生产 https://hunt.zalize.com/api/prices（无 AI 调用）
 *   node scripts/check-static-prices.mjs --live=http://localhost:8787/api/prices
 * 选项：
 *   --threshold=0.5   首年偏差门槛（比例）
 *   --renew           续费偏差也计入门槛（默认只报告不拦截）
 *   --min=0           只打印 |首年偏差| ≥ min 的行（默认 0.3；--min=0 打印全部）
 *   --json=<file>     同时把全量比对行写成 JSON（格式同 docs/audits/r527/static-vs-live-prices.json）
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(join(root, "apps/web/package.json"));
const { build } = require(require.resolve("esbuild", { paths: [require.resolve("vite", { paths: [join(root, "apps/web")] })] }));
const srcDir = join(root, "apps/web/src");

const args = process.argv.slice(2);
const opt = (name) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const optValue = (name, dflt) => {
  const a = opt(name);
  if (!a) return dflt;
  const eq = a.indexOf("=");
  return eq === -1 ? true : a.slice(eq + 1);
};
const file = args.find((a) => !a.startsWith("--"));
const live = optValue("live", null);
const threshold = Number(optValue("threshold", "0.5"));
const gateRenew = Boolean(opt("renew"));
const minShow = Number(optValue("min", "0.3"));
const jsonOut = optValue("json", null);

if (!file && !live) {
  console.error("用法：node scripts/check-static-prices.mjs <api-prices.json> | --live[=url]");
  process.exit(2);
}

const tmp = mkdtempSync(join(tmpdir(), "static-prices-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `export { tldPrice, staticPriceTlds } from "${srcDir}/types";
export { toUsd, toCny } from "${srcDir}/lib/currency";
export { USD_TO_CNY } from "${srcDir}/content/tld-list";
`,
);
const bundle = join(tmp, "bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "silent" });
const { tldPrice, staticPriceTlds, toUsd, toCny, USD_TO_CNY } = await import(pathToFileURL(bundle).href);
rmSync(tmp, { recursive: true, force: true });

let payloadText;
let source;
if (live) {
  source = live === true ? "https://hunt.zalize.com/api/prices" : String(live);
  const res = await fetch(source, { headers: { "user-agent": "Mozilla/5.0 (check-static-prices)" } });
  if (!res.ok) {
    console.error(`GET ${source} → HTTP ${res.status}`);
    process.exit(2);
  }
  payloadText = await res.text();
} else {
  source = file;
  payloadText = readFileSync(file, "utf8");
}
const payload = JSON.parse(payloadText);
const livePrices = payload?.prices ?? {};
const liveTlds = Object.keys(livePrices);
if (liveTlds.length === 0) {
  console.error(`${source}：prices 为空，无法比对`);
  process.exit(2);
}

const rel = (staticUsd, liveUsd) => (liveUsd > 0 ? (staticUsd - liveUsd) / liveUsd : null);
const rows = [];
const staticNoLive = [];
for (const tld of staticPriceTlds()) {
  const s = tldPrice(tld);
  const p = livePrices[tld];
  if (!p || typeof p.registration !== "number" || typeof p.renewal !== "number") {
    staticNoLive.push(tld);
    continue;
  }
  rows.push({
    tld,
    staticFirstCny: s.first,
    staticRenewCny: s.renew,
    staticUsd: toUsd(s.first),
    staticRenewUsd: toUsd(s.renew),
    liveReg: p.registration,
    liveRenew: p.renewal,
    relDiff: rel(toUsd(s.first), p.registration),
    relDiffRenew: rel(toUsd(s.renew), p.renewal),
  });
}
const liveNoStatic = liveTlds.filter((t) => !tldPrice(t));
rows.sort((a, b) => Math.abs(b.relDiff) - Math.abs(a.relDiff));

const pct = (x) => (x === null ? "n/a" : `${x > 0 ? "+" : ""}${Math.round(x * 100)}%`);
const pad = (s, n, right = false) => (right ? String(s).padStart(n) : String(s).padEnd(n));
const over = (x, th) => x !== null && Math.abs(x) > th;

const shown = rows.filter((r) => Math.abs(r.relDiff) >= minShow);
console.log(`来源：${source}（fetchedAt=${payload.fetchedAt ?? "?"}，stale=${payload.stale === true}，live TLD=${liveTlds.length}）`);
console.log(`汇率：1 USD = ${USD_TO_CNY} CNY；静态参考价 ${staticPriceTlds().length} 个，其中 ${rows.length} 个有实时价可比对`);
console.log("");
console.log(
  [pad("TLD", 13), pad("静态首年", 14, true), pad("实时首年", 16, true), pad("Δ首年", 7, true), pad("静态续费", 14, true), pad("实时续费", 16, true), pad("Δ续费", 7, true)].join("  "),
);
for (const r of shown) {
  const flag = over(r.relDiff, threshold) ? "!" : over(r.relDiffRenew, threshold) ? "~" : " ";
  console.log(
    [
      pad(`${flag}.${r.tld}`, 13),
      pad(`¥${r.staticFirstCny} ≈$${r.staticUsd}`, 14, true),
      pad(`$${r.liveReg} →¥${toCny(r.liveReg)}`, 16, true),
      pad(pct(r.relDiff), 7, true),
      pad(`¥${r.staticRenewCny} ≈$${r.staticRenewUsd}`, 14, true),
      pad(`$${r.liveRenew} →¥${toCny(r.liveRenew)}`, 16, true),
      pad(pct(r.relDiffRenew), 7, true),
    ].join("  "),
  );
}
if (shown.length < rows.length) console.log(`（省略 ${rows.length - shown.length} 行 |Δ首年| < ${Math.round(minShow * 100)}%；--min=0 查看全部）`);

const overFirst = rows.filter((r) => over(r.relDiff, threshold));
const overRenew = rows.filter((r) => over(r.relDiffRenew, threshold));
const over30 = rows.filter((r) => over(r.relDiff, 0.3));
console.log("");
console.log(`首年偏差 > ${Math.round(threshold * 100)}%：${overFirst.length} 个${overFirst.length ? ` → ${overFirst.map((r) => r.tld).join(" ")}` : ""}`);
console.log(`首年偏差 > 30%：${over30.length} 个${over30.length ? ` → ${over30.map((r) => r.tld).join(" ")}` : ""}`);
console.log(`续费偏差 > ${Math.round(threshold * 100)}%：${overRenew.length} 个${overRenew.length ? ` → ${overRenew.map((r) => r.tld).join(" ")}` : ""}${gateRenew ? "（计入门槛）" : "（仅报告）"}`);
console.log(`静态有价但实时缺价（回退静态，不比对）：${staticNoLive.length} 个 → ${staticNoLive.join(" ")}`);
if (liveNoStatic.length) console.log(`实时有价但无静态参考价：${liveNoStatic.length} 个 → ${liveNoStatic.join(" ")}`);

if (jsonOut) {
  writeFileSync(
    jsonOut,
    JSON.stringify({ source, fetchedAt: payload.fetchedAt ?? null, rate: USD_TO_CNY, threshold, rows, staticNoLive, liveNoStatic }, null, 2) + "\n",
  );
  console.log(`已写入 ${jsonOut}`);
}

const failed = overFirst.length > 0 || (gateRenew && overRenew.length > 0);
if (failed) {
  console.error(`\nFAIL：${overFirst.length} 个 TLD 首年偏差 > ${Math.round(threshold * 100)}%${gateRenew ? `，${overRenew.length} 个续费偏差超标` : ""}，请刷新 TLD_PRICES（¥ = round($ × ${USD_TO_CNY})，first/renew 分别刷新）`);
  process.exit(1);
}
console.log(`\nOK：无 TLD 首年偏差 > ${Math.round(threshold * 100)}%`);
