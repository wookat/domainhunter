/**
 * 内容页全文 SSR 渲染（仅 worker 引用，不进客户端 bundle）。
 * 输出与 React 页面组件首次渲染（prices 未加载时）的 DOM 视觉一致：
 * 类名与文本逐字对齐 tld-page.tsx / compare-page.tsx / guide-page.tsx，
 * React 挂载后整体替换骨架，无可见跳变。
 * 文案硬编码处与 lib/i18n.tsx 词典逐字同源（修改词典时需同步）。
 */
import { TLD_COMPARES, comparesForTld, type TldCompare } from "./compares";
import { buildCompareFaq } from "./compare-faq";
import { buildGuideFaq } from "./guide-faq";
import { buildTldFaq } from "./tld-faq";
import { COMPARE_SLUGS, compareLabel } from "./compare-slugs";
import { GUIDE_LIST, INDUSTRY_GUIDES, guidesForTld, type IndustryGuide } from "./guides";
import { HUB_META, compareHubGroups, guideHubGroups, guideOneLiner, tldHubGroups, tldOneLiner } from "./hubs";
import { TLD_GUIDES, type TldGuide } from "./tlds";
import { TLD_LIST } from "./tld-list";
import { toUsd } from "../lib/currency";
import { tldPrice } from "../types";

type Lang = "zh" | "en";

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** lib/prices.ts priceFull 的静态参考价分支（prices 未加载时的首次渲染文案，逐字一致） */
function staticPriceFull(tld: string, lang: Lang): string | undefined {
  const s = tldPrice(tld);
  if (!s) return undefined;
  return lang === "en"
    ? `Static reference: ≈$${toUsd(s.first)} (¥${s.first}) 1st yr · ¥${s.renew}/yr renewal · not a live quote`
    : `静态参考价：首年 ¥${s.first} · 续费 ¥${s.renew}/年 · 非实时报价`;
}

/** lib/prices.ts priceShort 的静态参考价分支（逐字一致） */
function staticPriceShort(tld: string, lang: Lang): string | undefined {
  const s = tldPrice(tld);
  if (!s) return undefined;
  return lang === "en" ? `1st yr ≈$${toUsd(s.first)}` : `首年 ¥${s.first}`;
}

/* lucide-react v1.27 图标的等价 SVG（与对应组件同 path），保持骨架布局/视觉一致 */
const icon = (name: string, cls: string, inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name} ${cls}">${inner}</svg>`;

const ICON_TAG = icon("tag", "h-4 w-4 shrink-0 text-brand", '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>');
const ICON_CHECK = icon("circle-check", "h-4 w-4 text-brand", '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>');
const ICON_CHECK_SM = icon("circle-check", "h-3.5 w-3.5 text-brand", '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>');
const ICON_BULB = icon("lightbulb", "h-4 w-4 text-gold", '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>');
const ICON_HELP = icon("circle-question-mark", "h-4 w-4 text-brand", '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>');
const ICON_SPARKLES = icon("sparkles", "h-4 w-4", '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>');
const ICON_SPARKLES_BRAND = icon("sparkles", "h-4 w-4 text-brand", '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>');
const ICON_SCALE = icon("scale", "h-4 w-4 text-brand", '<path d="M12 3v18"></path><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M7 21h10"></path>');
const ICON_QUOTE = icon("quote", "h-4 w-4 text-brand", '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>');
const ICON_ALERT = icon("triangle-alert", "h-4 w-4 text-destructive", '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>');

