/**
 * 内容页（/tld /guide /vs）随 HTML 注入的页面数据（window.__DH_CONTENT__）。
 * worker SSR 时把当前页所需数据序列化进 <script>，客户端页面组件直接读取，
 * 不再静态 import tlds.ts / guides.ts / compares.ts 全量内容模块
 * （三个模块合计 gzip 后 >2.5MB，曾把内容页 LCP 拖到 13s+）。
 * 注入缺失时由 main.tsx 动态加载 injected-build.ts 兜底构建，渲染结果逐字一致。
 */
import type { ComparePriceSnapshot } from "./compare-prices";
import type { TldCompare } from "./compares";
import type { IndustryGuide } from "./guides";
import type { TldGuide } from "./tlds";

/** 行业指南互链（slug + 双语标签，标签逐字取自 INDUSTRY_GUIDES[slug][lang].label） */
export interface GuideLink {
  slug: string;
  zh: string;
  en: string;
}

/** 对比页互链（slug + 两侧 TLD） */
export interface CompareLink {
  slug: string;
  a: string;
  b: string;
}

export interface InjectedTldContent {
  kind: "tld";
  tld: string;
  guide: TldGuide;
  relatedGuides: GuideLink[];
  relatedCompares: CompareLink[];
  /** 首屏价格卡 + 「相关 TLD」chip 的价格快照（本 TLD + 同组相关 TLD），与 SSR 同源 /api/prices KV；缺失时客户端回落 /api/prices 拉取 */
  prices?: ComparePriceSnapshot;
}

export interface InjectedGuideContent {
  kind: "guide";
  slug: string;
  guide: IndustryGuide;
  /** 「推荐 TLD」卡的价格快照（guide.tlds），同上 */
  prices?: ComparePriceSnapshot;
}

export interface InjectedVsContent {
  kind: "vs";
  slug: string;
  cmp: TldCompare;
  /** 对比两侧的 TLD 指南（a、b 顺序；无指南时为 null） */
  sideGuides: [TldGuide | null, TldGuide | null];
  relatedGuides: GuideLink[];
  /**
   * 价格数据表快照：worker SSR 只读 /api/prices 同一份 KV 缓存写入，客户端据此渲染与 SSR 逐字一致的表格；
   * 客户端兜底构建（注入缺失）时为 undefined，页面改用 /api/prices 拉取结果
   */
  prices?: ComparePriceSnapshot;
}

export type InjectedContent = InjectedTldContent | InjectedGuideContent | InjectedVsContent;

declare global {
  interface Window {
    __DH_CONTENT__?: InjectedContent | null;
  }
}

/** 读取当前页注入数据；kind 或 slug/tld 对不上（如注入缺失）返回 null */
export function readInjectedContent<K extends InjectedContent["kind"]>(
  kind: K,
  key: string,
): Extract<InjectedContent, { kind: K }> | null {
  const data = typeof window === "undefined" ? null : window.__DH_CONTENT__;
  if (!data || data.kind !== kind) return null;
  const dataKey = data.kind === "tld" ? data.tld : data.slug;
  if (dataKey !== key) return null;
  return data as Extract<InjectedContent, { kind: K }>;
}
