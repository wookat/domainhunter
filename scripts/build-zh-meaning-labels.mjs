// R496 标注集构建脚本（0 AI 调用）：把 docs/audits/r494/ai-search-0{1..6}.ndjson 的全部 zh 候选
// （pinyin/blend/coined/word）+ 历史审计/回归脚本留存的 zh 候选抽出来，套上人工标注，
// 写成 scripts/fixtures/zh-meaning-labels.json。标注只在本文件维护（人工逐条读过），
// 重跑即可复现 fixture。
// 用法：node scripts/build-zh-meaning-labels.mjs
//
// label 取值：
//   coherent   母语者一眼看懂的通顺寓意（允许平淡/牵强，但成句）
//   salad      整段词语沙拉 / 不成句 / 比喻链断裂（R494 §4.2 定义）
//   borderline 个别短语拗口但整体能懂（不计入精确率/召回率分母，单列观察）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ---------- 1. R494 生产留档：人工标注（默认 coherent，下面两张表覆盖） ----------
const R494_SALAD = new Set(["miaoround", "moggity", "miafbab", "gurgulu", "voralini", "hapany"]);
const R494_BORDERLINE = new Set([
  "xiwo", // 「喜是愿化作欢心的欢腾，窝是渺小的恰恰归宿」两个分句拗口，后半句能懂
  "tuanwan", // 「团体贴宠物蜷缩依偎」少字/语序乱，其余分句通顺
  "pilloway", // 三段比喻堆叠（枕头/脚步/铺床牵手）但每句都成句，冗长
]);

const out = [];
for (let i = 1; i <= 6; i++) {
  const rel = `docs/audits/r494/ai-search-0${i}.ndjson`;
  const lines = fs.readFileSync(path.join(root, rel), "utf8").split("\n").filter(Boolean);
  const req = JSON.parse(lines[0])._request;
  if (req.lang !== "zh") continue;
  const isRefine = /我不喜欢这些名字|风格微调偏好|请避开/.test(req.description);
  for (const l of lines.slice(1)) {
    const o = JSON.parse(l);
    if (o.type !== "proposed") continue;
    for (const it of o.items ?? []) {
      out.push({
        source: rel,
        round: o.round,
        refine: isRefine,
        description: req.description.split("\n")[0],
        label: it.label,
        theme: it.theme,
        meaning: it.meaning,
        tag: R494_SALAD.has(it.label) ? "salad" : R494_BORDERLINE.has(it.label) ? "borderline" : "coherent",
      });
    }
  }
}

// ---------- 2. 历史审计 / 回归脚本留存 zh 候选（文本原样，来源见 source） ----------
const hist = (source, theme, rows, tag = "coherent", extra = {}) => {
  for (const [label, meaning] of rows) out.push({ source, round: null, refine: extra.refine ?? false, description: extra.description ?? "", label, theme, meaning, tag });
};