/* 文案硬编码：与 lib/i18n.tsx 词典逐字同源（i18n key 见注释） */
const STR = {
  zh: {
    seeAll: `查看全部 ${TLD_LIST.length} 个后缀价格 →`, // prices.seeAll
    bestFor: "适合什么", // tld.bestFor
    naming: "命名建议", // tld.naming
    faq: "常见问题", // tld.faq
    tldCtaTitle: (tld: string) => `马上猎一个 .${tld} 好域名`, // tld.ctaTitle
    tldCtaDesc: (tld: string) => `描述你的想法，AI 批量构思并实时核验 .${tld} 下的可注册好名字。`, // tld.ctaDesc
    tldCtaButton: (tld: string) => `开始猎取 .${tld}`, // tld.ctaButton
    others: "其他 TLD 指南", // tld.others
    relatedGuides: "相关行业命名指南", // tld.relatedGuides
    relatedCompares: "相关后缀对比", // vs.relatedCompares
    verdict: "怎么选", // vs.verdict
    pickWhen: (tld: string) => `适合选 .${tld} 的情况`, // vs.pickWhen
    vsCtaTitle: (a: string, b: string) => `让 AI 同时在 .${a} 和 .${b} 下猎名`, // vs.ctaTitle
    vsCtaDesc: "描述你的想法，AI 批量构思并实时核验两个后缀下的可注册好名字，直接对比。", // vs.ctaDesc
    vsCtaButton: "开始猎取", // vs.ctaButton
    vsOthers: "其他后缀对比", // vs.others
    guideIdeas: "命名思路", // guide.ideas
    guideCases: "好名字拆解", // guide.cases
    guideTlds: "推荐 TLD", // guide.tlds
    guidePitfalls: "常见误区", // guide.pitfalls
    guideCtaTitle: "用 AI 按这个行业猎名", // guide.ctaTitle
    guideCtaDesc: "一键填入该行业模板，AI 批量构思并实时核验可注册的好域名。", // guide.ctaDesc
    guideCtaButton: "开始猎取", // guide.ctaButton
    guideOthers: "其他行业命名指南", // guide.others
  },
  en: {
    seeAll: `See prices for all ${TLD_LIST.length} TLDs →`,
    bestFor: "Best for",
    naming: "Naming tips",
    faq: "FAQ",
    tldCtaTitle: (tld: string) => `Hunt a great .${tld} domain right now`,
    tldCtaDesc: (tld: string) => `Describe your idea — AI brainstorms names in bulk and checks .${tld} availability live.`,
    tldCtaButton: (tld: string) => `Start hunting .${tld}`,
    others: "More TLD guides",
    relatedGuides: "Related industry naming guides",
    relatedCompares: "Related TLD comparisons",
    verdict: "Which to pick",
    pickWhen: (tld: string) => `Pick .${tld} when`,
    vsCtaTitle: (a: string, b: string) => `Hunt names on .${a} and .${b} at once`,
    vsCtaDesc: "Describe your idea — AI brainstorms names in bulk and checks availability on both suffixes live, side by side.",
    vsCtaButton: "Start hunting",
    vsOthers: "More TLD comparisons",
    guideIdeas: "Naming strategies",
    guideCases: "Great names, deconstructed",
    guideTlds: "Recommended TLDs",
    guidePitfalls: "Common mistakes",
    guideCtaTitle: "Hunt names for this industry with AI",
    guideCtaDesc: "Prefill the industry template — AI brainstorms in bulk and verifies availability live.",
    guideCtaButton: "Start hunting",
    guideOthers: "More industry naming guides",
  },
} as const;

/* prices-page.tsx 表头排序图标（lucide v1.27 arrow-up / arrow-up-down，同 path） */
const ICON_ARROW_UP = icon("arrow-up", "h-3 w-3", '<path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>');
const ICON_ARROW_UP_DOWN = icon("arrow-up-down", "h-3 w-3", '<path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path>');

/* /prices 骨架文案：与 lib/i18n.tsx 词典逐字同源（prices.colTld / colReg / colRenew / hunt / filter） */
const PRICES_STR = {
  zh: { colTld: "后缀", colReg: "注册/首年", colRenew: "续费/年", hunt: "猎名", filter: "筛选后缀，如 shop…" },
  en: { colTld: "TLD", colReg: "Register / 1st yr", colRenew: "Renew / yr", hunt: "Hunt", filter: "Filter suffixes, e.g. shop…" },
} as const;

/**
 * /prices 首屏骨架：筛选框 + 表头 + 全量骨架行（价格单元为脉冲占位）。
 * DOM/类名与 prices-page.tsx 在 /api/prices 未返回时的首次渲染逐字一致（React 挂载零跳变），
 * 行序同 buildRows 默认排序（静态参考价升序，稳定排序）。
 */
