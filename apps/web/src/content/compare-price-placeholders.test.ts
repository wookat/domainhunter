/**
 * R549：/vs 正文价格与实时价格表同源守门（R545 体验走查 P1-2）。
 * 1) compares.ts verdict/pickA/pickB 不得再出现硬编码零售价（zh「NN 元」、en「¥NN」「$NN」、中文「两百元」等），
 *    只放行有官方原文的政策/事实金额（Verisign 批发价、ICANN 拍卖价、.ai 两年起注首笔 ≥ ¥1,000）；
 * 2) 所有 {{…}} 占位符必须可解析、只引用本页对比两侧、且两侧都有静态参考价（KV 无数据也不会渲染成「—」）；
 * 3) 占位符解析 / 渲染：实时价优先、静态回退加 ≈、缺价「—」、不合法占位原样保留；
 * 4) SSR compareContentBlocks 与客户端同用 renderPriceText + 同一份快照 → 正文数字与价格表单元格同值。
 * R563（R558 审计 P2-1）：metaDescription 纳入同一套守门（它同时是 meta description / Article 描述 / FAQ 第 1 答 / FAQPage JSON-LD 的来源）：
 * 5) metaDescription 无硬编码零售价；占位符合法、只引本页两侧；KV 无数据也能渲染（无 {{ 无「—」）；
 * 6) compareMetaDescription / buildCompareFaq 第 1 答 / SSR 可见 FAQ 三处同快照同值，且与价格表单元格同源。
 */
import { describe, expect, it } from "vitest";

import { toCny } from "../lib/currency";
import { tldPrice } from "../types";
import {
  PRICE_PLACEHOLDER_RE,
  parsePricePlaceholder,
  placeholderTlds,
  priceRow,
  renderPricePlaceholder,
  renderPriceText,
  type ComparePriceSnapshot,
} from "./compare-prices";
import { buildCompareFaq, compareMetaDescription } from "./compare-faq";
import { TLD_COMPARES } from "./compares";
import { faqJsonld, firstSentence } from "./faq";
import { compareContentBlocks, escapeHtml } from "./ssr-html";

const FETCHED_AT = Date.UTC(2026, 8, 6, 6, 0, 49);
/** 生产 /api/prices 2026-09-06 实测：com/io/ai 有实时价，cn 无（回退静态参考价） */
const LIVE: ComparePriceSnapshot = {
  live: { com: { registration: 11.08, renewal: 11.08 }, io: { registration: 28.12, renewal: 51.8 }, ai: { registration: 82.7, renewal: 82.7 } },
  fetchedAt: FETCHED_AT,
  stale: false,
};
const NO_DATA: ComparePriceSnapshot = { live: {}, fetchedAt: null, stale: true };

const FIELDS = ["verdict", "pickA", "pickB", "metaDescription"] as const;
const texts = (lang: "zh" | "en") =>
  Object.values(TLD_COMPARES).flatMap((c) => FIELDS.map((f) => ({ slug: c.slug, field: f, text: [c[lang][f]].flat().join("\n"), a: c.a, b: c.b })));

/** 硬编码零售价模式（与 scripts/verify-r549.mjs 一致） */
const HARD_CODED: Record<"zh" | "en", RegExp> = {
  zh: /\d[\d,]*\s*元(?!\/)|[一两三四五六七八九十]+百(?:多)?元|(?:¥|\$)\s?\d/g,
  en: /(?:¥|\$|US\$)\s?\d/g,
};
/** 放行的政策/事实金额（有官方原文，不随注册商零售价漂移） */
const FACT_ALLOW: RegExp[] = [
  /wholesale \$10\.26/g,
  /costs registrars \$10\.\d\d/g,
  /costs \$10\.91 a year/g,
  /first bill is at least ¥1,000/g,
  /for (?:US)?\$41(?:,501,000|\.5 million)/g,
  /\.web's \$135 million/g,
];
const EXPECTED_FACT_HITS = 13;

