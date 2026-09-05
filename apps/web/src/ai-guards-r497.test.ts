// R497（R494 审计 P2-1 / P2-2 / zh blend 2 字母 ASCII）：三条质量 guard 的正例/反例回归
import { describe, expect, it } from "vitest";
import { admitRuleCandidate, citesPhantomWord, newGuardStats, pinyinQuoteMismatch, zhCitesPhantomAscii, type AiTheme } from "./ai";

describe("pinyinQuoteMismatch：单字引用覆盖校验（R494 P2-1）", () => {
  it("反例：zhongao 只引「忠」，label 剩余 ao 无来源 → mismatch", () => {
    expect(pinyinQuoteMismatch("zhongao", "「忠」。")).toBe(true);
    expect(pinyinQuoteMismatch("zhongao", "「忠」诚可靠，寓意值得托付")).toBe(true);
  });

  it("正例：单字引用 + meaning 点名的英文片段共同覆盖 label（yunhub）→ 放行", () => {
    expect(pinyinQuoteMismatch("yunhub", "「云」+ hub，云端枢纽")).toBe(false);
  });

  it("正例：多个单字引用逐字拼出 label（「忠」「安」→ zhongan）→ 放行", () => {
    expect(pinyinQuoteMismatch("zhongan", "取「忠」与「安」，忠诚安稳")).toBe(false);
  });

  it("正例：单字引用宽松模式允许首字母参与切分（「云」y + 「慕」mu → ymu）", () => {
    expect(pinyinQuoteMismatch("ymu", "「云」「慕」二字取首")).toBe(false);
  });

  it("正例：叠字候选（「咕」→ gugu）可重用同一读音切分", () => {
    expect(pinyinQuoteMismatch("gugu", "「咕」叠音，像小猫哼鸣")).toBe(false);
  });

  it("反例：单字引用声称全拼时不允许首字母凑数（「忠」「安」→ zan 声称全拼）", () => {
    expect(pinyinQuoteMismatch("zan", "「忠」「安」全拼")).toBe(true);
  });

  it("兼容：多字引用仍走原逻辑（全拼命中放行；对不上拒绝；声称全拼时严格）", () => {
    expect(pinyinQuoteMismatch("yunmu", "「云慕」全拼")).toBe(false);
    expect(pinyinQuoteMismatch("shuqi", "「漱石」")).toBe(true);
    expect(pinyinQuoteMismatch("ymu", "「云慕」全拼")).toBe(true);
    expect(pinyinQuoteMismatch("ymu", "「云慕」取首字母")).toBe(false);
  });

  it("兼容：无任何「」引用不判", () => {
    expect(pinyinQuoteMismatch("zhongao", "忠诚可靠")).toBe(false);
  });
});

describe("citesPhantomWord：`X + Y:` / `X × Y` 构词声明（R494 P2-2）", () => {
  it("反例：complainter 声称 commit + planner，label 无 commit 且剩余 plainter 拼不上 → 拒绝", () => {
    expect(citesPhantomWord("complainter", "commit + planner: a tool that turns intentions into enduring habits; starts with a quiet 'co'")).toBe(true);
  });

  it("反例：`X × Y：` 与句中 `X + Y:` 声明同样校验", () => {
    expect(citesPhantomWord("complainter", "commit × planner: turns intentions into habits")).toBe(true);
    expect(citesPhantomWord("complainter", "A blend, commit + planner: turns intentions into habits")).toBe(true);
  });

  it("正例：两词整词命中的合法 blend 放行（calmroot / trustloop / quietloop / firmhabit）", () => {
    expect(citesPhantomWord("calmroot", "calm + root: grounded steadiness")).toBe(false);
    expect(citesPhantomWord("trustloop", "trust + loop: a cycle of reliability")).toBe(false);
    expect(citesPhantomWord("quietloop", "quiet × loop: a gentle rhythm")).toBe(false);
    expect(citesPhantomWord("firmhabit", "firm+habit: habits that hold")).toBe(false);
  });

  it("正例：R246 合法词干截断（plan→planner 型：一词整词命中，另一词与剩余片段互为前缀）放行", () => {
    expect(citesPhantomWord("habitplan", "habit + planner: plan your habits")).toBe(false);
    expect(citesPhantomWord("verbloom", "verb + bloom: words that grow")).toBe(false);
  });

  it("正例：两词都只有片段命中但能切成「头词前缀 + 尾词前/后缀」（serenquil / serenell）放行", () => {
    expect(citesPhantomWord("serenquil", "serene + tranquil: calm on both ends")).toBe(false);
    expect(citesPhantomWord("serenell", "serenity + bell: a soft chime")).toBe(false);
  });

  it("反例：句首 X+Y 一词完全不存在（plan↔play）仍拒绝；句中无冒号的普通 a + b 不判", () => {
    expect(citesPhantomWord("playhub", "plan + hub: plan your day")).toBe(true);
    expect(citesPhantomWord("calmroot", "reads like calm plus rest + more nuance, no colon claim")).toBe(false);
  });
});

