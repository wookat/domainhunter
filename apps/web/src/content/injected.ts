/**
 * 内容页（/tld /guide /vs）随 HTML 注入的页面数据（window.__DH_CONTENT__）。
 * worker SSR 时把当前页所需数据序列化进 <script>，客户端页面组件直接读取，
 * 不再静态 import tlds.ts / guides.ts / compares.ts 全量内容模块
 * （三个模块合计 gzip 后 >2.5MB，曾把内容页 LCP 拖到 13s+）。
 * 注入缺失时由 main.tsx 动态加载 injected-build.ts 兜底构建，渲染结果逐字一致。
 */
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
}

export interface InjectedGuideContent {
  kind: "guide";
  slug: string;
  guide: IndustryGuide;
  /** 页脚全部行业指南互链（GUIDE_LIST 顺序） */
  guideLinks: GuideLink[];
}

export interface InjectedVsContent {
  kind: "vs";
  slug: string;
  cmp: TldCompare;
  /** 对比两侧的 TLD 指南（a、b 顺序；无指南时为 null） */
  sideGuides: [TldGuide | null, TldGuide | null];
  relatedGuides: GuideLink[];
  /** 页脚全部对比页互链（TLD_COMPARES 插入顺序） */
  compareLinks: CompareLink[];
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
