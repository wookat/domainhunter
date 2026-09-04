/**
 * 注册入口单一数据源（R480）：所有"去注册"外链都从这里生成。
 * - 返佣参数来自 Worker 公开配置（wrangler vars REGISTRAR_AFFILIATE_JSON → GET /api/registrars），
 *   不是 secret；未配置时 registrarLink() 返回与 url(d) 逐字相同的纯搜索链接。
 * - 排序规则见 registrarsFor()；调研证据见 docs/research/registrar-affiliate.md。
 * 本模块被 worker.ts 与前端共用，不得引入 React / DOM。
 */

export type RegistrarId = "porkbun" | "namecheap" | "dynadot" | "cloudflare" | "aliyun" | "tencent";
export type RegistrarRegion = "cn" | "global";

/**
 * 单家注册商的公开返佣参数（均可选，二者可同时给出：先拼 query 再套 redirect）。
 * - query：追加到搜索链接的 query 参数，如阿里云 usercode、Namecheap 自有 aff
 * - redirect：联盟平台专用跳转链接模板（Impact / CJ 深链），`{url}` 占位替换为 encodeURIComponent(搜索链接)
 */
export interface AffiliateParams {
  query?: Record<string, string>;
  redirect?: string;
}

export type AffiliateConfig = Partial<Record<RegistrarId, AffiliateParams>>;

export interface Registrar {
  id: RegistrarId;
  name: string;
  region: RegistrarRegion;
  /** 纯搜索链接（未配置返佣时的唯一输出） */
  url: (d: string) => string;
  /** 带返佣参数的链接；未定义 = 该注册商无联盟计划，配置被忽略 */
  affiliate?: (d: string, params: AffiliateParams) => string;
  /** 不支持的 TLD 返回 false（该注册商从菜单中隐藏）；未定义 = 全部支持 */
  supportsTld?: (tld: string) => boolean;
}

export const REGISTRAR_IDS: readonly RegistrarId[] = ["porkbun", "namecheap", "dynadot", "cloudflare", "aliyun", "tencent"];

export function isRegistrarId(v: unknown): v is RegistrarId {
  return typeof v === "string" && (REGISTRAR_IDS as readonly string[]).includes(v);
}

const REDIRECT_PLACEHOLDER = "{url}";

/** 通用返佣链接拼装：query 参数追加到搜索链接（hash 之前），再按需套联盟跳转模板 */
export function applyAffiliate(base: string, params: AffiliateParams): string {
  let out = base;
  const entries = Object.entries(params.query ?? {}).filter(([k, v]) => k && v);
  if (entries.length > 0) {
    const hashAt = out.indexOf("#");
    const head = hashAt >= 0 ? out.slice(0, hashAt) : out;
    const hash = hashAt >= 0 ? out.slice(hashAt) : "";
    const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
    out = `${head}${head.includes("?") ? "&" : "?"}${qs}${hash}`;
  }
  if (params.redirect && params.redirect.includes(REDIRECT_PLACEHOLDER)) {
    out = params.redirect.split(REDIRECT_PLACEHOLDER).join(encodeURIComponent(out));
  }
  return out;
}

/** .cn / .com.cn / .net.cn … 一律视为中国后缀 */
export function isCnTld(tld: string): boolean {
  const t = tld.toLowerCase().replace(/^\./, "");
  return t === "cn" || t.endsWith(".cn");
}

const notCn = (tld: string) => !isCnTld(tld);

/**
 * 基础顺序即"非中国后缀"的展示顺序：Porkbun → Namecheap → Dynadot → Cloudflare → 阿里云 → 腾讯云。
 * supportsTld 依据：Porkbun 定价 API 无 cn/com.cn 条目；Namecheap 搜索页对 .cn/.com.cn 返回 "Unsupported TLD"；
 * Cloudflare TLD 政策页数据无 cn/com.cn；Dynadot 官方 /domain/cn、/domain/com.cn 有售且中文站/人民币可用（均见 docs/research/registrar-affiliate.md §4）。
 */
const searchUrl = {
  porkbun: (d: string) => `https://porkbun.com/checkout/search?q=${encodeURIComponent(d)}`,
  namecheap: (d: string) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}`,
  dynadot: (d: string) => `https://www.dynadot.com/domain/search?domain=${encodeURIComponent(d)}`,
  cloudflare: (d: string) => `https://domains.cloudflare.com/?domain=${encodeURIComponent(d)}`,
  aliyun: (d: string) => `https://wanwang.aliyun.com/domain/searchresult/#/?keyword=${encodeURIComponent(d)}`,
  tencent: (d: string) => `https://buy.cloud.tencent.com/domain?domain=${encodeURIComponent(d)}`,
} satisfies Record<RegistrarId, (d: string) => string>;

const withAffiliate = (id: RegistrarId) => (d: string, p: AffiliateParams) => applyAffiliate(searchUrl[id](d), p);

