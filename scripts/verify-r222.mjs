// R222 拼音引用校验自检脚本（无测试框架，独立 node 脚本，0 AI 调用）
// 用法：node scripts/verify-r222.mjs
// 覆盖 R218 审计 P2-1：扩表（GB2312 全集）+ 表外字保守拒绝。
// 用例来源：R218 审计报告（docs/qa/ai-audit-r218.md）zh1/zh2/ref2 场景留档候选 + 构造用例。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r222-compiled.mjs");
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

console.log("== A. R218 审计坏例（扩表后必须拦截）==");
// zh1 yuncu「云萃」：萃=cui，拼接 yuncui ≠ yuncu，旧表因 萃 表外放行 → 现在必须拦
check("yuncu 云萃（P2-1 主坏例）", "yuncu", "「云萃」双字全拼，云聚灵萃，声调上扬好记", true);
// R195 历史坏例回归（原防线已拦，不得回归）
check("tangfang 探方（R195 坏例）", "tangfang", "「探方」双字全拼，探索方寸", true);
check("sanvei 山味（R195 坏例）", "sanvei", "「山味」全拼，山野之味", true);
// 构造：新收录字拼写错配也要拦（杼=zhu/shu，chu 错配）
check("yechu 夜杼（声称全拼时）", "yechu", "「夜杼」双字全拼，夜织如杼", true);

console.log("== B. 表外字（GB2312 外生僻字）保守拒绝 ==");
// 㙓（U+3653，GB2312 外）：无法判断读音，声称全拼 → 保守拒绝
check("表外字引用词", "kuikui", "「㙓㙓」双字全拼，叠音好记", true);
// 混合引用：一个含表外字、另一个可判且匹配 → 放行（任一匹配即放行语义不变）
check("混合引用（表外+匹配词）", "yunhe", "「㙓」不可判，「云禾」双字全拼，云上禾苗", false);

console.log("== C. 表内多音字/ü/正常候选（零误杀红线）==");
// 多音字：攒 zan/cuan，任一读音放行（ref2 留档 cuandian「攒点」）
check("cuandian 攒点（多音字）", "cuandian", "「攒点」双字全拼，攒下每一点", false);
check("zandian 攒点（另一读音）", "zandian", "「攒点」双字全拼，积攒点滴", false);
// ü 写法：绿 lv → lv/lue/lu 三种域名写法都放行
check("lvcha 绿茶（ü=v）", "lvcha", "「绿茶」双字全拼，清新治愈", false);
check("luecha 绿茶（ü=ue）", "luecha", "「绿茶」双字全拼，清新治愈", false);
check("lucha 绿茶（ü=u）", "lucha", "「绿茶」双字全拼，清新治愈", false);
// 知名品牌全拼回归
for (const [label, word] of [
  ["zhihu", "知乎"], ["xiaohongshu", "小红书"], ["douban", "豆瓣"],
  ["taobao", "淘宝"], ["baidu", "百度"], ["meituan", "美团"],
]) {
  check(`品牌回归 ${label}`, label, `「${word}」全拼，国民级好记`, false);
}
// R244：未声称「全拼」也做弱声称校验——yuncu 无法由 云/萃 的全拼或首字母组合拼出 → 拦截
check("未声称全拼也拦错配（R244）", "yuncu", "「云萃」取云与萃首拼混合，意象空灵", true);
// 弱声称下合法「取字首」组合放行（云 y + 萃 cui = ycui）
check("未声称全拼·首字母组合放行（R244）", "ycui", "「云萃」取云字首与萃拼音组合，意象空灵", false);

console.log("== D. R218 zh1/zh2/ref2 留档正常候选离线回放（0 误杀）==");
// 审计报告留档的 pinyin 系正常候选（「」引用 + 全拼句式重放）
const replay = [
  ["moyu", "墨雨"], ["moxu", "墨叙"], ["cencun", "岑存"], ["zazhi", "杂志"],
  ["yaolan", "摇篮"], ["zhizhou", "知舟"], ["heyue", "和悦"], ["xinghe", "星河"],
  ["muzhou", "木舟"], ["chali", "茶里"], ["shuyou", "书友"], ["biji", "笔记"],
  ["yuedu", "阅读"], ["jingxin", "静心"], ["manshenghuo", "慢生活"],
  ["chayuan", "茶园"], ["heshan", "禾山"], ["yunqi", "云起"], ["susheng", "素生"],
  ["wenzhai", "文摘"], ["shuzhai", "书斋"], ["moxiang", "墨香"], ["chaxi", "茶溪"],
];
let replayKilled = 0;
for (const [label, word] of replay) {
  const got = pinyinQuoteMismatch(label, `「${word}」双字全拼，寓意贴合`);
  if (got) {
    replayKilled++;
    fail++;
    console.error(`  FAIL 误杀：${label}「${word}」被判 mismatch`);
  } else {
    pass++;
  }
}
console.log(`  回放 ${replay.length} 条，误杀 ${replayKilled} 条`);

console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
if (fail > 0) process.exit(1);