export function pricesTableSkeleton(lang: Lang): string {
  const s = PRICES_STR[lang];
  const th = (label: string, active: boolean) =>
    `<button class="flex min-h-[32px] items-center gap-1 text-xs font-semibold ${active ? "text-brand" : "text-txt1 hover:text-txt0"}">${escapeHtml(label)}${active ? ICON_ARROW_UP : ICON_ARROW_UP_DOWN}</button>`;
  const rows = TLD_LIST.map((tld) => {
    const p = tldPrice(tld);
    return { tld, reg: p ? toUsd(p.first) : Number.MAX_SAFE_INTEGER };
  });
  rows.sort((a, b) => a.reg - b.reg);
  const rowsHtml = rows
    .map(
      ({ tld }) =>
        `<div class="cv-row grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 border-b border-line px-4 py-3 last:border-b-0"><a href="/tld/${tld}?lang=${lang}" class="tap-target font-mono text-sm font-semibold text-txt0 hover:text-brand">.${tld}</a><span class="h-5 w-14 animate-pulse rounded bg-bg1"></span><span class="h-5 w-14 animate-pulse rounded bg-bg1"></span><a href="/?tld=${tld}" class="flex min-h-[44px] items-center rounded-lg border border-line px-2.5 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-[36px]">${escapeHtml(s.hunt)}</a></div>`,
    )
    .join("");
  return (
    `<input placeholder="${escapeHtml(s.filter)}" class="mt-6 h-10 w-full max-w-xs rounded-lg border border-line bg-bg1 px-3 font-mono text-sm text-txt0 outline-none transition-colors placeholder:font-sans placeholder:text-txt2 focus:border-brand-line" />` +
    `<div class="mt-4 overflow-hidden rounded-xl border border-line"><div class="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 border-b border-line bg-bg1 px-4 py-2.5">${th(s.colTld, false)}${th(s.colReg, true)}${th(s.colRenew, false)}<span></span></div>${rowsHtml}</div>`
  );
}

const sectionH2 = (iconSvg: string, label: string) =>
  `<h2 class="mt-8 flex items-center gap-2 text-base font-bold">${iconSvg}${escapeHtml(label)}</h2>`;

const dotList = (items: readonly string[], dotCls = "bg-brand") =>
  `<ul class="mt-3 space-y-2">${items
    .map((it) => `<li class="flex gap-2 text-sm leading-relaxed text-txt1"><span class="mt-2 h-1 w-1 shrink-0 rounded-full ${dotCls}"></span>${escapeHtml(it)}</li>`)
    .join("")}</ul>`;

const faqBlock = (faq: { q: string; a: string }[], lang: Lang) =>
  sectionH2(ICON_HELP, STR[lang].faq) +
  `<div class="mt-3 space-y-2">${faq
    .map(
      (f) =>
        `<details class="group rounded-xl border border-line bg-bg1 px-4 py-3"><summary class="flex min-h-[28px] cursor-pointer list-none items-center text-sm font-semibold text-txt0 [&amp;::-webkit-details-marker]:hidden">${escapeHtml(f.q)}</summary><p class="mt-2 text-sm leading-relaxed text-txt1">${escapeHtml(f.a)}</p></details>`,
    )
    .join("")}</div>`;

const ctaBlock = (title: string, desc: string, href: string, button: string) =>
  `<div class="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center"><h2 class="text-lg font-bold">${escapeHtml(title)}</h2><p class="mx-auto mt-1.5 max-w-md text-sm text-txt1">${escapeHtml(desc)}</p><a href="${href}" class="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90">${ICON_SPARKLES}${escapeHtml(button)}</a></div>`;

const chipRow = (heading: string, chips: string, mt = "mt-6") =>
  `<div class="${mt}"><h2 class="text-sm font-semibold text-txt1">${escapeHtml(heading)}</h2><div class="mt-3 flex flex-wrap gap-2">${chips}</div></div>`;