describe("zhCitesPhantomAscii：2 字母 ASCII 引用（R494 zh blend waofun）", () => {
  it("反例：waofun 引用 wo 为犬吠声，label 无 wo → 拒绝", () => {
    expect(zhCitesPhantomAscii("waofun", "对应「汪趣」，wo 为犬吠声，fun 趣味应和玩具，寓意狗伴玩乐值得托付")).toBe(true);
  });

  it("正例：2 字母串真实存在于 label（ai / yu）不受影响", () => {
    expect(zhCitesPhantomAscii("aiyu", "ai 取「爱」，yu 取「语」，爱的语言")).toBe(false);
    expect(zhCitesPhantomAscii("kaiyun", "ai 是开的韵尾，yun 云端")).toBe(false);
  });

  it("正例：常见英文缩略/虚词（AI / VR / of）与带变音符号拼音（xīng）里的字母片段不判", () => {
    expect(zhCitesPhantomAscii("mengxing", "面向 AI 创业者的 VR 品牌，xīng 取「星」")).toBe(false);
    expect(zhCitesPhantomAscii("mengxing", "AI 与 VR 时代的 go 工具，面向 3d 设计师")).toBe(false);
  });

  it("兼容：≥3 字母幻影引用仍拒绝，纯英文语境不判", () => {
    expect(zhCitesPhantomAscii("kinwalk", "kino 指尖溜过石板")).toBe(true);
    expect(zhCitesPhantomAscii("kinwalk", "kino means cinema in German")).toBe(false);
  });
});

describe("admitRuleCandidate：计数字段沿用 pinyinMismatch / phantomEtymology", () => {
  const admit = (c: { label: string; meaning: string; theme: AiTheme }, lang: "zh" | "en") => {
    const guard = newGuardStats();
    const out = admitRuleCandidate(c, lang, guard, new Set());
    return { out, dropped: guard.dropped };
  };

  it("zhongao → pinyinMismatch；waofun / complainter → phantomEtymology", () => {
    const a = admit({ label: "zhongao", meaning: "「忠」。", theme: "pinyin" }, "zh");
    expect(a.out).toBeNull();
    expect(a.dropped.pinyinMismatch).toBe(1);
    const b = admit({ label: "waofun", meaning: "对应「汪趣」，wo 为犬吠声，fun 趣味应和玩具", theme: "blend" }, "zh");
    expect(b.out).toBeNull();
    expect(b.dropped.phantomEtymology).toBe(1);
    const c = admit({ label: "complainter", meaning: "commit + planner: a tool that turns intentions into enduring habits", theme: "blend" }, "en");
    expect(c.out).toBeNull();
    expect(c.dropped.phantomEtymology).toBe(1);
  });

  it("合法拼音 / blend 候选 0 误杀", () => {
    expect(admit({ label: "yunmu", meaning: "「云慕」全拼，云端向往", theme: "pinyin" }, "zh").out).not.toBeNull();
    expect(admit({ label: "zhongan", meaning: "取「忠」与「安」，忠诚安稳", theme: "pinyin" }, "zh").out).not.toBeNull();
    expect(admit({ label: "yunhub", meaning: "「云」+ hub，云端枢纽", theme: "blend" }, "zh").out).not.toBeNull();
    expect(admit({ label: "calmroot", meaning: "calm + root: grounded steadiness for a habit tracker", theme: "blend" }, "en").out).not.toBeNull();
  });
});
