import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { admitRuleCandidate, guardDroppedTotal, newGuardStats, zhMeaningIncoherent } from "./ai";

// R496（R494 P1-1）：zh coined 候选「寓意」词语沙拉防线。标注集与规则论证见
// docs/research/zh-meaning-coherence.md、scripts/fixtures/zh-meaning-labels.json（0 AI 调用）
interface LabeledItem {
  label: string;
  meaning: string;
  theme: string;
  tag: "coherent" | "salad" | "borderline";
}

const fixture = JSON.parse(readFileSync(path.join(__dirname, "../../../scripts/fixtures/zh-meaning-labels.json"), "utf8")) as { items: LabeledItem[] };
const R494_SALAD = ["miaoround", "moggity", "miafbab", "gurgulu", "voralini", "hapany"];

describe("zhMeaningIncoherent", () => {
  it("拦下 R494 全部 6 条生产沙拉", () => {
    for (const label of R494_SALAD) {
      const it = fixture.items.find((i) => i.label === label && i.tag === "salad")!;
      expect(it, label).toBeDefined();
      expect(zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme }), `${label}: ${it.meaning}`).toBe(true);
    }
  });

  it("标注集 182 条连贯寓意误杀 0 条（fail-closed）", () => {
    const coherent = fixture.items.filter((i) => i.tag === "coherent");
    expect(coherent.length).toBeGreaterThanOrEqual(150);
    const fp = coherent.filter((i) => zhMeaningIncoherent(i.label, i.meaning, { theme: i.theme }));
    expect(fp.map((i) => `${i.label}: ${i.meaning}`)).toEqual([]);
  });

  it("长而平实的说明句不拦：必须同时出现比喻/叙事引导词", () => {
    expect(
      zhMeaningIncoherent(
        "kuaila",
        "「快啦」kuaila，快是立刻分享喜悦的迫不及待，啦是融化在舌尖的活泼尾音，名字本身就带着零食递到宠物嘴边的雀跃语气，读起来轻快好记",
      ),
    ).toBe(false);
  });

  it("短句含比喻词不拦：「像」+ 短子句是正常寓意写法", () => {
    expect(zhMeaningIncoherent("mochacat", "mocha 是摩卡的柔和奶色，cat 是猫，寓意像摩卡一样温柔的猫咪伙伴，两词直拼好读。")).toBe(false);
    expect(zhMeaningIncoherent("chapu", "chapu 读来干脆，如茶席铺陈，寓意茶事有序")).toBe(false);
  });

  it("「一般」不算比喻词；ASCII 片段与标点不计入子句长度", () => {
    expect(zhMeaningIncoherent("x", "这个名字一般来说中文创业者在三秒之内就能完整读出来并且记住它的意思和来源，读音平稳。")).toBe(false);
    expect(zhMeaningIncoherent("x", "像 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!!!!!!!!!!!!!!!!!!!!!!!!! 好读")).toBe(false);
  });

  it("末段 ≥22 字叙事名词短语 + 比喻词 → 拦；同句拆成短分句后不拦", () => {
    const salad = "mog 取自 moggy（英式口语的猫），gity 带点俏皮尾音，整体感觉像一个伯爵先生正在柜台后端出鲸吞鲜食的宠与敬";
    expect(zhMeaningIncoherent("moggity", salad)).toBe(true);
    expect(zhMeaningIncoherent("moggity", "mog 取自 moggy（英式口语的猫），gity 带点俏皮尾音，整体像一位绅士猫，寓意把宠物当贵客招待")).toBe(false);
  });

  it("两段 ≥16 字比喻从句堆叠 → 拦", () => {
    expect(zhMeaningIncoherent("hapany", "ha 代表小家伙张嘴吐舌的哈哈气，pany 取自攀爬或丰盛的伙伴意料，两者睡袍般裹在一起正是一个愿意并肩也要鲜肴的半路结盟者")).toBe(true);
  });

  it("theme=rule 规则降级模板句不判，admitRuleCandidate 放行且不计数", () => {
    const long = "规则生成：由 「云端」拼音 yunduan + 英文 hub 组成，非 AI 寓意，像一条被系统正在讲述的演绎传奇般的超长句子用于测试兜底路径的边界情况";
    expect(zhMeaningIncoherent("yunduanhub", long, { theme: "rule" })).toBe(false);
    const guard = newGuardStats();
    const cand = admitRuleCandidate({ label: "yunduanhub", meaning: "规则生成：由 「云端」拼音 yunduan + 英文 hub 组成，非 AI 寓意", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } }, "zh", guard, new Set());
    expect(cand?.label).toBe("yunduanhub");
    expect(guard.dropped.zhMeaningIncoherent).toBe(0);
  });

  it("guard 计数含 zhMeaningIncoherent 字段并计入 guardDroppedTotal（前端「本轮过滤 N 个」）", () => {
    const guard = newGuardStats();
    expect(guard.dropped.zhMeaningIncoherent).toBe(0);
    guard.dropped.zhMeaningIncoherent = 3;
    expect(guardDroppedTotal(guard)).toBe(3);
    expect(Object.keys(guard.supplementDropped)).toContain("zhMeaningIncoherent");
  });
});
