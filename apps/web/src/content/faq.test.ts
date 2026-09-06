/**
 * R519：/tld /vs /guide FAQ 去复读。
 * 断言：答案形态（不再粘贴 intro / verdict / 列表拼接）、锚点真实存在于 SSR 正文、
 * 可见 FAQ 文本 = FAQPage JSON-LD 文本（逐字）、JSON-LD 仍是合法 FAQPage、页内句子复读率 < 5%。
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { FaqAnswer } from "../components/faq-answer";
import { buildCompareFaq, COMPARE_VERDICT_ANCHOR, comparePickAnchor } from "./compare-faq";
import { TLD_COMPARES } from "./compares";
import { faqJsonld, firstSentence, splitFaqAnswer, stripPeriod, type FaqItem } from "./faq";
import { buildGuideFaq, GUIDE_IDEAS_ANCHOR, GUIDE_PITFALLS_ANCHOR } from "./guide-faq";
import { INDUSTRY_GUIDES } from "./guides";
import { compareContentBlocks, faqAnswerHtml, guideContentBlocks, tldContentBlocks } from "./ssr-html";
import { buildTldFaq, TLD_NAMING_ANCHOR } from "./tld-faq";
import { TLD_GUIDES } from "./tlds";

type Lang = "zh" | "en";
const LANGS: Lang[] = ["zh", "en"];

/* ---- scripts/seo-audit/thin-analyze.mjs 的句子抽取 + dupSentenceRatio（同口径，供单测离线复算） ---- */
const decodeEntities = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");

