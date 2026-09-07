// R496 自检脚本（R494 审计 P1-1 修复，无测试框架，0 AI 调用）
// 用法：node scripts/verify-r496.mjs
// A. 对标注集 scripts/fixtures/zh-meaning-labels.json 离线回放 zhMeaningIncoherent：
//    输出精确率/召回率/误杀清单（coherent 被拦必须为 0 条），R494 六条沙拉必须全拦
// B. admitCandidate 端到端：zh 沙拉候选计入 guard.dropped.zhMeaningIncoherent、内容不出现在结果；
//    en 场景不触发；规则降级候选（theme=rule）不判
// C. refine 轮 zh prompt 含 coined 格式约束 + 2 条好例；en prompt 不含；候选数配额不变
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r496-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmp });
const { zhMeaningIncoherent, enMeaningIncoherent, generateAiCandidates, newGuardStats, guardDroppedTotal, admitRuleCandidate } = await import(tmp);
rmSync(tmp);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : `  (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`}`);
};

// ---------- A. 标注集回放 ----------
console.log("== A. 标注集回放 ==");
const { items } = JSON.parse(readFileSync(path.join(root, "scripts/fixtures/zh-meaning-labels.json"), "utf8"));
const R494_SALAD = ["miaoround", "moggity", "miafbab", "gurgulu", "voralini", "hapany"];
let tp = 0, fn = 0, fpList = [], blHit = 0, blTotal = 0;
for (const it of items) {
  const hit = zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme });
  if (it.tag === "salad") hit ? tp++ : fn++;
  else if (it.tag === "coherent") { if (hit) fpList.push(it); }
  else { blTotal++; if (hit) blHit++; }
}
const salad = items.filter((i) => i.tag === "salad").length;
const coherent = items.filter((i) => i.tag === "coherent").length;
const precision = tp + fpList.length ? tp / (tp + fpList.length) : 0;
console.log(`  标注集 ${items.length} 条：salad ${salad} / coherent ${coherent} / borderline ${blTotal}`);
console.log(`  TP ${tp} / FP ${fpList.length} / FN ${fn}  精确率 ${(precision * 100).toFixed(0)}%  召回率 ${((tp / salad) * 100).toFixed(0)}%  误杀率 ${((fpList.length / coherent) * 100).toFixed(1)}%  borderline 命中 ${blHit}/${blTotal}`);
for (const it of fpList) console.log(`  误杀：${it.label} | ${it.meaning}`);
check("A1 coherent 误杀 0 条", fpList.length, 0);
for (const label of R494_SALAD) {
  const it = items.find((i) => i.label === label && i.tag === "salad");
  check(`A2 R494 沙拉全拦：${label}`, zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme }), true);
}
const shortSalad = items.filter((i) => i.tag === "salad" && !R494_SALAD.includes(i.label));
console.log(`  已知漏网（短句沙拉，结构规则无法识别，见 docs/research/zh-meaning-coherence.md §2）：${shortSalad.map((i) => `${i.label}「${i.meaning}」`).join("；")}`);
// R496–R499 生产复验（docs/audits/r496-r499）新增 3 条 refine 轮短句沙拉（maoga/tuoguo/zora，20–35 汉字、无比喻链）：
// 均为 ≤40 字格式约束下的「来源编造/语义不成立」形态，结构规则不覆盖，作为已知 FN 留档供下一轮取样论证
check("A3 FN 全部为短句沙拉（≤40 汉字，非长从句形态）", shortSalad.every((i) => (i.meaning.match(/[\u4e00-\u9fff]/g) ?? []).length <= 40), true);
// fail-closed 边界：长而平实（无比喻/叙事词）的说明句不拦；规则模板句不拦
check("A4 长平实句不拦（无比喻词）", zhMeaningIncoherent("kuaila", "「快啦」kuaila，快是立刻分享喜悦的迫不及待，啦是融化在舌尖的活泼尾音，名字本身就带着零食递到宠物嘴边的雀跃语气，这句话再加十个字也不该被拦。"), false);
check("A5 「一般」不算比喻词", zhMeaningIncoherent("x", "这个名字一般来说中文创业者在三秒之内就能完整读出来并且记住它的意思和来源，读音平稳。"), false);
check("A6 theme=rule 不判", zhMeaningIncoherent("x", "规则生成：由 「云端」拼音 yunduan + 英文 hub 组成，非 AI 寓意，像一条被系统正在讲述的演绎传奇般的超长句子用于测试兜底路径的边界情况", { theme: "rule" }), false);
check("A7 EN 防线不受影响：besowith 仍拦", enMeaningIncoherent("besowith", "be so with suggests being exactly where they need it already carried and that reading brought whole on first try"), true);

// ---------- B. admitCandidate 端到端（mock fetch，0 AI 调用） ----------
console.log("== B. admitCandidate 端到端 ==");
const saladItem = items.find((i) => i.label === "hapany");
const goodItem = items.find((i) => i.label === "kakawo");
const llmResponse = (candidates) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(candidates) } }] }),
});
const realFetch = globalThis.fetch;
let lastBody = null;
const mockFetch = (candidates) => {
  globalThis.fetch = async (_url, init) => {
    lastBody = JSON.parse(init.body);
    return llmResponse(candidates);
  };
};
const scores = { length: 80, readability: 80, relevance: 80, brandability: 80 };
{
  const guard = newGuardStats();
  mockFetch([
    { label: saladItem.label, meaning: saladItem.meaning, theme: "coined", scores },
    { label: goodItem.label, meaning: goodItem.meaning, theme: "coined", scores },
  ]);
  const out = await generateAiCandidates("宠物用品跨境电商", "k", { lang: "zh", guard });
  check("B1 zh 沙拉计入 dropped.zhMeaningIncoherent", guard.dropped.zhMeaningIncoherent, 1);
  check("B2 沙拉候选不出现在结果", out.some((c) => c.label === "hapany"), false);
  check("B3 连贯候选保留", out.map((c) => c.label), ["kakawo"]);
  check("B4 guardDroppedTotal 计入新字段（前端「本轮过滤 N 个」）", guardDroppedTotal(guard), 1);
  check("B5 序列化 guard 不含候选内容", JSON.stringify(guard).includes("hapany") || JSON.stringify(guard).includes("睡袍"), false);
}
{
  const guard = newGuardStats();
  // en 场景：含多个长从句与 like/as 比喻的正常英文寓意，不应被 zh 防线误拦（zh 防线只数汉字且仅 lang=zh 生效）
  mockFetch([{ label: "habitloop", meaning: "habit + loop: a daily streak that keeps pulling you back, like a metronome for routine; reads as two plain words", theme: "coined", scores }]);
  const out = await generateAiCandidates("habit tracker", "k", { lang: "en", guard });
  check("B6 en 场景不触发 zh 防线", [guard.dropped.zhMeaningIncoherent, out.map((c) => c.label)], [0, ["habitloop"]]);
}
{
  const guard = newGuardStats();
  const cand = admitRuleCandidate({ label: "yunduanhub", meaning: "规则生成：由 「云端」拼音 yunduan + 英文 hub 组成，非 AI 寓意", scores: {} }, "zh", guard, new Set());
  check("B7 规则降级候选放行", [cand?.label, guard.dropped.zhMeaningIncoherent], ["yunduanhub", 0]);
}

// ---------- C. refine 轮 prompt ----------
console.log("== C. refine 轮 prompt ==");
const capture = async (lang) => {
  mockFetch([]);
  await generateAiCandidates("宠物用品跨境电商，主打猫狗零食与玩具", "k", {
    lang,
    round: 2,
    feedback: { tried: ["fluffnest", "petnuzzle"], taken: [], takenThemes: {}, disliked: [{ label: "fluffnest", theme: "coined" }] },
  });
  return lastBody;
};
const zhBody = await capture("zh");
const zhUser = zhBody.messages.find((m) => m.role === "user").content;
check("C1 zh refine prompt 含 coined 格式硬约束", zhUser.includes("coined/blend 造词路线 meaning 格式硬约束") && zhUser.includes("≤40 字"), true);
check("C2 含「音节来源 + 一句品牌联想」两段结构与连环比喻禁令", zhUser.includes("音节来源") && zhUser.includes("一句品牌联想") && zhUser.includes("禁止连环比喻"), true);
check("C3 含 2 条好例", (zhUser.match(/^- \w+：/gm) ?? []).length >= 2, true);
check("C4 候选数配额不变（24）", zhUser.includes("请给出 24 个候选"), true);
check("C5 R250 点踩硬禁令仍在 hint 最前", zhUser.indexOf("【最高优先级硬禁令") < zhUser.indexOf("coined/blend 造词路线"), true);
const enBody = await capture("en");
const enUser = enBody.messages.find((m) => m.role === "user").content;
check("C6 en refine prompt 不含 zh 约束", enUser.includes("造词路线 meaning 格式硬约束"), false);
// 好例自身必须过全部 zh 防线（否则模型照抄也会被拦）
for (const [label, meaning] of [
  ["woofable", "woof 是狗叫声，able 是“能够”的英文后缀，寓意每只狗都值得好好对待，读来轻快好记。"],
  ["mochacat", "mocha 是摩卡的柔和奶色，cat 是猫，寓意像摩卡一样温柔的猫咪伙伴，两词直拼好读。"],
]) {
  const guard = newGuardStats();
  mockFetch([{ label, meaning, theme: "coined", scores }]);
  const out = await generateAiCandidates("宠物", "k", { lang: "zh", guard });
  check(`C7 few-shot 好例过全部防线：${label}`, [out.map((c) => c.label), guardDroppedTotal(guard)], [[label], 0]);
}
globalThis.fetch = realFetch;

if (failed > 0) {
  console.error(`\n${failed} case(s) FAILED`);
  process.exit(1);
}
console.log("\nall cases passed");
