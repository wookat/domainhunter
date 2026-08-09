/**
 * 内容枢纽索引页（/tld、/guide、/vs）共享数据聚合 —— 仅供 worker（SSR meta / 骨架 / OG / sitemap）使用。
 * 前端 hub 页组件请直接引用 hubs-tld / hubs-guide / hubs-vs，
 * 避免把三份 hub 索引打进同一个前端 chunk（R282 移动性能优化）。
 * 只依赖轻量数据（tld-list + 生成的 hub-index-*），不引入 tlds/guides/compares 全文 chunk，
 * hub 页 JS 体积因此与全文内容规模解耦（R271 移动性能优化）。
 */
import { GUIDE_HUB_META } from "./hubs-guide";
import { TLD_HUB_META } from "./hubs-tld";
import { VS_HUB_META } from "./hubs-vs";

export { tldHubGroups, tldOneLiner } from "./hubs-tld";
export { guideHubGroups, guideHubLabel, guideOneLiner } from "./hubs-guide";
export { compareHubGroups, compareHubPair, compareHubTitle } from "./hubs-vs";

export const HUB_META = {
  tld: TLD_HUB_META,
  guide: GUIDE_HUB_META,
  vs: VS_HUB_META,
} as const;
