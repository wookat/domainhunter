import { INDUSTRY_GUIDES } from "./content/guides";

const LASTMOD_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * sitemap 单条 <lastmod>：内容数据自带 updatedAt 的条目（目前仅 /guide/:slug）用各自日期，
 * 其余沿用全站 fallback（CONTENT_LASTMOD）。不做「全部改成今天」——那是给搜索引擎发假信号。
 */
export function sitemapLastmod(path: string, fallback: string): string {
  if (path.startsWith("/guide/")) {
    const slug = path.slice("/guide/".length);
    const updatedAt = INDUSTRY_GUIDES[slug]?.updatedAt;
    if (updatedAt && LASTMOD_RE.test(updatedAt)) return updatedAt;
  }
  return fallback;
}
