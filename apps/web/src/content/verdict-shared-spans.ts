/**
 * /vs 判断段（verdict）跨页共用连续片段的口径（纯函数，无 DOM/无依赖）。
 * 被 compare-verdict-shared.test.ts（守门）与 scripts/seo-audit/vs-shared-ngrams.mjs（审计输出）共用，
 * 两处永远同一口径；脚本经 Node 类型擦除直接 import 本文件，因此这里只用可擦除的 TS 语法。
 *
 *   en：小写；除字母/数字/撇号/连字符/点以外的字符视为分隔；再剥掉词首尾的 . ' -（".com" "name.uk" 各算一词）。
 *   zh：去掉空白/标点/符号后按字符切分。
 */

export interface SharedSpan {
  a: string;
  b: string;
  len: number;
  span: string;
}

export interface TokenPage {
  slug: string;
  tokens: string[];
}

export const tokenizeEn = (s: string): string[] =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'’.-]+/gu, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[.'’-]+|[.'’-]+$/g, ""))
    .filter(Boolean);

export const tokenizeZh = (s: string): string[] => [...s.replace(/[\s\p{P}\p{S}]/gu, "")];

/**
 * 任意两页共享的 ≥n token 连续片段：先索引所有 n-gram，再把同一对页面里位置相邻的命中合并成最长 span。
 * 返回按长度倒序（同长按 slug）排序；span 取 a 侧原 token 用 joiner 拼回。
 */
export function sharedSpans(pages: readonly TokenPage[], n: number, joiner: string): SharedSpan[] {
  const index = new Map<string, { slug: string; pos: number }[]>();
  for (const { slug, tokens } of pages) {
    for (let i = 0; i + n <= tokens.length; i++) {
      const g = tokens.slice(i, i + n).join("\u0001");
      const arr = index.get(g) ?? [];
      arr.push({ slug, pos: i });
      index.set(g, arr);
    }
  }
  const bySlug = new Map(pages.map((p) => [p.slug, p.tokens] as const));
  const hits = new Map<string, Set<number>>();
  for (const arr of index.values()) {
    if (arr.length < 2) continue;
    for (const x of arr) {
      for (const y of arr) {
        if (x.slug >= y.slug) continue;
        const k = `${x.slug}|${y.slug}`;
        const set = hits.get(k) ?? new Set<number>();
        set.add(x.pos);
        hits.set(k, set);
      }
    }
  }
  const out: SharedSpan[] = [];
  for (const [k, set] of hits) {
    const [a, b] = k.split("|");
    const pos = [...set].sort((p, q) => p - q);
    const tokens = bySlug.get(a) ?? [];
    let start = pos[0];
    let prev = pos[0];
    const flush = () => out.push({ a, b, len: prev + n - start, span: tokens.slice(start, prev + n).join(joiner) });
    for (let i = 1; i < pos.length; i++) {
      if (pos[i] === prev + 1) {
        prev = pos[i];
        continue;
      }
      flush();
      start = prev = pos[i];
    }
    flush();
  }
  return out.sort((x, y) => y.len - x.len || x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
}

export const pairKeys = (spans: readonly SharedSpan[]): Set<string> => new Set(spans.map((s) => `${s.a}|${s.b}`));
