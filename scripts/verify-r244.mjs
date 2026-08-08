// R244 拼音引用校验自检脚本（无测试框架，独立 node 脚本，0 AI 调用）
// 用法：node scripts/verify-r244.mjs
// 覆盖 R239 审计 P2-1：「全拼」声明从必要条件改为加严条件——不写「全拼」也做弱声称校验。
// 用例来源：R239 审计报告（docs/qa/audit-r239.md）zh2/ref2 漏网坏例 + 合法形态构造用例。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r244-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { pinyinQuoteMismatch } = await import(tmp);
rmSync(tmp);

let pass = 0;
let fail = 0;
function check(name, label, meaning, expectMismatch) {
  const got = pinyinQuoteMismatch(label, meaning);
  if (got === expectMismatch) {
    pass++;
    console.log(`  ok   ${name}: ${label} → mismatch=${got}`);
  } else {
    fail++;
    console.error(`  FAIL ${name}: ${label} → mismatch=${got}，期望 ${expectMismatch}`);
  }
}

console.log("== A. R239 审计漏网坏例（无「全拼」声明，必须拦截）==");
// zh2 r3 shuqi「漱石」：漱石=shushi ≠ shuqi，meaning 未含「全拼」二字
check("shuqi 漱石（P2-1 坏例）", "shuqi", "「漱石」二字取夏目漱石意象，文人枕流漱石之志", true);
// ref2 r1 pinen「品芩」：品芩=pinqin ≠ pinen
check("pinen 品芩（P2-1 坏例）", "pinen", "「品芩」双字，品味黄芩草木清气", true);
// ref2 r1 duanyou「韫岩」：引用词与 label 完全无关（韫岩≈yunyan）
check("duanyou 韫岩（P2-1 坏例）", "duanyou", "「韫岩」藏玉于岩，wrin 前缀强调直结声", true);

console.log("== B. 弱声称下合法形态（零误杀）==");
// 取字首组合：云慕 → y+m 之外，首字母+全拼混合也放行
check("yunmu 云慕（全拼）", "yunmu", "「云慕」二字，云端仰慕之意", false);
check("ym 云慕（双首字母）", "ym", "「云慕」取二字首字母，极短好记", false);
check("ymu 云慕（首字母+拼音）", "ymu", "「云慕」取云字首与慕拼音组合", false);
check("yunm 云慕（拼音+首字母）", "yunm", "「云慕」云拼音加慕字首", false);
// zh/ch/sh 双字母声母也算「字首」
check("zhh 知禾（zh 声母+首字母）", "zhh", "「知禾」取知的声母与禾字首", false);
// 多音字：任一读音（沿用现有多音字表逻辑）
check("cuandian 攒点（多音字）", "cuandian", "「攒点」二字，攒下每一点", false);
check("zandian 攒点（另一读音）", "zandian", "「攒点」积攒点滴", false);
// ü 写法变体
check("lvcha 绿茶（ü=v）", "lvcha", "「绿茶」二字，清新治愈", false);
check("luecha 绿茶（ü=ue）", "luecha", "「绿茶」二字，清新治愈", false);
// 品牌好例（无「全拼」声明重放）
for (const [label, word] of [
  ["zhihu", "知乎"], ["xiaohongshu", "小红书"], ["douban", "豆瓣"],
  ["taobao", "淘宝"], ["baidu", "百度"], ["meituan", "美团"],
]) {
  check(`品牌回归 ${label}（无声明）`, label, `「${word}」国民级好记`, false);
}
// 部分拼音+英文混搭：单字引用（「」内 <2 字）不进校验，混搭 label 不受影响
check("yunhub 单字引用不触发", "yunhub", "「云」与 hub 结合，云端枢纽", false);
// 多引用词任一匹配即放行
check("多引用词任一匹配放行", "muzhou", "先想到「木船」，定名「木舟」更轻盈", false);

console.log("== C.「全拼」声明仍走严格校验（加严条件不放松）==");
// 声称全拼时首字母组合不算数：ymu 声称「云慕」全拼 → 拦截
check("声称全拼时首字母组合拦截", "ymu", "「云慕」双字全拼，云端仰慕", true);
// 历史坏例回归（R195/R218）
check("tangfang 探方（R195 坏例）", "tangfang", "「探方」双字全拼，探索方寸", true);
check("yuncu 云萃（R218 坏例）", "yuncu", "「云萃」双字全拼，云聚灵萃", true);
// 严格模式正常全拼放行
check("zhihu 知乎（声称全拼）", "zhihu", "「知乎」双字全拼，国民级好记", false);

console.log("== D. 表外字保守拒绝语义不变 ==");
check("表外字引用词（无声明）", "kuikui", "「㙓㙓」叠音好记", true);
check("混合引用（表外+匹配词）", "yunhe", "「㙓」不可判，「云禾」双字，云上禾苗", false);

console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
if (fail > 0) process.exit(1);