// R239 审计 ref2 三个幻影 ASCII 坏例（docs/qa/audit-r239.md §3.1/§3.2；已由 zhCitesPhantomAscii 拦截）
hist("docs/qa/audit-r239.md", "coined", [["tibeirock", "tedeck 落音笃定，岩茶山场的沉稳气息扑面而来"], ["kinwalk", "kino 指尖溜过石板，轻快的散步节奏感"]], "coherent", { refine: true });
hist("docs/qa/audit-r239.md", "pinyin", [["duanyou", "「韫岩」藏玉于岩，wrin 前缀强调直结声"]], "salad", { refine: true });
// R196 连贯性红线里引用的 R195 生产碎片句（apps/web/src/ai.ts buildRefineHint）
hist("apps/web/src/ai.ts#buildRefineHint", "coined", [["youse", "带给幼想出格的好奇色彩"]], "salad", { refine: true });
// R244 P2-1 拼音错配坏例（句子本身成句，由 pinyinQuoteMismatch 拦截）
hist("scripts/verify-r244.mjs", "pinyin", [
  ["shuqi", "「漱石」二字取夏目漱石意象，文人枕流漱石之志"],
  ["pinen", "「品芩」双字，品味黄芩草木清气"],
  ["yunmu", "「云慕」二字，云端仰慕之意"],
  ["ym", "「云慕」取二字首字母，极短好记"],
  ["ymu", "「云慕」取云字首与慕拼音组合"],
  ["yunm", "「云慕」云拼音加慕字首"],
  ["zhh", "「知禾」取知的声母与禾字首"],
  ["yunhub", "「云」与 hub 结合，云端枢纽"],
  ["muzhou", "先想到「木船」，定名「木舟」更轻盈"],
]);
// R246 P2-4 好例（zhCitesPhantomAscii 放行集）
hist("scripts/verify-r246.mjs", "blend", [
  ["muzhou", "mu 取自「木」的质朴，zhou 取自「舟」的远行，寓意稳载"],
  ["plangrow", "plan 与 grow 结合，寓意计划中成长"],
  ["chapu", "chapu 读来干脆，如茶席铺陈，寓意茶事有序"],
  ["shanquan", "shan 取「山」之意，quan 如泉水清冽，寓意山泉入茶"],
  ["scirio", "sci 如科学探索，rio 取自 curious 的好奇尾音，寓意求知"],
  ["lumora", "lum 源自 latin lumen 的光，寓意清亮"],
  ["crousti", "源自法语 croustillant 的酥脆感，法式烘焙的招牌口感"],
  ["brioche", "法语 brioche 黄油面包，甜点店的经典符号"],
  ["yunji", "云集之意，cloud 般的聚合感，适合 saas 平台"],
  ["kuaidao", "「快到」谐音，配 app 后缀读来利落，寓意即刻送达"],
  ["yanxi", "「岩溪」意象，山场 tea 韵与溪流感，适合 com 后缀"],
  ["yancha", "「岩茶」全拼，山场气息扑面，正岩韵味"],
]);
// R245 带声调拼音好例
hist("scripts/verify-r245.mjs", "pinyin", [
  ["shanhe", "「山禾」shānhé，双字全拼，声调平仄相间，读一遍就记住"],
  ["botu", "「泊图」bótú，ō 与 ū 类长音开阔，寓意停泊与蓝图"],
  ["wenbu", "「稳步」wěnbù，ě 与 ù 声调沉稳，寓意步步扎实"],
  ["lvyu", "「绿屿」lǜyǔ，ǜ 音清亮，寓意一座绿色小岛，好读好记"],
]);
// R222/R196/R238 拼音引用与其它防线样本（句子本身成句）
hist("scripts/verify-r222.mjs", "pinyin", [
  ["yuncu", "「云萃」双字全拼，云聚灵萃，声调上扬好记"],
  ["ycui", "「云萃」取云字首与萃拼音组合，意象空灵"],
]);
hist("scripts/verify-r196.mjs", "pinyin", [
  ["tangfang", "「探方」双全拼，寓意探索方向"],
  ["muzhou", "「木舟」双字全拼，寓意稳载远行"],
  ["breza", "zo 取自 zone 的空间感，寓意清晨"],
]);
hist("scripts/verify-r238.mjs", "coined", [
  ["haoming", "寓意稳载远行，声调平缓，读一遍就能拼出来"],
  ["plangrow", "play 与 grow 结合，寓意边计划边成长"],
  ["hunhe", "这是一个混搭造词，融合了两种风格"],
  ["yiwen", "也许取自某个人名？寓意存疑"],
]);
// R218 审计留档正常 pinyin 候选（scripts/verify-r222.mjs §D 回放，全拼句式）
const r218 = [
  ["moyu", "墨雨"], ["moxu", "墨叙"], ["cencun", "岑存"], ["zazhi", "杂志"], ["yaolan", "摇篮"], ["zhizhou", "知舟"], ["heyue", "和悦"], ["xinghe", "星河"],
  ["muzhou", "木舟"], ["chali", "茶里"], ["shuyou", "书友"], ["biji", "笔记"], ["yuedu", "阅读"], ["jingxin", "静心"], ["manshenghuo", "慢生活"],
  ["chayuan", "茶园"], ["heshan", "禾山"], ["yunqi", "云起"], ["susheng", "素生"], ["wenzhai", "文摘"], ["shuzhai", "书斋"], ["moxiang", "墨香"], ["chaxi", "茶溪"],
];
hist("docs/qa/ai-audit-r218.md (via scripts/verify-r222.mjs §D)", "pinyin", r218.map(([l, w]) => [l, `「${w}」双字全拼，寓意贴合`]));
// 系统提示词 few-shot 好例 / 坏例（apps/web/src/ai.ts MEANING_REDLINES_ZH）
hist("apps/web/src/ai.ts#MEANING_REDLINES_ZH", "pinyin", [
  ["muzhou", "「木舟」muzhou，双字全拼，寓意稳载远行，声调平缓，读一遍就能拼出来"],
  ["muyuan", "「慕远」muyuan，mu 取「慕」的向往、yuan 取「远」的辽阔，寓意心怀远方，全拼顺口好记"],
  ["murory", "murory，可能是 mu(木?)+rory？也许取自某个人名（不太确定）"],
  ["muyuan", "「慕远」mu(慕:向往)加yuan【远】，寓意远行（大概）"],
]);
// 规则降级模板句（apps/web/src/rule-fallback.ts ruleMeaning，theme=rule 必须放行）
hist("apps/web/src/rule-fallback.ts#ruleMeaning", "rule", [
  ["yunduan", "规则生成：直接取描述中的「云端」拼音 yunduan，非 AI 寓意"],
  ["yunduanhub", "规则生成：由 「云端」拼音 yunduan + 英文 hub 组成，非 AI 寓意"],
  ["zhiyue", "规则生成：由 寓意「智慧」的近义字「智」拼音 zhi + 「悦」拼音 yue 组成，非 AI 寓意"],
]);

const counts = {};
for (const r of out) counts[r.tag] = (counts[r.tag] ?? 0) + 1;
const file = path.join(root, "scripts/fixtures/zh-meaning-labels.json");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify({ generatedBy: "scripts/build-zh-meaning-labels.mjs", total: out.length, counts, items: out }, null, 1) + "\n");
console.log(`wrote ${file}: ${out.length} items`, counts);