describe("compares.ts 正文不含硬编码零售价", () => {
  for (const lang of ["zh", "en"] as const) {
    it(`${lang}: verdict/pickA/pickB/metaDescription 无「NN 元 / ¥NN / $NN」等绝对价（政策/事实金额除外）`, () => {
      const offenders: string[] = [];
      let factHits = 0;
      for (const { slug, field, text } of texts(lang)) {
        let t = text;
        for (const re of FACT_ALLOW) t = t.replace(re, () => (factHits += 1, ""));
        for (const m of t.matchAll(HARD_CODED[lang])) offenders.push(`${slug} ${field}: …${t.slice(Math.max(0, m.index - 20), m.index + 20)}…`);
      }
      expect(offenders).toEqual([]);
      if (lang === "en") expect(factHits).toBe(EXPECTED_FACT_HITS);
    });
  }

  it("zh: 保留 .ai 两年起注/首笔一千元出头与 Verisign 批发价等政策事实", () => {
    expect(TLD_COMPARES["io-vs-ai"].zh.verdict).toContain("两年起注");
    expect(TLD_COMPARES["io-vs-ai"].zh.verdict).toContain("一千元出头");
    expect(TLD_COMPARES["com-vs-cn"].zh.verdict).toContain("批发价 10.26 美元/年");
    expect(TLD_COMPARES["io-vs-ai"].en.verdict).toContain("two-year minimum");
  });
});

