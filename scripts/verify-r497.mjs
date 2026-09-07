// R497 离线回放自检（R494 审计 P2-1 / P2-2 / zh blend 2 字母 ASCII，无测试框架，0 AI 调用）
// 用法：node scripts/verify-r497.mjs
// 回放 docs/audits/r494/ai-search-0{1..6}.ndjson 的全部 proposed 候选，经 admitRuleCandidate 走完整准入链：
//   A. 三个坏例必须被拦：zhongao → pinyinMismatch；complainter / waofun → phantomEtymology
//   B. R494 §4.1 表中 11 条拼写正确的拼音候选 0 误杀（不因 pinyinMismatch / phantomEtymology 丢弃）
//   C. 全部上线 EN 候选（除 complainter）0 误杀
//   D. 全部 zh 候选中，除 zhongao / waofun 外无任何候选被 pinyinMismatch / phantomEtymology 新拦（与 R494 上线结果一致）
//   E. guard 计数字段沿用 pinyinMismatch / phantomEtymology（GuardDropCounts 不新增字段）
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r497-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmp });
const { admitRuleCandidate, newGuardStats } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` :: ${detail}` : ""}`);
};

// ---------- 回放 ----------
const rows = [];
for (let i = 1; i <= 6; i++) {
  const lines = readFileSync(path.join(root, `docs/audits/r494/ai-search-0${i}.ndjson`), "utf8").split("\n").filter(Boolean);
  const lang = JSON.parse(lines[0])._request.lang;
  for (const l of lines.slice(1)) {
    const ev = JSON.parse(l);
    if (ev.type !== "proposed") continue;
    for (const it of ev.items ?? []) rows.push({ file: i, lang, ...it });
  }
}
const result = new Map(); // label -> { admitted, reasons[] }
for (const r of rows) {
  const guard = newGuardStats();
  const out = admitRuleCandidate({ ...r }, r.lang, guard, new Set());
  const reasons = Object.entries(guard.dropped).filter(([, v]) => v > 0).map(([k]) => k);
  result.set(r.label, { ...r, admitted: !!out, reasons });
}
check("回放 6 份 NDJSON 候选数 = 137", rows.length === 137, `got ${rows.length}`);

// ---------- A. 坏例必须被拦 ----------
const mustDrop = [
  ["zhongao", "pinyinMismatch"],
  ["complainter", "phantomEtymology"],
  ["waofun", "phantomEtymology"],
];
for (const [label, reason] of mustDrop) {
  const r = result.get(label);
  check(`A bad: ${label} dropped by ${reason}`, r && !r.admitted && r.reasons.includes(reason), r ? `admitted=${r.admitted} reasons=${r.reasons}` : "missing");
}

// ---------- B. R494 §4.1 表 11 条正确拼音候选 0 误杀 ----------
const goodPinyin = ["qishu", "lexin", "hezhang", "zsp", "zhangwubao", "goubei", "maoxiong", "chonglexin", "miaowan", "nuanpa", "xiaoyuecha"];
const quality = new Set(["pinyinMismatch", "phantomEtymology"]);
for (const label of goodPinyin) {
  const r = result.get(label);
  check(`B good pinyin: ${label} not dropped by pinyinMismatch/phantomEtymology`, r && !r.reasons.some((k) => quality.has(k)), r ? `admitted=${r.admitted} reasons=${r.reasons}` : "missing");
}

// ---------- C. 全部 EN 候选（除 complainter）0 误杀 ----------
const en = rows.filter((r) => r.lang === "en");
check("C EN 候选数 = 12（含 complainter）", en.length === 12, `got ${en.length}`);
for (const r of en) {
  if (r.label === "complainter") continue;
  const res = result.get(r.label);
  check(`C EN good: ${r.label} admitted`, res.admitted, `reasons=${res.reasons}`);
}

// ---------- D. zh 候选除 zhongao/waofun 外无新拦 ----------
const zhNewDrops = rows.filter((r) => r.lang === "zh" && !["zhongao", "waofun"].includes(r.label) && result.get(r.label).reasons.some((k) => quality.has(k)));
check("D zh 其余候选 0 条被 pinyinMismatch/phantomEtymology 丢弃", zhNewDrops.length === 0, zhNewDrops.map((r) => `${r.label}:${result.get(r.label).reasons}`).join(", "));

// ---------- E. 计数字段不新增 ----------
const keys = Object.keys(newGuardStats().dropped);
check("E GuardDropCounts 含 pinyinMismatch 与 phantomEtymology", keys.includes("pinyinMismatch") && keys.includes("phantomEtymology"));
check("E GuardDropCounts 无 r497 新增字段", !keys.some((k) => /r497|coverage|shortAscii|pairColon/i.test(k)), keys.join(","));

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} check(s) FAILED`);
process.exit(failed === 0 ? 0 : 1);
