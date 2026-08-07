// R149 meaning 括号注释剥离自检脚本（无测试框架，独立 node 脚本）
// 用法：node scripts/verify-meaning-paren.mjs
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 转成 ESM 后动态加载
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { transformSync } = viteRequire("esbuild");
const src = readFileSync(path.join(root, "apps/web/src/ai.ts"), "utf8");
const { code } = transformSync(src, { loader: "ts", format: "esm" });
const tmp = path.join(root, "scripts/.ai-compiled-r149.mjs");
writeFileSync(tmp, code);
const { cleanMeaning, stripParentheticalAnnotations, PAREN_RE } = await import(tmp);
rmSync(tmp);

let pass = 0;
let fail = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}`);
  if (!ok) console.log(`       expected: ${JSON.stringify(expected)}\n       actual:   ${JSON.stringify(actual)}`);
};

console.log("== R149 括号注释剥离 ==");
// 1. R136 实测原型：中文括号内嵌拆字
check("R136 原型（英文括号拆字）", cleanMeaning("mosur：mu(慕:向往)加sur踏石追思，寓意远行"), "mosur：mu加sur踏石追思，寓意远行");
// 2. 全角括号
check("全角括号", cleanMeaning("「木舟」muzhou（双字全拼），寓意稳载远行"), "「木舟」muzhou，寓意稳载远行");
// 3. 方括号 + 【】混合多段
check("多段混合括号", cleanMeaning("mu[慕]加yuan【远】，寓意心怀远方"), "mu加yuan，寓意心怀远方");
// 4. 嵌套括号整段剥离
check("嵌套括号", cleanMeaning("muyuan（mu(慕)取向往），寓意心怀远方好读好记"), "muyuan，寓意心怀远方好读好记");
// 5. 只有左括号 → 从括号处剥到串尾（截断的注释开头）
check("只有左括号", cleanMeaning("寓意稳载远行，声调平缓（拆字说明"), "寓意稳载远行，声调平缓");
// 6. 只有右括号 → 仅删该字符
check("只有右括号", cleanMeaning("寓意稳载远行）声调平缓好记"), "寓意稳载远行声调平缓好记");
// 7. 英文括号包中文内容
check("英文括号中文内容", cleanMeaning("zhizhou (知舟) 双字全拼，读一遍就能拼出来"), "zhizhou 双字全拼，读一遍就能拼出来");
// 8. 全括号（整条都是注释）→ 剥离后为空
check("全括号整条", cleanMeaning("（mu:慕 + yuan:远）"), "");
// 9. 混用开闭类型（（…) ）按最近开括号配对
check("混用括号类型", cleanMeaning("muyuan（mu取慕)，寓意心怀远方全拼顺口"), "muyuan，寓意心怀远方全拼顺口");
// 10. 成对「」不受影响
check("成对「」保留", cleanMeaning("「知舟」zhizhou，双字全拼，齿音开头声调上扬"), "「知舟」zhizhou，双字全拼，齿音开头声调上扬");
// 11. 无括号 meaning 原样保留
check("无括号原样", cleanMeaning("verb + bloom: words that blossom, stress on the first syllable"), "verb + bloom: words that blossom, stress on the first syllable");
// 12. 剥离后 <6 字符 → 上层丢弃条件成立（PAREN_RE 命中 + 结果过短）
{
  const raw = "远行（mu:慕 加 yuan:远，寓意心怀远方）";
  const m = cleanMeaning(raw);
  check("剥离后过短触发丢弃条件", m.length < 6 && PAREN_RE.test(raw), true);
}

console.log("\n== 历史清洗规则回归 ==");
// R: “”/『』 等引号包中文原词归一为「」
check("弯引号归一「」", cleanMeaning("“木舟”muzhou，双字全拼，寓意稳载远行"), "「木舟」muzhou，双字全拼，寓意稳载远行");
check("『』归一「」", cleanMeaning("『知舟』zhizhou，双字全拼，声调上扬"), "「知舟」zhizhou，双字全拼，声调上扬");
// 英文弯引号兜底归一为直引号
check("英文弯引号归一", cleanMeaning("Latin “lumen” meaning light, evokes clarity"), 'Latin "lumen" meaning light, evokes clarity');
// R132：孤立不成对 CJK 引号清理
check("孤立开引号清理", cleanMeaning("「木舟muzhou，双字全拼寓意稳载远行"), "木舟muzhou，双字全拼寓意稳载远行");
check("孤立闭引号清理", cleanMeaning("木舟」muzhou，双字全拼寓意稳载远行"), "木舟muzhou，双字全拼寓意稳载远行");
// 首尾空白清理
check("首尾空白清理", cleanMeaning("  寓意稳载远行，声调平缓  "), "寓意稳载远行，声调平缓");
// 空 meaning → 空串（上层丢弃）
check("空 meaning", cleanMeaning("   "), "");

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