/** /tld/:tld 全文正文（tld-page.tsx 首次渲染的静态部分） */
export function tldContentBlocks(tld: string, guide: TldGuide, lang: Lang): string[] {
  const s = STR[lang];
  const loc = guide[lang];
  const faq = buildTldFaq(tld, loc, lang);
  const relatedGuides = guidesForTld(tld);
  const relatedCompares = comparesForTld(tld);
  const priceCard = `<div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-bg1 px-5 py-4">${ICON_TAG}<span class="text-sm text-txt1">${escapeHtml(staticPriceFull(tld, lang) ?? "")}</span><a href="/prices?lang=${lang}" class="ml-auto inline-flex min-h-[44px] items-center text-xs text-txt2 hover:text-brand hover:underline sm:min-h-[36px]">${escapeHtml(s.seeAll)}</a></div>`;
  const bestFor = sectionH2(ICON_CHECK, s.bestFor) +
    `<ul class="mt-3 grid gap-2 sm:grid-cols-2">${loc.bestFor.map((it) => `<li class="rounded-lg border border-line bg-bg1 px-3.5 py-2.5 text-sm text-txt1">${escapeHtml(it)}</li>`).join("")}</ul>`;
  const naming = sectionH2(ICON_BULB, s.naming) + dotList(loc.namingTips);
  const others = chipRow(
    s.others,
    TLD_LIST.map((other) => {
      const cls = other === tld ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:border-brand-line hover:text-brand";
      const price = staticPriceShort(other, lang);
      return `<a href="/tld/${other}?lang=${lang}" class="inline-flex min-h-[44px] items-center rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors sm:min-h-0 ${cls}">.${other}${price ? `<span class="tnum ml-1.5 text-[10px] text-txt1">${escapeHtml(price)}</span>` : ""}</a>`;
    }).join(""),
    "mt-10",
  );
  const compares = relatedCompares.length
    ? chipRow(
        s.relatedCompares,
        relatedCompares
          .map((slug) => `<a href="/vs/${slug}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand">.${TLD_COMPARES[slug].a} vs .${TLD_COMPARES[slug].b}</a>`)
          .join(""),
      )
    : "";
  const guides = relatedGuides.length
    ? chipRow(
        s.relatedGuides,
        relatedGuides
          .map((slug) => `<a href="/guide/${slug}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand">${escapeHtml(INDUSTRY_GUIDES[slug][lang].label)}</a>`)
          .join(""),
      )
    : "";
  return [
    priceCard,
    `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(loc.intro)}</p>`,
    bestFor,
    naming,
    faqBlock(faq, lang),
    ctaBlock(s.tldCtaTitle(tld), s.tldCtaDesc(tld), `/?tld=${tld}`, s.tldCtaButton(tld)),
    others,
    compares,
    guides,
  ];
}

/** /vs/:slug 全文正文（compare-page.tsx 首次渲染的静态部分） */
export function compareContentBlocks(cmp: TldCompare, lang: Lang): string[] {
  const s = STR[lang];
  const loc = cmp[lang];
  const sides = [cmp.a, cmp.b] as const;
  const picks = [loc.pickA, loc.pickB] as const;
  const faq = buildCompareFaq(cmp, lang);
  const relatedGuides = [...new Set([...guidesForTld(cmp.a), ...guidesForTld(cmp.b)])].slice(0, 4);
  const verdict = `<div class="mt-6 rounded-xl border border-line bg-bg1 px-5 py-4"><h2 class="flex items-center gap-2 text-base font-bold">${ICON_SCALE}${escapeHtml(s.verdict)}</h2><p class="mt-2.5 text-[15px] leading-relaxed text-txt1">${escapeHtml(loc.verdict)}</p></div>`;
  const columns = `<div class="mt-8 grid gap-4 md:grid-cols-2">${sides
    .map((tld, i) => {
      const guide = TLD_GUIDES[tld];
      const firstSentence = guide ? guide[lang].intro.split(lang === "zh" ? "。" : ". ")[0] + (lang === "zh" ? "。" : ".") : "";
      return `<section class="rounded-2xl border border-line bg-bg1 p-5"><a href="/tld/${tld}?lang=${lang}" class="tap-target inline-block font-mono text-lg font-bold text-brand hover:underline">.${tld}</a><p class="tnum mt-1 text-xs text-txt2">${escapeHtml(staticPriceFull(tld, lang) ?? "")}</p>${guide ? `<p class="mt-3 text-sm leading-relaxed text-txt1">${escapeHtml(firstSentence)}</p>` : ""}<h3 class="mt-4 flex items-center gap-1.5 text-sm font-semibold">${ICON_CHECK_SM}${escapeHtml(s.pickWhen(tld))}</h3><ul class="mt-2 space-y-1.5">${picks[i]
        .map((it) => `<li class="flex gap-2 text-sm leading-relaxed text-txt1"><span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"></span>${escapeHtml(it)}</li>`)
        .join("")}</ul></section>`;
    })
    .join("")}</div>`;
  const pricesLink = `<p class="mt-4 text-center"><a href="/prices?lang=${lang}" class="inline-flex min-h-[44px] items-center px-2 text-sm text-txt1 hover:text-brand hover:underline">${escapeHtml(s.seeAll)}</a></p>`;
  const guides = relatedGuides.length
    ? chipRow(
        s.relatedGuides,
        relatedGuides
          .map((slug) => `<a href="/guide/${slug}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand">${escapeHtml(INDUSTRY_GUIDES[slug][lang].label)}</a>`)
          .join(""),
        "mt-10",
      )
    : "";
  const others = chipRow(
    s.vsOthers,
    Object.values(TLD_COMPARES)
      .map((other) => {
        const cls =
          other.slug === cmp.slug
            ? "flex min-h-[44px] items-center rounded-lg border border-brand-line bg-brand-dim px-3 font-mono text-xs font-semibold text-brand"
            : "flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand";
        return `<a href="/vs/${other.slug}?lang=${lang}" class="${cls}">.${other.a} vs .${other.b}</a>`;
      })
      .join(""),
    "mt-10",
  );
  return [
    verdict,
    columns,
    faqBlock(faq, lang),
    ctaBlock(s.vsCtaTitle(cmp.a, cmp.b), s.vsCtaDesc, `/?tld=${cmp.a},${cmp.b}`, s.vsCtaButton),
    pricesLink,
    guides,
    others,
  ];
}