function extractSentences(mainHtml: string): string[] {
  const h = mainHtml
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<\/(p|li|h[1-6]|summary|details|div|section|td|th|tr|dt|dd|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  return decodeEntities(h.replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .flatMap((l) => l.split(/(?<=[。！？!?；;])\s*|(?<=\.)\s+(?=[A-Z"“])/))
    .map((s) => s.trim())
    .filter((s) => s.replace(/[\s\p{P}]/gu, "").length >= 4)
    .map((s) => s.replace(/\s+/g, " "));
}

function dupRatio(sentences: string[]): { ratio: number; dups: string[] } {
  const seen = new Map<string, number>();
  for (const s of sentences) seen.set(s, (seen.get(s) ?? 0) + 1);
  const dups = [...seen.entries()].filter(([, n]) => n > 1).map(([s]) => s);
  return { ratio: sentences.length ? 1 - seen.size / sentences.length : 0, dups };
}

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, ""));

/** 从 SSR blocks 中取 FAQ <details> 的可见文本（问、答） */
function visibleFaq(blocks: string[]): { q: string; a: string }[] {
  const html = blocks.join("");
  return [...html.matchAll(/<details[^>]*><summary[^>]*>([\s\S]*?)<\/summary><p[^>]*>([\s\S]*?)<\/p><\/details>/g)].map((m) => ({
    q: stripTags(m[1]),
    a: stripTags(m[2]),
  }));
}

function parseFaqPage(json: string) {
  const data = JSON.parse(json) as {
    "@context": string;
    "@type": string;
    mainEntity: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[];
  };
  expect(data["@context"]).toBe("https://schema.org");
  expect(data["@type"]).toBe("FAQPage");
  expect(Array.isArray(data.mainEntity)).toBe(true);
  for (const e of data.mainEntity) {
    expect(e["@type"]).toBe("Question");
    expect(typeof e.name).toBe("string");
    expect(e.name.length).toBeGreaterThan(0);
    expect(e.acceptedAnswer["@type"]).toBe("Answer");
    expect(typeof e.acceptedAnswer.text).toBe("string");
    expect(e.acceptedAnswer.text.length).toBeGreaterThan(0);
    expect(e.acceptedAnswer.text).not.toMatch(/<[a-z]/i);
  }
  return data;
}

/** 断言 blocks 里存在 id="hash" 的元素，且 FAQ 答案里的 <a href="#hash"> 指向它 */
function expectAnchor(blocks: string[], item: FaqItem) {
  expect(item.link).toBeDefined();
  const hash = item.link!.hash;
  const html = blocks.join("");
  expect(html).toMatch(new RegExp(`<(h2|div|section) id="${hash}"`));
  expect(html).toContain(`<a href="#${hash}"`);
  expect((html.match(new RegExp(` id="${hash}"`, "g")) ?? []).length).toBe(1);
}

const SAMPLE_TLDS = ["com", "at", "cn", "io", "dev", "shop"];
const SAMPLE_CMPS = ["com-vs-cn", "com-vs-io", "de-vs-eu"];
const SAMPLE_GUIDES = ["saas", "coffee", "fintech"];

describe("faq helpers", () => {
  it("firstSentence：zh 按「。」、en 按「. 大写」切，保留句末标点", () => {
    expect(firstSentence("甲。乙。", "zh")).toBe("甲。");
    expect(firstSentence("A .com site. Try it.", "en")).toBe("A .com site.");
    expect(firstSentence("brand.io is short. Next", "en")).toBe("brand.io is short.");
  });
  it("stripPeriod 只去末尾句号", () => {
    expect(stripPeriod("abc.")).toBe("abc");
    expect(stripPeriod("a.b。")).toBe("a.b");
    expect(stripPeriod("abc")).toBe("abc");
  });
  it("splitFaqAnswer：按 label 最后一次出现切三段；无 link 返回 null", () => {
    expect(splitFaqAnswer({ q: "q", a: "x 见 A 一节" })).toBeNull();
    expect(splitFaqAnswer({ q: "q", a: "A 与 A 一节", link: { hash: "h", label: "A" } })).toEqual(["A 与 ", "A", " 一节"]);
    expect(splitFaqAnswer({ q: "q", a: "无", link: { hash: "h", label: "A" } })).toBeNull();
  });
  it("faqJsonld：合法 FAQPage，< 转义为 \\u003c，可直接内嵌 <script>", () => {
    const json = faqJsonld([{ q: "a<b?", a: "</script>x", link: { hash: "h", label: "x" } }]);
    expect(json).not.toContain("<");
    const data = parseFaqPage(json);
    expect(data.mainEntity).toHaveLength(1);
    expect(data.mainEntity[0].name).toBe("a<b?");
    expect(data.mainEntity[0].acceptedAnswer.text).toBe("</script>x");
    expect(json).not.toContain('"link"');
  });
  it("faqAnswerHtml 与 <FaqAnswer> 输出逐字一致（SSR 骨架 = React 首次渲染）", () => {
    const items: FaqItem[] = [
      { q: "q", a: "纯文本 & <b>" },
      { q: "q", a: "前 “Naming tips” 后", link: { hash: "naming", label: "Naming tips" } },
    ];
    for (const item of items) {
      const react = renderToStaticMarkup(createElement(FaqAnswer, { item }));
      expect(faqAnswerHtml(item)).toBe(react);
    }
    expect(faqAnswerHtml(items[1])).toContain('<a href="#naming" class="text-brand underline underline-offset-4 hover:opacity-80">Naming tips</a>');
  });
});

describe("buildTldFaq（/tld 去复读）", () => {
  it.each(SAMPLE_TLDS)(".%s：第 1 答为 1–3 句摘要且不含 intro；第 3 答为单句总结 + #naming 锚点", (tld) => {
    const guide = TLD_GUIDES[tld]!;
    for (const lang of LANGS) {
      const loc = guide[lang];
      const faq = buildTldFaq(tld, loc, lang);
      expect(faq).toHaveLength(3);
      const [who, , naming] = faq;
      expect(who.a).not.toContain(loc.intro);
      expect(who.a).not.toBe(loc.namingTips.join(" "));
      expect(who.a.startsWith(firstSentence(loc.metaDescription, lang))).toBe(true);
      const sentences = who.a.split(lang === "zh" ? /(?<=。)/ : /(?<=\.)\s+(?=[A-Z])/).filter((s) => s.trim());
      expect(sentences.length).toBeGreaterThanOrEqual(1);
      expect(sentences.length).toBeLessThanOrEqual(3);
      expect(naming.a).not.toBe(loc.namingTips.join(" "));
      expect(naming.a).toContain(stripPeriod(loc.namingTips[0]!));
      for (const tip of loc.namingTips.slice(1)) expect(naming.a).not.toContain(tip);
      expect(naming.link).toEqual({ hash: TLD_NAMING_ANCHOR, label: lang === "zh" ? "命名建议" : "Naming tips" });
      expect(splitFaqAnswer(naming)).not.toBeNull();
    }
  });
  it("全部 TLD × zh/en：3 问、答案非空、link.label 是答案子串、锚点 id 唯一", () => {
    for (const [tld, guide] of Object.entries(TLD_GUIDES)) {
      for (const lang of LANGS) {
        const faq = buildTldFaq(tld, guide[lang], lang);
        expect(faq).toHaveLength(3);
        for (const f of faq) {
          expect(f.a.trim().length).toBeGreaterThan(20);
          if (f.link) expect(f.a).toContain(f.link.label);
        }
        expect(faq[0].a).not.toContain(guide[lang].intro);
        expect(faq[2].a).not.toBe(guide[lang].namingTips.join(" "));
      }
    }
  });
});

describe("buildCompareFaq（/vs 去复读）", () => {
  it.each(SAMPLE_CMPS)("%s：第 1 答 ≠ verdict 且指向 #verdict；第 2/3 答为单句 + #pick-x 锚点", (slug) => {
    const cmp = TLD_COMPARES[slug]!;
    for (const lang of LANGS) {
      const loc = cmp[lang];
      const [which, a, b] = buildCompareFaq(cmp, lang);
      expect(which.a).not.toBe(loc.verdict);
      expect(which.a).not.toContain(loc.verdict);
      expect(which.link?.hash).toBe(COMPARE_VERDICT_ANCHOR);
      expect(a.a).not.toContain(loc.pickA.join(lang === "zh" ? "；" : "; "));
      expect(b.a).not.toContain(loc.pickB.join(lang === "zh" ? "；" : "; "));
      expect(a.a).toContain(stripPeriod(loc.pickA[0]!));
      expect(b.a).toContain(stripPeriod(loc.pickB[0]!));
      for (const p of loc.pickA.slice(1)) expect(a.a).not.toContain(p);
      for (const p of loc.pickB.slice(1)) expect(b.a).not.toContain(p);
      expect(a.link?.hash).toBe(comparePickAnchor(cmp.a));
      expect(b.link?.hash).toBe(comparePickAnchor(cmp.b));
      for (const f of [which, a, b]) expect(splitFaqAnswer(f)).not.toBeNull();
    }
  });
  it("全部对比 × zh/en：3 问、答案 ≠ verdict、link.label 是答案子串", () => {
    for (const cmp of Object.values(TLD_COMPARES)) {
      for (const lang of LANGS) {
        const faq = buildCompareFaq(cmp, lang);
        expect(faq).toHaveLength(3);
        expect(faq[0].a).not.toContain(cmp[lang].verdict);
        for (const f of faq) {
          expect(f.a.trim().length).toBeGreaterThan(20);
          expect(f.link).toBeDefined();
          expect(f.a).toContain(f.link!.label);
        }
      }
    }
  });
});

describe("buildGuideFaq（/guide 去复读；显式 faq 原样）", () => {
  it.each(SAMPLE_GUIDES)("%s：第 1 答不含 intro / 不拼接全部思路；第 3 答不拼接全部误区；锚点 #ideas / #pitfalls", (slug) => {
    const guide = INDUSTRY_GUIDES[slug]!;
    for (const lang of LANGS) {
      const loc = guide[lang];
      const [how, , mistakes] = buildGuideFaq(guide, lang);
      expect(how.a).not.toContain(loc.intro);
      expect(how.a).toContain(stripPeriod(loc.namingIdeas[0]!));
      for (const idea of loc.namingIdeas.slice(1)) expect(how.a).not.toContain(idea);
      expect(how.link?.hash).toBe(GUIDE_IDEAS_ANCHOR);
      expect(mistakes.a).not.toBe(loc.pitfalls.join(lang === "zh" ? "" : " "));
      expect(mistakes.a).toContain(stripPeriod(loc.pitfalls[0]!));
      for (const p of loc.pitfalls.slice(1)) expect(mistakes.a).not.toContain(p);
      expect(mistakes.link?.hash).toBe(GUIDE_PITFALLS_ANCHOR);
    }
  });
  it("显式 faq 的指南（合规类）原样返回、无 link", () => {
    const explicit = Object.values(INDUSTRY_GUIDES).filter((g) => g.zh.faq);
    expect(explicit.length).toBeGreaterThan(0);
    for (const g of explicit) {
      for (const lang of LANGS) {
        const faq = buildGuideFaq(g, lang);
        expect(faq).toEqual(g[lang].faq);
        for (const f of faq) expect(f.link).toBeUndefined();
      }
    }
  });
  it("全部指南 × zh/en：3 问、程序化答案的 link.label 是答案子串", () => {
    for (const g of Object.values(INDUSTRY_GUIDES)) {
      for (const lang of LANGS) {
        const faq = buildGuideFaq(g, lang);
        expect(faq.length).toBeGreaterThanOrEqual(3);
        for (const f of faq) if (f.link) expect(f.a).toContain(f.link.label);
      }
    }
  });
});

describe("SSR 正文：锚点真实存在，可见 FAQ 文本 = JSON-LD 文本，FAQPage 合法", () => {
  it.each(SAMPLE_TLDS)("/tld/%s", (tld) => {
    const guide = TLD_GUIDES[tld]!;
    for (const lang of LANGS) {
      const faq = buildTldFaq(tld, guide[lang], lang);
      const blocks = tldContentBlocks(tld, guide, lang);
      expectAnchor(blocks, faq[2]);
      const data = parseFaqPage(faqJsonld(faq));
      expect(data.mainEntity).toHaveLength(3);
      expect(visibleFaq(blocks)).toEqual(data.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })));
    }
  });
  it.each(SAMPLE_CMPS)("/vs/%s", (slug) => {
    const cmp = TLD_COMPARES[slug]!;
    for (const lang of LANGS) {
      const faq = buildCompareFaq(cmp, lang);
      const blocks = compareContentBlocks(cmp, lang);
      for (const f of faq) expectAnchor(blocks, f);
      const data = parseFaqPage(faqJsonld(faq));
      expect(data.mainEntity).toHaveLength(3);
      expect(visibleFaq(blocks)).toEqual(data.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })));
    }
  });
  it.each(SAMPLE_GUIDES)("/guide/%s", (slug) => {
    const guide = INDUSTRY_GUIDES[slug]!;
    for (const lang of LANGS) {
      const faq = buildGuideFaq(guide, lang);
      const blocks = guideContentBlocks(guide, lang);
      expectAnchor(blocks, faq[0]);
      expectAnchor(blocks, faq[2]);
      const data = parseFaqPage(faqJsonld(faq));
      expect(data.mainEntity).toHaveLength(3);
      expect(visibleFaq(blocks)).toEqual(data.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })));
    }
  });
  it("合规指南（显式 faq）正文不带 #pitfalls 锚点、JSON-LD 仍合法", () => {
    const g = Object.values(INDUSTRY_GUIDES).find((x) => x.kind === "compliance")!;
    for (const lang of LANGS) {
      const blocks = guideContentBlocks(g, lang);
      expect(blocks.join("")).not.toContain(`id="${GUIDE_PITFALLS_ANCHOR}"`);
      parseFaqPage(faqJsonld(buildGuideFaq(g, lang)));
    }
  });
});

