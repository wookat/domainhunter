import { TLD_LIST } from "./tld-list";

/**
 * /advanced 与 /why 的 SEO 标题/描述唯一来源（纯 TS，客户端与 worker 共用）：
 * - worker 按语言写 SSR <title> / description / og / twitter
 * - lib/i18n.tsx 水合后按同一 title 写 document.title
 * 同源保证 SSR <title> 与水合后 document.title 逐字一致（/prices、404 壳同法）。
 */
export type PageMetaLang = "zh" | "en";

export interface PageMeta {
  /** 页面标题（不含站名后缀） */
  title: string;
  desc: string;
}

export const ADVANCED_META: Record<PageMetaLang, PageMeta> = {
  zh: {
    title: "批量域名核验：粘贴名单一键实时查可注册",
    desc: "把现成域名名单（裸名/完整域名/带链接混排，最多 200 个）粘进来，一键流式核验可注册状态（RDAP+DNS 实时），免登录免费。",
  },
  en: {
    title: "Bulk domain check: paste a list, verify availability live",
    desc: "Paste up to 200 names (bare names, full domains or URLs mixed) and stream live availability checks (RDAP+DNS). Free, no login.",
  },
};

export const WHY_META: Record<PageMetaLang, PageMeta> = {
  zh: {
    title: "为什么选 DomainHunter：中文创业者的域名猎手",
    desc: `面向中文创业者、独立开发者与出海团队：用中文说寓意，AI 沿拼音/英文/混搭四路线构思，${TLD_LIST.length} TLD 实时核验（.cn / .com.cn 直查 CNNIC），附到期日与价格，支持批量核验、CSV 导出与到期监控。英文通用起名不是我们的主场，对比表如实标出。免费开源。`,
  },
  en: {
    title: "Why DomainHunter: a domain hunter for Chinese founders",
    desc: `Built for Chinese founders, indie developers and teams going global: describe the meaning in Chinese, AI brainstorms pinyin, English and blend candidates along four routes, verified live across ${TLD_LIST.length} TLDs (.cn / .com.cn against CNNIC), with expiry dates, prices, bulk checks, CSV export and expiry monitoring. Generic English naming isn't our home turf — the comparison table says so. Free and open source.`,
  },
};