/** /guide/:slug 全文正文（guide-page.tsx 首次渲染的静态部分） */
export function guideContentBlocks(guide: IndustryGuide, lang: Lang): string[] {
  const s = STR[lang];
  const loc = guide[lang];
  const faq = buildGuideFaq(guide, lang);
  const relatedCompares = [...new Set(guide.tlds.flatMap((rec) => COMPARE_SLUGS.filter((cs) => cs.split("-vs-").includes(rec.tld))))].slice(0, 4);
  const ideas = sectionH2(ICON_BULB, s.guideIdeas) + dotList(loc.namingIdeas);
  const cases = sectionH2(ICON_QUOTE, s.guideCases) +
    `<div class="mt-3 space-y-2.5">${loc.cases
      .map((c) => `<div class="rounded-lg border border-line bg-bg1 px-3.5 py-2.5"><p class="font-mono text-sm font-semibold text-txt0">${escapeHtml(c.name)}</p><p class="mt-1 text-sm leading-relaxed text-txt1">${escapeHtml(c.takeaway)}</p></div>`)
      .join("")}</div>`;
  const tlds = sectionH2(ICON_SPARKLES_BRAND, s.guideTlds) +
    `<div class="mt-3 grid gap-2 sm:grid-cols-3">${guide.tlds
      .map((rec) => {
        const price = staticPriceShort(rec.tld, lang);
        return `<a href="/tld/${rec.tld}?lang=${lang}" class="flex min-h-[44px] flex-col justify-center rounded-lg border border-line bg-bg1 px-3.5 py-2.5 transition-colors hover:border-brand-line"><span class="font-mono text-sm font-semibold text-brand">.${rec.tld}${price ? `<span class="tnum ml-1.5 text-[10px] font-normal text-txt2">${escapeHtml(price)}</span>` : ""}</span><span class="mt-0.5 text-xs leading-relaxed text-txt1">${escapeHtml(rec[lang])}</span></a>`;
      })
      .join("")}</div>`;
  const compares = relatedCompares.length
    ? chipRow(
        s.relatedCompares,
        relatedCompares
          .map((cs) => `<a href="/vs/${cs}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand">${escapeHtml(compareLabel(cs))}</a>`)
          .join(""),
      )
    : "";
  const pitfalls = sectionH2(ICON_ALERT, s.guidePitfalls) + dotList(loc.pitfalls, "bg-destructive");
  const others = chipRow(
    s.guideOthers,
    GUIDE_LIST.map((other) => {
      const cls = other === guide.slug ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:border-brand-line hover:text-brand";
      return `<a href="/guide/${other}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border px-3 text-xs transition-colors ${cls}">${escapeHtml(INDUSTRY_GUIDES[other][lang].label)}</a>`;
    }).join(""),
    "mt-10",
  );
  return [
    `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(loc.intro)}</p>`,
    ideas,
    cases,
    tlds,
    compares,
    pitfalls,
    faqBlock(faq, lang),
    ctaBlock(s.guideCtaTitle, s.guideCtaDesc, `/?tpl=${guide.slug}`, s.guideCtaButton),
    others,
  ];
}

/* ---------- 内容枢纽 hub 页（/tld、/guide、/vs） ---------- */

/* 内容页 hub 面包屑 kicker：与 tld-page/guide-page/compare-page 的 kicker DOM 逐字一致（i18n hub.allTld / hub.allGuide / hub.allVs） */
const HUB_CRUMB = {
  zh: { tld: "TLD 指南", guide: "行业指南", vs: "后缀对比" },
  en: { tld: "TLD guides", guide: "Industry guides", vs: "TLD comparisons" },
} as const;

