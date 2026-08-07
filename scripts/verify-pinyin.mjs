// R124 拼音校验自检脚本（无测试框架，独立 node 脚本）
// 用法：node scripts/verify-pinyin.mjs
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 转成 ESM 后动态加载
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// 从 apps/web 上下文解析 esbuild（vite 的传递依赖，pnpm 结构下需 createRequire）
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { transformSync } = viteRequire("esbuild");
const src = readFileSync(path.join(root, "apps/web/src/ai.ts"), "utf8");
const { code } = transformSync(src, { loader: "ts", format: "esm" });
const tmp = path.join(root, "scripts/.ai-compiled.mjs");
writeFileSync(tmp, code);
const { checkPinyinLabel, segmentPinyin } = await import(tmp);
rmSync(tmp);

const cases = [
  // [label, 期望丢弃?]
  ["jianzhiyui", true], // "yui" 非法音节 → 丢
  ["weizhoujan", true], // "jan" 非法音节 → 丢
  ["zlz", false], // ≤3 字符纯辅音缩写放行
  ["xiqizhi", null], // 可切分；R142 齿龈-卷舌连串（x-q-zh）→ 扣分不丢弃（单条规则命中）
  ["zhangsanfengqiling", true], // 5 音节 > 4 → 丢
  ["mingan", false], // min-gan / ming-an 两种最短切分 → 保留但歧义降分
];

// R142 知名品牌回归集：合法切分且语感风险分必须为 0（零误杀红线）
const brandCases = [
  "zhihu", "xiaohongshu", "bilibili", "douban", "taobao",
  "baidu", "weibo", "meituan", "pinduoduo", "xiaomi",
  "huawei", "youku", "wangyi",
];

// R142 已知坏例：合法切分但语感差，断言被扣分（risk > 0）或直接淘汰
const badCases = [
  ["xianzhaoxian", true], // xian-zhao-xian：x/zh/x 齿龈-卷舌连串 + ABA 首尾重复 → 35 分丢弃
  ["zhuangchuangshuang", true], // 全长音节堆叠 + zh/ch/sh 连串 → 35 分丢弃
  ["shanchashan", true], // ABA + sh/ch/sh 连串 → 35 分丢弃
  ["cuancuancuan", true], // AAA（含 ABA）+ c/c/c 连串 + 全长音节 → 50 分丢弃
  ["zhichishi", false], // zh/ch/sh 连串 → 20 分，仅扣分不丢弃
  ["zaocisai", false], // z/c/s 连串 → 20 分，仅扣分不丢弃
];

let fail = 0;
for (const [label, expectDrop] of cases) {
  const r = checkPinyinLabel(label);
  const segs = segmentPinyin(label);
  const dropped = !r.ok;
  const detail = r.ok ? `保留${r.ambiguous ? "（歧义切分，readability -15）" : ""}${r.risk > 0 ? `（语感风险 -${r.risk}）` : ""}` : "丢弃";
  const segStr = segs.map((s) => s.join("-")).join(" | ") || "(无法切分)";
  const pass = expectDrop === null || dropped === expectDrop;
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(20)} → ${detail.padEnd(24)} 切分: ${segStr}`);
}

console.log("\n—— R142 品牌回归集（必须保留且语感风险 0 扣分）——");
for (const label of brandCases) {
  const r = checkPinyinLabel(label);
  const pass = r.ok && r.risk === 0;
  if (!pass) fail++;
  const detail = r.ok ? `保留，risk=${r.risk}` : "丢弃";
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(20)} → ${detail}`);
}

console.log("\n—— R142 已知坏例（必须被扣分或淘汰）——");
for (const [label, expectDrop] of badCases) {
  const r = checkPinyinLabel(label);
  const dropped = !r.ok;
  const pass = expectDrop ? dropped : r.ok && r.risk > 0;
  if (!pass) fail++;
  const detail = dropped ? "丢弃" : r.ok ? `保留，risk=${r.risk}` : "";
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(20)} → ${detail.padEnd(16)} 期望: ${expectDrop ? "淘汰" : "扣分"}`);
}
process.exit(fail ? 1 : 0);