describe("compares.ts 占位符全部合法且只引用本页两侧", () => {
  it("每个 {{…}} 都能解析；TLD ∈ {a, b} 且有静态参考价；无残留花括号", () => {
    const bad: string[] = [];
    let count = 0;
    for (const lang of ["zh", "en"] as const) {
      for (const { slug, field, text, a, b } of texts(lang)) {
        for (const m of text.matchAll(/\{\{[^}]*\}\}|\{|\}/g)) {
          const token = m[0];
          if (!token.startsWith("{{")) {
            bad.push(`${slug} ${lang} ${field}: 残留花括号 ${JSON.stringify(text.slice(Math.max(0, m.index - 10), m.index + 10))}`);
            continue;
          }
          count += 1;
          const ph = parsePricePlaceholder(token);
          if (!ph) {
            bad.push(`${slug} ${lang} ${field}: 不合法 ${token}`);
            continue;
          }
          for (const tld of placeholderTlds(ph)) {
            if (tld !== a && tld !== b) bad.push(`${slug} ${lang} ${field}: ${token} 引用了非本页 TLD .${tld}`);
            if (!tldPrice(tld)) bad.push(`${slug} ${lang} ${field}: ${token} .${tld} 无静态参考价`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
    expect(count).toBeGreaterThan(1000);
  });

  it("「X vs Y」两侧价格占位不得引用同一 TLD（R553 发现 win-vs-vip zh 写成 win vs win）", () => {
    const bad: string[] = [];
    for (const lang of ["zh", "en"] as const) {
      for (const { slug, field, text } of texts(lang)) {
        for (const m of text.matchAll(/\{\{price:([a-z0-9.-]+):[^}]*\}\}\s*vs\s*\{\{price:([a-z0-9.-]+):[^}]*\}\}/g)) {
          if (m[1] === m[2]) bad.push(`${slug} ${lang} ${field}: ${m[0]}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("单页 ccTLD-vs-com 中「大型 ccTLD 良心价」类描述 ccTLD 定价的句子不得引用 .com 占位（R553 P1：de-vs-com）", () => {
    for (const lang of ["zh", "en"] as const) {
      const v = TLD_COMPARES["de-vs-com"][lang].verdict;
      const sentence = v.split(lang === "zh" ? /[。；]/ : /(?<=[.;])\s+/).find((s) => /ccTLD 里的良心价|honest pricing for a major ccTLD/.test(s));
      expect(sentence, `${lang} 句子存在`).toBeTruthy();
      expect(sentence).toMatch(/\{\{price:de:first:usd\}\}/);
      expect(sentence).not.toMatch(/\{\{price:com:/);
    }
  });

  it("KV 无数据时所有页面正文仍可完整渲染（无「—」、无残留占位）", () => {
    for (const lang of ["zh", "en"] as const) {
      for (const { slug, field, text } of texts(lang)) {
        const out = renderPriceText(text, lang, NO_DATA);
        // 「—」在正文中也作破折号，故比较渲染前后个数：占位符不得渲染出新的「—」
        const dashes = (s: string) => s.split("—").length;
        expect(dashes(out), `${slug} ${lang} ${field}`).toBe(dashes(text));
        expect(out, `${slug} ${lang} ${field}`).not.toMatch(PRICE_PLACEHOLDER_RE);
      }
    }
  });
});

describe("parsePricePlaceholder", () => {
  it("八种形态各解析为对应结构", () => {
    expect(parsePricePlaceholder("{{price:io:first:cny}}")).toEqual({ kind: "price", tld: "io", field: "first", currency: "cny" });
    expect(parsePricePlaceholder("{{diff:io:com:renew:usd}}")).toEqual({ kind: "diff", a: "io", b: "com", field: "renew", currency: "usd" });
    expect(parsePricePlaceholder("{{ratio:io:com:renew}}")).toEqual({ kind: "ratio", a: "io", b: "com", field: "renew" });
    expect(parsePricePlaceholder("{{jump:xyz}}")).toEqual({ kind: "jump", tld: "xyz" });
    expect(parsePricePlaceholder("{{sum:com:cn:renew:cny}}")).toEqual({ kind: "sum", a: "com", b: "cn", field: "renew", currency: "cny" });
    expect(parsePricePlaceholder("{{pair:kr:jp:renew:usd}}")).toEqual({ kind: "pair", a: "kr", b: "jp", field: "renew", currency: "usd" });
    expect(parsePricePlaceholder("{{cost5:com.cn:cny}}")).toEqual({ kind: "cost", tld: "com.cn", years: 5, currency: "cny" });
    expect(parsePricePlaceholder("{{costdiff3:io:com:usd}}")).toEqual({ kind: "costdiff", a: "io", b: "com", years: 3, currency: "usd" });
  });

  it("形态不合法返回 null（未知 kind、参数个数/字段/货币错误、cost0、大写、空 TLD）", () => {
    for (const bad of [
      "{{price:io:first}}",
      "{{price:io:first:eur}}",
      "{{price:io:second:cny}}",
      "{{price:IO:first:cny}}",
      "{{price::first:cny}}",
      "{{diff:io:renew:usd}}",
      "{{ratio:io:com:renew:usd}}",
      "{{jump:io:first}}",
      "{{cost0:io:cny}}",
      "{{costdiff:io:com:cny}}",
      "{{total:io:com:cny}}",
      "{{price:io:first:cny}",
    ]) {
      expect(parsePricePlaceholder(bad), bad).toBeNull();
    }
  });
});

describe("renderPricePlaceholder / renderPriceText", () => {
  const ph = (s: string) => parsePricePlaceholder(s)!;

  it("price：实时价优先（美元取整、人民币 toCny 取整），zh「NN 元」/ en「¥NN」，不带 ≈", () => {
    expect(renderPricePlaceholder(ph("{{price:io:first:usd}}"), "zh", LIVE)).toBe("$28");
    expect(renderPricePlaceholder(ph("{{price:io:renew:cny}}"), "zh", LIVE)).toBe(`${toCny(51.8)} 元`);
    expect(renderPricePlaceholder(ph("{{price:io:renew:cny}}"), "en", LIVE)).toBe(`¥${toCny(51.8)}`);
    expect(renderPricePlaceholder(ph("{{price:com:renew:cny}}"), "en", LIVE)).toBe("¥80");
  });

  it("无实时价回退静态参考价并加 ≈（与价格表「参考价」同义）", () => {
    const cn = tldPrice("cn")!;
    expect(renderPricePlaceholder(ph("{{price:cn:first:cny}}"), "zh", LIVE)).toBe(`≈${cn.first} 元`);
    expect(renderPricePlaceholder(ph("{{price:cn:renew:cny}}"), "en", LIVE)).toBe(`≈¥${cn.renew}`);
    expect(renderPricePlaceholder(ph("{{price:com:first:cny}}"), "zh", NO_DATA)).toBe(`≈${tldPrice("com")!.first} 元`);
    // 一侧实时一侧静态 → 派生值也带 ≈
    expect(renderPricePlaceholder(ph("{{diff:com:cn:renew:cny}}"), "zh", LIVE)).toMatch(/^≈\d+ 元$/);
  });

  it("实时价与静态参考价都缺失 → 「—」（任一侧缺即整体「—」）", () => {
    expect(renderPricePlaceholder(ph("{{price:zzz:first:cny}}"), "zh", LIVE)).toBe("—");
    expect(renderPricePlaceholder(ph("{{ratio:com:zzz:renew}}"), "en", LIVE)).toBe("—");
    expect(renderPricePlaceholder(ph("{{cost5:zzz:usd}}"), "en", LIVE)).toBe("—");
  });

  it("diff/costdiff：无符号差额（方向由正文措辞给出）；sum：两侧之和；costN：首年 + (N−1) × 续费", () => {
    expect(renderPricePlaceholder(ph("{{diff:io:com:renew:usd}}"), "en", LIVE)).toBe(`$${Math.round(51.8 - 11.08)}`);
    expect(renderPricePlaceholder(ph("{{diff:com:io:renew:usd}}"), "en", LIVE)).toBe(`$${Math.round(51.8 - 11.08)}`);
    expect(renderPricePlaceholder(ph("{{diff:io:com:renew:cny}}"), "zh", LIVE)).toBe(`${Math.round(toCny(51.8) - toCny(11.08))} 元`);
    expect(renderPricePlaceholder(ph("{{sum:io:com:first:usd}}"), "en", LIVE)).toBe(`$${Math.round(28.12 + 11.08)}`);
    expect(renderPricePlaceholder(ph("{{cost5:io:usd}}"), "en", LIVE)).toBe(`$${Math.round(28.12 + 4 * 51.8)}`);
    expect(renderPricePlaceholder(ph("{{cost1:io:usd}}"), "en", LIVE)).toBe("$28");
    expect(renderPricePlaceholder(ph("{{costdiff5:io:com:usd}}"), "en", LIVE)).toBe(`$${Math.round(28.12 + 4 * 51.8 - 5 * 11.08)}`);
    expect(renderPricePlaceholder(ph("{{costdiff5:com:io:usd}}"), "en", LIVE)).toBe(`$${Math.round(28.12 + 4 * 51.8 - 5 * 11.08)}`);
  });

  it("ratio：a ÷ b（按美元），<10 保留一位小数、≥10 取整；zh「N 倍」/ en「N×」；分母 0 → 「—」", () => {
    expect(renderPricePlaceholder(ph("{{ratio:io:com:renew}}"), "zh", LIVE)).toBe(`${Math.round((51.8 / 11.08) * 10) / 10} 倍`);
    expect(renderPricePlaceholder(ph("{{ratio:com:io:renew}}"), "en", LIVE)).toBe(`${Math.round((11.08 / 51.8) * 10) / 10}×`);
    expect(renderPricePlaceholder(ph("{{ratio:ai:com:first}}"), "en", LIVE)).toBe(`${Math.round((82.7 / 11.08) * 10) / 10}×`);
    const big: ComparePriceSnapshot = { ...LIVE, live: { ...LIVE.live, ai: { registration: 120, renewal: 120 } } };
    expect(renderPricePlaceholder(ph("{{ratio:ai:com:renew}}"), "en", big)).toBe("11×");
    const zero: ComparePriceSnapshot = { ...LIVE, live: { ...LIVE.live, com: { registration: 0, renewal: 0 } } };
    expect(renderPricePlaceholder(ph("{{ratio:io:com:renew}}"), "en", zero)).toBe("—");
  });

  it("jump：同一 TLD 续费 ÷ 首年（首年价跳档倍数）", () => {
    expect(renderPricePlaceholder(ph("{{jump:io}}"), "zh", LIVE)).toBe(`${Math.round((51.8 / 28.12) * 10) / 10} 倍`);
    expect(renderPricePlaceholder(ph("{{jump:com}}"), "en", LIVE)).toBe("1×");
  });

  it("pair：两侧同值输出单值，不同值输出「低–高」区间（zh 人民币把「元」放到区间末尾）", () => {
    expect(renderPricePlaceholder(ph("{{pair:com:io:first:usd}}"), "en", LIVE)).toBe("$11–28");
    expect(renderPricePlaceholder(ph("{{pair:io:com:first:usd}}"), "en", LIVE)).toBe("$11–28");
    expect(renderPricePlaceholder(ph("{{pair:com:io:renew:cny}}"), "zh", LIVE)).toBe(`80–${toCny(51.8)} 元`);
    expect(renderPricePlaceholder(ph("{{pair:com:io:renew:cny}}"), "en", LIVE)).toBe(`¥80–${toCny(51.8)}`);
    expect(renderPricePlaceholder(ph("{{pair:com:ai:renew:usd}}"), "en", { ...LIVE, live: { ...LIVE.live, ai: LIVE.live.com } })).toBe("$11");
  });

  it("renderPriceText：替换全部合法占位；不合法占位原样保留（不产生任何数字）；无占位文本原样返回", () => {
    expect(renderPriceText("首年 {{price:com:first:cny}}、续费 {{price:com:renew:cny}}。", "zh", LIVE)).toBe("首年 80 元、续费 80 元。");
    expect(renderPriceText("x {{price:com:first:eur}} y {{total:com:cny}} z", "zh", LIVE)).toBe("x {{price:com:first:eur}} y {{total:com:cny}} z");
    expect(renderPriceText("no placeholders", "en", LIVE)).toBe("no placeholders");
  });
});

describe("SSR 正文与价格表同源", () => {
  it("compareContentBlocks 的结论段 = renderPriceText(verdict) 的 HTML 转义；正文数字与价格表单元格同值", () => {
    const cmp = TLD_COMPARES["com-vs-io"];
    for (const lang of ["zh", "en"] as const) {
      const html = compareContentBlocks(cmp, lang, LIVE).join("\n");
      const verdict = renderPriceText(cmp[lang].verdict, lang, LIVE);
      expect(html).toContain(escapeHtml(verdict));
      for (const item of [...cmp[lang].pickA, ...cmp[lang].pickB]) expect(html).toContain(escapeHtml(renderPriceText(item, lang, LIVE)));
      expect(verdict).not.toMatch(PRICE_PLACEHOLDER_RE);
    }
    // 正文里的 .io 续费与表格单元格同源：同一 priceRow 值
    const row = priceRow("io", LIVE)!;
    expect(renderPriceText("{{price:io:renew:cny}}", "en", LIVE)).toBe(row.renew.cnyText);
    expect(renderPriceText("{{price:io:renew:cny}}", "zh", LIVE)).toBe(`${row.renew.cny} 元`);
    expect(renderPriceText("{{price:io:renew:usd}}", "zh", LIVE)).toBe(`$${Math.round(row.renew.usd)}`);
  });

  it("同一快照下 renderPriceText 结果确定（客户端 compare-page 用同一函数 + 注入的同一份快照 → 水合逐字一致）", () => {
    const cmp = TLD_COMPARES["io-vs-ai"];
    const a = renderPriceText(cmp.zh.verdict, "zh", LIVE);
    const b = renderPriceText(cmp.zh.verdict, "zh", { ...LIVE, live: { ...LIVE.live } });
    expect(a).toBe(b);
    expect(renderPriceText(cmp.zh.verdict, "zh", NO_DATA)).not.toBe(a);
  });

  it("静态回退页（.cn 无实时价）：正文 .cn 数字带 ≈，.com 数字不带 ≈，与表格 approx 标记一致", () => {
    const cmp = TLD_COMPARES["com-vs-cn"];
    const zh = renderPriceText(cmp.zh.verdict, "zh", LIVE);
    const cn = tldPrice("cn")!;
    expect(zh).toContain(`首年 ≈${cn.first} 元、续费 ≈${cn.renew} 元`);
    expect(zh).toContain("首年 80 元、续费 80 元");
    expect(priceRow("cn", LIVE)!.first.approx).toBe(true);
    expect(priceRow("com", LIVE)!.first.approx).toBe(false);
  });
});

describe("R563：metaDescription → meta / Article / FAQ 第 1 答 / JSON-LD 同源", () => {
  /** R558 P2-1 实证页：.mx 静态「首年 $13 续费 $50」vs 实时 35.57/41.23（方向都反了）；.de「$8 平续」vs 实时 2.9/4.07 */
  const R558_LIVE: ComparePriceSnapshot = {
    live: { mx: { registration: 35.57, renewal: 41.23 }, es: { registration: 7.65, renewal: 9.5 }, de: { registration: 2.9, renewal: 4.07 }, com: { registration: 11.08, renewal: 11.08 } },
    fetchedAt: FETCHED_AT,
    stale: false,
  };

  it("85 × zh/en 带价页的 metaDescription 全部改为占位（不再有任何硬编码 $N）；无价页原样", () => {
    let withPlaceholder = 0;
    for (const c of Object.values(TLD_COMPARES)) {
      for (const lang of ["zh", "en"] as const) {
        const m = c[lang].metaDescription;
        if (PRICE_PLACEHOLDER_RE.test(m)) withPlaceholder += 1;
        PRICE_PLACEHOLDER_RE.lastIndex = 0;
      }
    }
    expect(withPlaceholder).toBe(170);
  });

  it("mx-vs-es / de-vs-com：渲染后 meta 数字 = 价格表单元格（R558 两页人工核实的矛盾消失）", () => {
    const mx = compareMetaDescription(TLD_COMPARES["mx-vs-es"], "en", R558_LIVE);
    expect(mx).toContain("$36 to register and $41/yr to renew");
    expect(mx).not.toMatch(/\$13|\$50/);
    const mxZh = compareMetaDescription(TLD_COMPARES["mx-vs-es"], "zh", R558_LIVE);
    expect(mxZh).toContain(`首年 ${toCny(35.57)} 元、续费 ${toCny(41.23)} 元/年`);
    const de = compareMetaDescription(TLD_COMPARES["de-vs-com"], "en", R558_LIVE);
    expect(de).toContain("$3 to register and $4/yr to renew");
    expect(de).not.toContain("$8");
    expect(priceRow("mx", R558_LIVE)!.first.usd).toBe(35.57);
  });

  it("FAQ 第 1 答首句 == 渲染后 metaDescription 首句；SSR 可见 FAQ 与 FAQPage JSON-LD 用同一快照时逐字一致", () => {
    for (const slug of ["mx-vs-es", "de-vs-com", "com-vs-io", "th-vs-vn"]) {
      const cmp = TLD_COMPARES[slug]!;
      for (const lang of ["zh", "en"] as const) {
        const meta = compareMetaDescription(cmp, lang, R558_LIVE);
        const faq = buildCompareFaq(cmp, lang, R558_LIVE);
        expect(faq[0].a.startsWith(firstSentence(meta, lang))).toBe(true);
        expect(faq[0].a).not.toMatch(PRICE_PLACEHOLDER_RE);
        const html = compareContentBlocks(cmp, lang, R558_LIVE).join("");
        expect(html).toContain(escapeHtml(faq[0].a.replace(/\s*(完整结论见本页|See “)[\s\S]*$/, "")));
        const ld = JSON.parse(faqJsonld(faq).replace(/<\/script/g, "</script")) as { mainEntity: { acceptedAnswer: { text: string } }[] };
        expect(ld.mainEntity[0].acceptedAnswer.text).toBe(faq[0].a);
      }
    }
  });

  it("不同快照渲染不同 meta（缺快照回退静态 ≈），任何情况都不留 {{ 与新「—」", () => {
    for (const c of Object.values(TLD_COMPARES)) {
      for (const lang of ["zh", "en"] as const) {
        const out = compareMetaDescription(c, lang, NO_DATA);
        expect(out, `${c.slug} ${lang}`).not.toMatch(PRICE_PLACEHOLDER_RE);
        expect(out.split("—").length, `${c.slug} ${lang}`).toBe(c[lang].metaDescription.split("—").length);
      }
    }
    const withLive = compareMetaDescription(TLD_COMPARES["mx-vs-es"], "en", R558_LIVE);
    const noData = compareMetaDescription(TLD_COMPARES["mx-vs-es"], "en", NO_DATA);
    expect(withLive).not.toBe(noData);
    expect(noData).toMatch(/≈\$\d+ to register and ≈\$\d+\/yr to renew/);
  });
});

describe("R563：渲染后 meta description 长度守门", () => {
  /**
   * Google Search Central「Control your snippets」：meta description 无长度上限，但按设备宽度截断——
   * zh 全部 ≤160 字（占位改为静态回退「≈NN 元」是最长形态）；
   * en 改前就有 395/444 页 >160（历史遗留，中位 194、最长 387），本轮只守「不超过改前包络 430」，收缩到 ≤160 另开批次。
   */
  const LIMIT = { zh: 160, en: 430 } as const;
  for (const lang of ["zh", "en"] as const) {
    it(`${lang}: 全部 444 页 NO_DATA 渲染后 ≤ ${LIMIT[lang]}`, () => {
      const over: string[] = [];
      for (const c of Object.values(TLD_COMPARES)) {
        const n = compareMetaDescription(c, lang, NO_DATA).length;
        if (n > LIMIT[lang]) over.push(`${c.slug} ${n}`);
      }
      expect(over).toEqual([]);
    });
  }
});