export const hubCrumbKicker = (hub: "tld" | "guide" | "vs", current: string, lang: Lang): string =>
  `<p class="font-mono text-sm text-brand"><a href="/${hub}?lang=${lang}" class="tap-target inline-block text-txt2 hover:text-brand hover:underline">${escapeHtml(HUB_CRUMB[lang][hub])}</a><span class="mx-1.5 text-txt2">/</span>${escapeHtml(current)}</p>`;

export const hubCrumbLabel = (hub: "tld" | "guide" | "vs", lang: Lang): string => HUB_CRUMB[lang][hub];

/** hub 页过滤输入框的等高占位（输入框水合后才出现，预留 44px 高度避免布局跳动） */
const HUB_FILTER_PLACEHOLDER = `<div class="mt-6 h-11"></div>`;

const hubSection = (heading: string, count: number, itemsHtml: string, headingCls = "text-base font-bold") =>
  `<section class="mt-8"><h2 class="${headingCls}">${escapeHtml(heading)}<span class="tnum ml-2 font-mono text-xs font-normal text-txt2">${count}</span></h2>${itemsHtml}</section>`;

const hubCard = (href: string, title: string, oneLiner: string, titleCls: string) =>
  `<a href="${href}" class="flex min-h-[44px] flex-col justify-center rounded-lg border border-line bg-bg1 px-3.5 py-2.5 transition-colors hover:border-brand-line"><span class="${titleCls}">${escapeHtml(title)}</span><span class="mt-0.5 text-xs leading-relaxed text-txt1">${escapeHtml(oneLiner)}</span></a>`;

/** /tld 全文正文（tld-hub-page.tsx 首次渲染的静态部分） */
export function tldHubBlocks(lang: Lang): string[] {
  const meta = HUB_META.tld[lang];
  const intro = `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(meta.intro)}<a href="/prices?lang=${lang}" class="tap-target inline-block text-brand hover:underline">${escapeHtml(meta.pricesLink)}</a>${lang === "zh" ? "。" : "."}</p>${HUB_FILTER_PLACEHOLDER}`;
  const sections = tldHubGroups().map((g) =>
    hubSection(
      g[lang],
      g.tlds.length,
      `<div class="mt-3 grid gap-2 sm:grid-cols-2">${g.tlds.map((tld) => hubCard(`/tld/${tld}?lang=${lang}`, `.${tld}`, tldOneLiner(tld, lang), "font-mono text-sm font-semibold text-brand")).join("")}</div>`,
    ),
  );
  return [intro, ...sections];
}

/** /guide 全文正文（guide-hub-page.tsx 首次渲染的静态部分） */
export function guideHubBlocks(lang: Lang): string[] {
  const meta = HUB_META.guide[lang];
  const intro = `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(meta.intro)}</p>${HUB_FILTER_PLACEHOLDER}`;
  const sections = guideHubGroups().map((g) =>
    hubSection(
      g[lang],
      g.slugs.length,
      `<div class="mt-3 grid gap-2 sm:grid-cols-2">${g.slugs.map((slug) => hubCard(`/guide/${slug}?lang=${lang}`, INDUSTRY_GUIDES[slug][lang].label, guideOneLiner(slug, lang), "text-sm font-semibold text-brand")).join("")}</div>`,
    ),
  );
  return [intro, ...sections];
}

/** /vs 全文正文（compare-hub-page.tsx 首次渲染的静态部分） */
export function compareHubBlocks(lang: Lang): string[] {
  const meta = HUB_META.vs[lang];
  const intro = `<p class="mt-6 text-[15px] leading-relaxed text-txt1">${escapeHtml(meta.intro)}</p>${HUB_FILTER_PLACEHOLDER}`;
  const sections = compareHubGroups().map((g) =>
    `<section class="mt-8"><h2 class="font-mono text-base font-bold">.${g.tld}<span class="tnum ml-2 text-xs font-normal text-txt2">${g.slugs.length}</span></h2><div class="mt-3 flex flex-wrap gap-2">${g.slugs
      .map((slug) => `<a href="/vs/${slug}?lang=${lang}" class="flex min-h-[44px] items-center rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand">.${TLD_COMPARES[slug].a} vs .${TLD_COMPARES[slug].b}</a>`)
      .join("")}</div></section>`,
  );
  return [intro, ...sections];
}
