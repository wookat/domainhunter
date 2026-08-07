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
  ["xianzhaoxian", null], // 视切分而定：xian-zhao-xian 3 音节可切分 → 保留但歧义降分
  ["jianzhiyui", true], // "yui" 非法音节 → 丢
  ["weizhoujan", true], // "jan" 非法音节 → 丢
  ["zhihu", false],
  ["xiaohongshu", false],
  ["bilibili", false],
  ["zlz", false], // ≤3 字符纯辅音缩写放行
  ["xiqizhi", false], // 可切分（prompt 层不喜欢，但确定性校验只管合法性）
  ["zhangsanfengqiling", true], // 5 音节 > 4 → 丢
  ["mingan", false], // min-gan / ming-an 两种最短切分 → 保留但歧义降分
];

let fail = 0;
for (const [label, expectDrop] of cases) {
  const r = checkPinyinLabel(label);
  const segs = segmentPinyin(label);
  const dropped = !r.ok;
  const detail = r.ok ? `保留${r.ambiguous ? "（歧义切分，readability -15）" : ""}` : "丢弃";
  const segStr = segs.map((s) => s.join("-")).join(" | ") || "(无法切分)";
  const pass = expectDrop === null || dropped === expectDrop;
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label.padEnd(20)} → ${detail.padEnd(24)} 切分: ${segStr}`);
}
process.exit(fail ? 1 : 0);
