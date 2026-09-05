// R488 SEO 技术审计：纯 Node（无第三方依赖、0 AI）的 HTML 抽取/度量工具。
// 生产 SSR HTML 由我们自己的 worker 生成、结构稳定，因此用正则做结构化抽取足够（不引入 HTML parser 依赖）。

/** 生产 origin：sitemap <loc> 与 SSR 绝对链接始终以它为前缀（worker SITE_ORIGIN 常量） */
export const PROD_ORIGIN = "https://hunt.zalize.com";
/** 实际抓取的 origin：默认生产；本地验收时 SEO_AUDIT_ORIGIN=http://127.0.0.1:8787 指向 wrangler dev */
export const SITE_ORIGIN = (process.env.SEO_AUDIT_ORIGIN ?? PROD_ORIGIN).replace(/\/$/, "");
// UA 含 "SiteAuditBot" → 被 worker pageviews.ts 归入 botsBy.other，不污染人类 pageviews；含 "Mozilla/5.0" 前缀避免 Cloudflare 对裸 curl UA 的 403。
// SEO_AUDIT_UA 可覆盖（如 R512 用 "DomainHunter-audit/…"），仍需保留 SiteAuditBot 标记。
export const UA = process.env.SEO_AUDIT_UA ?? "Mozilla/5.0 (compatible; DomainHunterSeoAudit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot";

/** 可复现的伪随机数（mulberry32），同一 seed 抽同一批样本 */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sample(arr, n, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n).sort();
}

export async function fetchText(url, { retries = 2 } = {}) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xml;q=0.9,*/*;q=0.8" }, redirect: "manual" });
      const text = await res.text();
      return { status: res.status, text, headers: Object.fromEntries(res.headers) };
    } catch (e) {
      if (i >= retries) return { status: 0, text: "", headers: {}, error: String(e) };
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
}

/** 简单并发池 */
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

export function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", hellip: "…", rarr: "→", larr: "←" };
export function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}

const stripTags = (html) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** 去掉 script/style/svg/noscript/template 等不可见内容 */
export function stripInvisible(html) {
  return html.replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
}

/**
 * 正文抽取算法（报告中引用）：
 * 1. 取 <main>…</main>（SSR 内容页/hub 均有 <main>；首页无 <main> 时取 <body>）；
 * 2. 去 <header>/<nav>/<footer>/<aside> 与 script/style/svg；
 * 3. mainText = 剩余可见文本；proseText = 再去掉所有 <a>…</a>（把"相关链接 chip 行"这种导航式内链当作非正文）。
 * 计数：CJK 每个汉字算 1 词，拉丁按空白分词算 1 词；同时给字符数。
 */
export function extractText(html) {
  let h = stripInvisible(html);
  const main = h.match(/<main\b[\s\S]*?<\/main>/i);
  h = main ? main[0] : (h.match(/<body\b[\s\S]*?<\/body>/i)?.[0] ?? h);
  h = h.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
  const mainText = stripTags(h);
  const proseText = stripTags(h.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " "));
  return { mainText, proseText };
}

export function wordCount(text) {
  const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []).length;
  const latin = (text.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ").match(/[A-Za-z0-9][A-Za-z0-9'’\-.]*/g) ?? []).length;
  return { chars: text.replace(/\s/g, "").length, cjk, latin, words: cjk + latin };
}

export function meta(html) {
  const head = html.match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? html;
  const attr = (re) => decodeEntities(head.match(re)?.[1] ?? "");
  const canonical = attr(/<link rel="canonical" href="([^"]*)"/);
  const hreflang = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: decodeEntities(m[2]) }));
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      const j = JSON.parse(m[1]);
      return j["@type"] ?? (Array.isArray(j["@graph"]) ? j["@graph"].map((x) => x["@type"]).join("+") : "?");
    } catch {
      return "INVALID_JSON";
    }
  });
  const body = stripInvisible(html);
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const h2 = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));
  return {
    title: stripTags(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: attr(/<meta name="description" content="([^"]*)"/),
    robots: attr(/<meta name="robots" content="([^"]*)"/),
    htmlLang: attr(/<html[^>]*\blang="([^"]*)"/),
    canonical,
    hreflang,
    jsonld,
    h1,
    h2Count: h2.length,
  };
}

/** 站内链接：返回去掉 origin 的路径（含 query），只保留 http(s)://hunt.zalize.com 与根相对链接，排除静态资源 */
export function internalLinks(html) {
  const body = stripInvisible(html);
  const out = [];
  for (const m of body.matchAll(/<a\b[^>]*\bhref="([^"#]*)(#[^"]*)?"/gi)) {
    let href = decodeEntities(m[1]);
    for (const o of [PROD_ORIGIN, SITE_ORIGIN]) if (href.startsWith(o)) href = href.slice(o.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (/\.(js|css|png|svg|ico|woff2?|webmanifest|txt|xml)$/i.test(href.split("?")[0])) continue;
    out.push(href);
  }
  return out;
}

/** 规范化：去掉 lang 参数（?lang=zh|en），用于"逻辑页面"层面的图 */
export function stripLang(path) {
  const [p, q = ""] = path.split("?");
  const params = q.split("&").filter((kv) => kv && !/^lang=/.test(kv));
  return params.length ? `${p}?${params.join("&")}` : p;
}

/** 字符 k-shingle（默认 k=5，CJK/拉丁统一按字符，先去空白与标点） */
export function shingles(text, k = 5) {
  const s = text.replace(/[\s\p{P}]/gu, "");
  const set = new Set();
  for (let i = 0; i + k <= s.length; i++) set.add(s.slice(i, i + k));
  return set;
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export const pct = (x, d = 1) => `${(x * 100).toFixed(d)}%`;
export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
export const median = (xs) => {
  if (!xs.length) return 0;
  const s = xs.slice().sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
