/**
 * 轻量 TLD 常量：首屏 bundle（App/prices 等）只需要列表与汇率，
 * 完整指南文案（TLD_GUIDES，约 60KB）留在 tlds.ts，仅由懒加载页面与 worker 引用。
 * TLD_GUIDES 通过 `satisfies Record<Tld, TldGuide>` 与本列表编译期强一致。
 */
export const TLD_LIST = [
  "com", "net", "org", "io", "ai", "co", "app", "dev", "xyz", "cc",
  "tv", "cn", "me", "tech", "online", "store", "site", "top", "shop", "cloud",
  "pro", "vip", "club", "link", "live", "space", "fun", "art", "design", "studio",
  "info", "sh", "gg", "so", "us", "in",
] as const;

export type Tld = (typeof TLD_LIST)[number];

/** 美元→人民币换算参考汇率（估算值，仅供参考展示） */
export const USD_TO_CNY = 7.2;
