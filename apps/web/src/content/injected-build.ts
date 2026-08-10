/**
 * 内容页注入数据的构建逻辑：worker SSR 注入与客户端兜底（注入缺失时动态加载）共用，
 * 保证两条路径产出的数据逐字一致。
 * 引用了 tlds.ts / guides.ts / compares.ts 全量内容模块——客户端只允许动态 import 本模块。
 */
import { TLD_COMPARES, comparesForTld } from "./compares";
import { GUIDE_LIST, INDUSTRY_GUIDES, guidesForTld } from "./guides";
import { TLD_GUIDES } from "./tlds";
import type { CompareLink, GuideLink, InjectedGuideContent, InjectedTldContent, InjectedVsContent } from "./injected";

const guideLink = (slug: string): GuideLink => ({
  slug,
  zh: INDUSTRY_GUIDES[slug].zh.label,
  en: INDUSTRY_GUIDES[slug].en.label,
});

const compareLink = (slug: string): CompareLink => ({
  slug,
  a: TLD_COMPARES[slug].a,
  b: TLD_COMPARES[slug].b,
});

export function buildTldContent(tld: string): InjectedTldContent | null {
  const guide = TLD_GUIDES[tld];
  if (!guide) return null;
  return {
    kind: "tld",
    tld,
    guide,
    relatedGuides: guidesForTld(tld).map(guideLink),
    relatedCompares: comparesForTld(tld).map(compareLink),
  };
}

export function buildGuideContent(slug: string): InjectedGuideContent | null {
  const guide = INDUSTRY_GUIDES[slug];
  if (!guide) return null;
  return { kind: "guide", slug, guide, guideLinks: GUIDE_LIST.map(guideLink) };
}

export function buildVsContent(slug: string): InjectedVsContent | null {
  const cmp = TLD_COMPARES[slug];
  if (!cmp) return null;
  return {
    kind: "vs",
    slug,
    cmp,
    sideGuides: [TLD_GUIDES[cmp.a] ?? null, TLD_GUIDES[cmp.b] ?? null],
    relatedGuides: [...new Set([...guidesForTld(cmp.a), ...guidesForTld(cmp.b)])].slice(0, 4).map(guideLink),
    compareLinks: Object.keys(TLD_COMPARES).map(compareLink),
  };
}
