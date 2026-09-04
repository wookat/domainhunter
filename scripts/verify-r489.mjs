// R489 中文寓意→拼音/混搭规则降级路线自检脚本（独立 node 脚本，0 AI 调用，不触发 /api/ai-search）
// 用法：node scripts/verify-r489.mjs
// 覆盖：
//   A. 抽词：元词（寓意/科技感）停用；首选读音表让 茶叶/温暖/光明/健身 成根词；真多音字（长行）仍放弃；词表最长匹配去掉「境电」「慢生」碎片
//   B. 词表自洽：ZH_PREFERRED_READING / ZH_BRAND_CHARS 每个读音都在 R222 表内；行业 core 必是词中字且能取读音；en 短词 ≤ 6 字母
//   C. 语义组合：行业核心字 × 寓意字 双字短拼音、拼音+英文混搭；纯拼音组合全部过 checkPinyinLabel；禁忌音节不出现；近义字 meaning 如实标注
//   D. 排序与限额：根词仍在前两位；语义组合紧随根词；泛前后缀 ≤ 8 且仍各有代表；全部候选过 admitRuleCandidate（dropped=0）
//   E. R471 行为保持：en 输入 / 无词表命中的 zh 输入产出与旧路线一致（无语义组合时不限额）；排除集生效；上限 24
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.rule-r489-compiled.mjs");
await build({
  stdin: {
    contents:
      'export * from "./apps/web/src/rule-fallback"; export * from "./apps/web/src/rule-fallback-lexicon"; export { newGuardStats, checkPinyinLabel, pinyinReadingsOf } from "./apps/web/src/ai"; export { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./apps/web/src/lib/variants";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  outfile: tmp,
  logLevel: "silent",
});
const rule = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failed++;
    console.log(`FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  } else {
    console.log(`PASS ${name}`);
  }
};
const gen = (desc, lang = "zh", exclude = new Set()) => {
  const guard = rule.newGuardStats();
  const out = rule.generateRuleCandidates(desc, lang, guard, exclude);
  const dropped = Object.values(guard.dropped).reduce((a, b) => a + b, 0);
  return { out, guard, dropped, labels: out.map((c) => c.label) };
};
const roots = (desc) => rule.extractRuleRoots(desc).map((r) => r.text);

// ---------- A. 抽词 ----------
{
  check("A1 元词「寓意」不再成根词", roots("智能家居，科技感，寓意光明").includes("yuyi"), false);
  check("A1b 「科技感」不成根词/碎片", roots("智能家居，科技感，寓意光明").some((t) => /keji|jigan/.test(t)), false);
  check("A2 首选读音：茶叶(叶 ye/xie)→chaye", roots("茶叶电商，寓意清雅"), ["chaye", "dianshang", "qingya"]);
  check("A2b 首选读音：温暖/安心/光明/健身", [roots("温暖安心"), roots("光明"), roots("健身")], [["wennuan", "anxin"], ["guangming"], ["jianshen"]]);
  check("A3 真多音字仍 fail-closed（长行→0）", rule.extractPinyinRoots("长行").length, 0);
  check("A3b 表外字仍放弃（龘靐）", rule.extractPinyinRoots("龘靐工具").length, 0);
  check("A4 词表最长匹配：跨境电商 → 跨境+电商，无「境电」", roots("跨境电商，寓意远航"), ["kuajing", "dianshang", "yuanhang"]);
  check("A4b 慢生活 → 生活 成词，无「慢生」碎片", roots("咖啡馆，文艺，慢生活"), ["kafeiguan", "wenyi", "shenghuo"]);
  check("A4c 「工作室」为泛词不成根词", roots("健身工作室，活力向上").includes("gongzuoshi"), false);
  const sem = rule.analyzeZh("咖啡馆，文艺，慢生活");
  check("A4d 落单寓意字「慢」仍进入寓意字", sem.brands.map((b) => b.hanzi).includes("慢"), true);
  check("A5 R471 原断言：云端记账根词与汉字来源不变", rule.extractRuleRoots("面向中小商家的云端记账工具").map((r) => [r.text, r.hanzi]), [["yunduan", "云端"], ["jizhang", "记账"]]);
}

// ---------- B. 词表自洽 ----------
{
  const badPref = Object.entries(rule.ZH_PREFERRED_READING).filter(([ch, py]) => !(rule.pinyinReadingsOf(ch) ?? []).includes(py));
  check("B1 首选读音表每个读音都在 R222 表内", badPref, []);
  const badBrand = Object.entries(rule.ZH_BRAND_CHARS).filter(([ch, py]) => !(rule.pinyinReadingsOf(ch) ?? []).includes(py));
  check("B2 寓意字表每个读音都在 R222 表内", badBrand, []);
  const badTaboo = Object.values(rule.ZH_BRAND_CHARS).filter((py) => rule.ZH_TABOO_SYLLABLES.has(py));
  check("B2b 寓意字不含禁忌音节", badTaboo, []);
  const badCore = Object.entries(rule.ZH_INDUSTRY).filter(([w, e]) => e.core && (!w.includes(e.core) || rule.charReading(e.core) === null));
  check("B3 行业 core 必是词中字且可取读音", badCore, []);
  const badEn = Object.entries(rule.ZH_INDUSTRY).filter(([, e]) => e.en.some((x) => !/^[a-z]{2,6}$/.test(x)));
  check("B4 行业短英文 2–6 小写字母", badEn, []);
  const badSyn = Object.entries(rule.ZH_MEANING_SYNONYMS).filter(([, chs]) => chs.some((ch) => !(ch in rule.ZH_BRAND_CHARS)));
  check("B5 近义寓意字都在寓意字表内", badSyn, []);
  check("B6 charReading：单读音直接取、首选表放行、其余多音字放弃", [rule.charReading("云"), rule.charReading("叶"), rule.charReading("长"), rule.charReading("龘")], ["yun", "ye", null, null]);
}

// ---------- C. 语义组合 ----------
{
  const { out, labels, dropped } = gen("茶叶电商，寓意清雅");
  check("C1 行业核心字×寓意字双字短拼音（chaya/yacha）", ["chaya", "yacha"].every((l) => labels.includes(l)), true);
  check("C1b 拼音+行业英文混搭（chatea/teacha/yatea）", ["chatea", "teacha", "yatea"].every((l) => labels.includes(l)), true);
  check("C1c 无「寓意」元词候选", labels.some((l) => l.includes("yuyi")), false);
  const chaya = out.find((c) => c.label === "chaya");
  check("C1d 双字组合 meaning 如实标注两字来源", /「茶」拼音 cha \+ 「雅」拼音 ya/.test(chaya.meaning) && /规则生成/.test(chaya.meaning), true);
  check("C1e 双字组合评分高于泛前后缀", chaya.scores.brandability > out.find((c) => c.label === "chayeapp").scores.brandability, true);
  const chatea = out.find((c) => c.label === "chatea");
  check("C1f 混搭 meaning 标注英文来源", /「茶」拼音 cha \+ 英文 tea/.test(chatea.meaning), true);
  check("C1g theme=rule、防线 0 丢弃", [new Set(out.map((c) => c.theme)).size === 1 && out[0].theme === "rule", dropped], [true, 0]);

  const pet = gen("宠物用品，活泼");
  const yue = pet.out.find((c) => c.label === "chongyue");
  check("C2 近义寓意字（活泼→悦）参与组合且 meaning 标注近义", yue !== undefined && /寓意「活泼」的近义字「悦」拼音 yue/.test(yue.meaning), true);
  check("C2b 「用品」不产出「品」寓意字", pet.labels.some((l) => /pin/.test(l)), false);

  // 纯拼音组合全部过 checkPinyinLabel；禁忌音节不出现
  const inputs = ["茶叶电商，寓意清雅", "宠物用品，活泼", "母婴用品品牌，寓意温暖安心", "少儿编程教育，寓意启蒙智慧", "健身工作室，活力向上", "智能家居，科技感，寓意光明"];
  let pyBad = [];
  let tabooHit = [];
  for (const d of inputs) {
    for (const c of gen(d).out) {
      if (!/英文|前缀|后缀/.test(c.meaning) && !rule.checkPinyinLabel(c.label).ok) pyBad.push(c.label);
      const quoted = [...c.meaning.matchAll(/「([^」]+)」拼音 ([a-z]+)/g)];
      if (quoted.some((m) => m[1].length === 1 && rule.ZH_TABOO_SYLLABLES.has(m[2]))) tabooHit.push(c.label);
    }
  }
  check("C3 纯拼音候选全部过 checkPinyinLabel", pyBad, []);
  check("C3b 单字组合不含禁忌音节", tabooHit, []);

  const en = gen("茶叶电商，寓意清雅", "en");
  const enChaya = en.out.find((c) => c.label === "chaya");
  check("C4 en 界面 meaning 纯 ASCII", enChaya !== undefined && /^Rule-based: formed from pinyin "cha" \+ pinyin "ya"/.test(enChaya.meaning), true);
  const semDrafts = rule.enumerateSemanticDrafts(rule.analyzeZh("面向中小商家的云端记账工具"), []);
  check("C5 语义组合上限 12、云端记账 → yunzhang/yuncloud", [semDrafts.length <= 12, semDrafts.some((d) => d.label === "yunzhang"), semDrafts.some((d) => d.label === "yuncloud")], [true, true, true]);
}

// ---------- D. 排序与限额 ----------
{
  const { labels, out, dropped } = gen("面向中小商家的云端记账工具");
  check("D1 根词仍在前两位（R471 A4e）", labels.slice(0, 2), ["yunduan", "jizhang"]);
  check("D1b 语义组合紧随根词", labels[2], "yunzhang");
  const affix = out.filter((c) => /前缀|后缀/.test(c.meaning));
  check("D2 泛前后缀 ≤ 8", affix.length <= rule.RULE_FALLBACK_MAX_AFFIX, true);
  check("D2b 限额内前缀/后缀各有代表（R471 A4g/A4h）", [labels.includes("yunduanapp"), rule.VARIANT_PREFIXES.some((p) => labels.includes(p + "yunduan"))], [true, true]);
  check("D2c 长拼接仍保留（R471 A4f）", labels.includes("yunduanjizhang") || labels.includes("jizhangyunduan"), true);
  check("D3 上限 24、去重、0 丢弃", [labels.length, new Set(labels).size, dropped], [24, 24, 0]);
  const scores = out.map((c) => c.scores);
  check("D4 分数在 0–100", scores.every((s) => Object.values(s).every((v) => v >= 0 && v <= 100)), true);
  const home = gen("智能家居，科技感，寓意光明");
  check("D5 「智能/科技感」只贡献寓意字（智）不成根词：zhijia/zhihome 出现", ["zhijia", "zhihome"].every((l) => home.labels.includes(l)), true);
  const affixShare = (labels) => labels.filter((l) => rule.VARIANT_SUFFIXES.some((s) => l.endsWith(s)) || rule.VARIANT_PREFIXES.some((p) => l.startsWith(p))).length / labels.length;
  check("D6 智能家居 输入泛前后缀占比 < 50%（R489 前 8/9）", affixShare(home.labels) < 0.5, true);
}

// ---------- E. R471 行为保持 ----------
{
  const en = gen("A note taking app for developers", "en");
  check("E1 en 输入无语义组合：根词+短拼接+全部前后缀（旧路线）", [en.labels.slice(0, 2), en.labels.includes("notetaking"), en.labels.filter((l) => l.endsWith("app")).length], [["note", "taking"], true, 3]);
  const plain = gen("龘靐工具", "zh");
  check("E2 无根词 → 0 候选", plain.labels.length, 0);
  const excl = gen("茶叶电商，寓意清雅", "zh", new Set(["chaye", "chaya"]));
  check("E3 排除集生效", ["chaye", "chaya"].some((l) => excl.labels.includes(l)), false);
  const noLex = gen("暮雨黄昏", "zh");
  const noLexAffix = noLex.out.filter((c) => /前缀|后缀/.test(c.meaning)).length;
  check("E4 无词表命中的 zh 输入走旧路线（2 根词 + 2 拼接 + 16 泛变体不限额）", [noLex.labels.slice(0, 2), noLexAffix, noLex.labels.length], [["muyu", "huanghun"], 16, 20]);
}

console.log(failed ? `\n${failed} FAILED` : "\nALL PASS");
process.exit(failed ? 1 : 0);