describe("页内句子复读率（thin-analyze 口径）< 5%", () => {
  it("R512 样本页 /tld/com /tld/at /vs/com-vs-cn /guide/saas × zh/en", () => {
    const pages: [string, string[]][] = [];
    for (const lang of LANGS) {
      for (const tld of ["com", "at"]) pages.push([`/tld/${tld} ${lang}`, tldContentBlocks(tld, TLD_GUIDES[tld]!, lang)]);
      pages.push([`/vs/com-vs-cn ${lang}`, compareContentBlocks(TLD_COMPARES["com-vs-cn"]!, lang)]);
      pages.push([`/guide/saas ${lang}`, guideContentBlocks(INDUSTRY_GUIDES.saas!, lang)]);
    }
    for (const [name, blocks] of pages) {
      const { ratio, dups } = dupRatio(extractSentences(blocks.join("")));
      expect(ratio, `${name} dups: ${JSON.stringify(dups)}`).toBeLessThan(0.05);
    }
  });
  it("全部 /tld /vs /guide × zh/en（2524 页）每页 < 5%", () => {
    const ratios: number[] = [];
    for (const lang of LANGS) {
      for (const [tld, g] of Object.entries(TLD_GUIDES)) ratios.push(dupRatio(extractSentences(tldContentBlocks(tld, g, lang).join(""))).ratio);
      for (const c of Object.values(TLD_COMPARES)) ratios.push(dupRatio(extractSentences(compareContentBlocks(c, lang).join(""))).ratio);
      for (const g of Object.values(INDUSTRY_GUIDES)) ratios.push(dupRatio(extractSentences(guideContentBlocks(g, lang).join(""))).ratio);
    }
    expect(ratios.length).toBeGreaterThan(2000);
    expect(Math.max(...ratios)).toBeLessThan(0.05);
  });
});
