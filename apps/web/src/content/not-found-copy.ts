/**
 * 品牌 404 页文案的唯一来源（纯 TS，客户端与 worker 共用）：
 * - lib/i18n.tsx 词典 `nf.title` / `nf.desc` 引用
 * - worker `notFoundShell` 按语言写 <title> / description / og / twitter
 * 同源保证 SSR <title> 与水合后 document.title 逐字一致。
 */
export type NotFoundLang = "zh" | "en";

export interface NotFoundMeta {
  /** 页面标题（不含站名后缀） */
  title: string;
  desc: string;
}

export const NOT_FOUND_META: Record<NotFoundLang, NotFoundMeta> = {
  zh: { title: "页面不存在", desc: "你访问的链接不存在或已被移除，请检查网址是否正确。" },
  en: { title: "Page not found", desc: "The page you're looking for doesn't exist or has been removed. Please check the URL." },
};

/** 404 壳 <title>：与 SPA `usePageTitle` 同一拼法 */
export const notFoundTitle = (lang: NotFoundLang): string => `${NOT_FOUND_META[lang].title} | DomainHunter`;