export const REGISTRARS: readonly Registrar[] = [
  { id: "porkbun", name: "Porkbun", region: "global", url: searchUrl.porkbun, affiliate: withAffiliate("porkbun"), supportsTld: notCn },
  { id: "namecheap", name: "Namecheap", region: "global", url: searchUrl.namecheap, affiliate: withAffiliate("namecheap"), supportsTld: notCn },
  // Dynadot：唯一同时售 .cn/.com.cn 且提供中文界面 + 人民币/支付宝的海外注册商，是 .cn 菜单里阿里云/腾讯云之外的海外备选
  { id: "dynadot", name: "Dynadot", region: "global", url: searchUrl.dynadot, affiliate: withAffiliate("dynadot") },
  // Cloudflare Registrar 按成本价售卖、无联盟计划：不定义 affiliate，配置了参数也保持纯链接
  { id: "cloudflare", name: "Cloudflare", region: "global", url: searchUrl.cloudflare, supportsTld: notCn },
  { id: "aliyun", name: "阿里云", region: "cn", url: searchUrl.aliyun, affiliate: withAffiliate("aliyun") },
  { id: "tencent", name: "腾讯云", region: "cn", url: searchUrl.tencent, affiliate: withAffiliate("tencent") },
];

/** 域名 → TLD（首个点之后的全部：foo.com.cn → com.cn；无点字符串视为 TLD 本身） */
export function tldOf(domainOrTld: string): string {
  const s = domainOrTld.toLowerCase().replace(/^\./, "");
  const i = s.indexOf(".");
  return i < 0 ? s : s.slice(i + 1);
}

/**
 * 某域名/TLD 应展示的注册商及顺序（确定性、稳定排序）：
 * 1. 过滤掉 supportsTld(tld) === false 的注册商；
 * 2. 中国后缀（isCnTld）：region "cn" 在前（阿里云、腾讯云），其余按基础顺序跟随；
 * 3. 其他后缀：region "global" 在前（Porkbun、Namecheap、Dynadot、Cloudflare），region "cn" 跟随。
 */
export function registrarsFor(domainOrTld: string): Registrar[] {
  const tld = tldOf(domainOrTld);
  const preferred: RegistrarRegion = isCnTld(tld) ? "cn" : "global";
  const supported = REGISTRARS.filter((r) => r.supportsTld?.(tld) ?? true);
  return [...supported.filter((r) => r.region === preferred), ...supported.filter((r) => r.region !== preferred)];
}

/** 单入口场景（快速核验 chip、监控页、批量注册、结果页 Enter）使用的首选注册商 */
export function primaryRegistrar(domainOrTld: string): Registrar {
  return registrarsFor(domainOrTld)[0] ?? REGISTRARS[0];
}

export interface RegistrarLink {
  href: string;
  /** 链接含返佣参数（rel 需带 sponsored，页脚需显示返佣声明） */
  sponsored: boolean;
  rel: string;
}

/** 生成外链：无配置 / 配置为空 / 注册商无 affiliate 实现 → 与 url(d) 完全一致 */
export function registrarLink(r: Registrar, domain: string, cfg: AffiliateConfig | undefined): RegistrarLink {
  const base = r.url(domain);
  const params = cfg?.[r.id];
  const href = params && r.affiliate ? r.affiliate(domain, params) : base;
  const sponsored = href !== base;
  return { href, sponsored, rel: sponsored ? "noopener noreferrer sponsored" : "noopener noreferrer" };
}

/** 至少一家已配置且能生效的返佣（用于控制返佣声明显隐） */
export function hasActiveAffiliate(cfg: AffiliateConfig | undefined): boolean {
  if (!cfg) return false;
  return REGISTRARS.some((r) => Boolean(r.affiliate) && Boolean(cfg[r.id]) && registrarLink(r, "example.com", cfg).sponsored);
}

const SAFE_REDIRECT_RE = /^https:\/\/[^\s"'<>]+$/;

/**
 * 把任意输入（wrangler var 解析结果）收敛为合法的 AffiliateConfig：
 * 未知注册商 / 非对象 / 非字符串键值 / 非 https 或不含 {url} 的 redirect 一律丢弃。
 * 任何非法输入都退化为 {}，与未配置完全一致。
 */
export function parseAffiliateConfig(raw: unknown): AffiliateConfig {
  const out: AffiliateConfig = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!isRegistrarId(id) || !v || typeof v !== "object" || Array.isArray(v)) continue;
    const entry = v as { query?: unknown; redirect?: unknown };
    const params: AffiliateParams = {};
    if (entry.query && typeof entry.query === "object" && !Array.isArray(entry.query)) {
      const q: Record<string, string> = {};
      for (const [k, val] of Object.entries(entry.query as Record<string, unknown>)) {
        if (typeof val === "string" && val && /^[\w.-]{1,64}$/.test(k)) q[k] = val;
      }
      if (Object.keys(q).length > 0) params.query = q;
    }
    if (typeof entry.redirect === "string" && entry.redirect.includes(REDIRECT_PLACEHOLDER) && SAFE_REDIRECT_RE.test(entry.redirect)) {
      params.redirect = entry.redirect;
    }
    if (params.query || params.redirect) out[id] = params;
  }
  return out;
}

/** 解析 wrangler var 原文（JSON 字符串）；空/非法 JSON → {} */
export function parseAffiliateJson(text: string | undefined | null): AffiliateConfig {
  if (!text || !text.trim()) return {};
  try {
    return parseAffiliateConfig(JSON.parse(text));
  } catch {
    return {};
  }
}
