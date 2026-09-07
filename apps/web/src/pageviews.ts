// 服务端漏斗计数（R481）：Worker 每服务一个 HTML 文档 +1，按路由类别聚合到 KV 日键 pv:YYYY-MM-DD。
// 只存计数，不存 IP / UA 原文 / 路径原文；机器人 UA 单独计 bots（按家族），不进 pageviews。
// 写入策略：同一 isolate 内 flushDelayMs 窗口合并后一次读改写（waitUntil 落盘），把 KV 写次数
// 从「每个页面请求 1 次」压到「每窗口 1 次」，爬虫扫全站 1264 页也只产生少量写。
// 分片（R482）：KV 非原子，多 isolate 对同一键读改写会互相覆盖（生产实测 1s 内 3 页只入账 2 页）；
// 因此每个 isolate 只写自己的分片键 pv:YYYY-MM-DD:<shard>（单写者，无竞争），读侧 list 前缀求和，
// 并兼容分片前的旧日键 pv:YYYY-MM-DD。isolate 生命周期以小时计，一天分片数通常在几十到几百量级。
// R487 起分片/合并写/读侧聚合的通用实现在 sharded-counter.ts（usage:* 同用），本文件只保留 pv 的结构与归类。

import { dayKey, dayShardKey, dayShardPrefix, newShardId as newShardIdGeneric, readShardedDay, ShardedDayCounter, type DayCodec, type ShardKv, type ShardedCounterOptions } from "./sharded-counter";

export const PV_CATEGORIES = ["home", "results", "tld", "guide", "vs", "prices", "other"] as const;
export type PvCategory = (typeof PV_CATEGORIES)[number];

export const BOT_FAMILIES = ["google", "bing", "baidu", "ai", "other"] as const;
export type BotFamily = (typeof BOT_FAMILIES)[number];

export interface DayPageviews {
  pageviews: Partial<Record<PvCategory, number>>;
  bots: number;
  botsBy: Partial<Record<BotFamily, number>>;
}

export const PV_KEY_PREFIX = "pv:";
export const pvKey = (date: string) => dayKey(PV_KEY_PREFIX, date);
export const pvShardPrefix = (date: string) => dayShardPrefix(PV_KEY_PREFIX, date);
export const pvShardKey = (date: string, shard: string) => dayShardKey(PV_KEY_PREFIX, date, shard);
export const newShardId = newShardIdGeneric;
export const emptyDayPageviews = (): DayPageviews => ({ pageviews: {}, bots: 0, botsBy: {} });

/** 路由类别：results = 分享结果页 /s/:id（首页搜索→结果是同一文档内的状态切换，由 usage.searches 计） */
export function classifyPath(pathname: string): PvCategory {
  if (pathname === "/" || pathname === "") return "home";
  if (/^\/s\/[\w-]{1,32}$/.test(pathname)) return "results";
  if (pathname === "/tld" || pathname.startsWith("/tld/")) return "tld";
  if (pathname === "/guide" || pathname.startsWith("/guide/")) return "guide";
  if (pathname === "/vs" || pathname.startsWith("/vs/")) return "vs";
  if (pathname === "/prices") return "prices";
  return "other";
}

// 顺序有意义：AI 爬虫名字大多含 "bot"，必须先于通配的 other 判定
const BOT_PATTERNS: ReadonlyArray<readonly [BotFamily, RegExp]> = [
  ["google", /Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google|APIs-Google|Storebot-Google|GoogleOther|Google-Site-Verification/i],
  ["bing", /bingbot|BingPreview|msnbot|adidxbot|MicrosoftPreview/i],
  ["baidu", /Baiduspider/i],
  ["ai", /GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|Claude-User|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Amazonbot|meta-externalagent|Google-Extended|cohere-ai|Diffbot|YouBot|DuckAssistBot/i],
  [
    "other",
    /bot\b|bot\/|crawl|spider|slurp|yandex|duckduck|sogou|Applebot|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|Slackbot|AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|ia_archiver|archive\.org|HeadlessChrome|Lighthouse|PageSpeed|Chrome-Lighthouse|curl\/|Wget\/|python-requests|python-urllib|aiohttp|Go-http-client|okhttp|Java\/|libwww|HttpClient|axios\/|node-fetch|undici|scrapy|Dataprovider|SiteAuditBot|Screaming Frog|UptimeRobot|Pingdom|StatusCake/i,
  ],
];

/** 识别机器人 UA；空 UA 视为脚本流量（other）。返回 null = 当作真人 */
export function detectBot(ua: string | null | undefined): BotFamily | null {
  const s = (ua ?? "").trim();
  if (!s) return "other";
  for (const [family, re] of BOT_PATTERNS) if (re.test(s)) return family;
  return null;
}

export function bumpDay(day: DayPageviews, pathname: string, ua: string | null | undefined): DayPageviews {
  const bot = detectBot(ua);
  if (bot) {
    day.bots += 1;
    day.botsBy[bot] = (day.botsBy[bot] ?? 0) + 1;
    return day;
  }
  const cat = classifyPath(pathname);
  day.pageviews[cat] = (day.pageviews[cat] ?? 0) + 1;
  return day;
}

export function mergeDay(into: DayPageviews, from: DayPageviews): DayPageviews {
  for (const k of PV_CATEGORIES) {
    const n = from.pageviews[k] ?? 0;
    if (n) into.pageviews[k] = (into.pageviews[k] ?? 0) + n;
  }
  into.bots += from.bots;
  for (const k of BOT_FAMILIES) {
    const n = from.botsBy[k] ?? 0;
    if (n) into.botsBy[k] = (into.botsBy[k] ?? 0) + n;
  }
  return into;
}

/** 读回的 JSON 可能缺字段（旧版本/手工写入），补齐成完整结构 */
export function normalizeDay(raw: Partial<DayPageviews> | null | undefined): DayPageviews {
  return {
    pageviews: { ...(raw?.pageviews ?? {}) },
    bots: typeof raw?.bots === "number" ? raw.bots : 0,
    botsBy: { ...(raw?.botsBy ?? {}) },
  };
}

export type PvKv = ShardKv;

export const PV_CODEC: DayCodec<DayPageviews> = {
  keyPrefix: PV_KEY_PREFIX,
  empty: emptyDayPageviews,
  normalize: normalizeDay,
  merge: mergeDay,
};

/** 读侧汇总：旧日键 + 全部分片键求和；任一读失败按空处理（下界近似，不抛） */
export const readDayPageviews = (kv: PvKv, date: string, maxPages = 5): Promise<DayPageviews | null> => readShardedDay(kv, PV_CODEC, date, maxPages);

export type PageviewCounterOptions = ShardedCounterOptions;

/** 每 isolate 一个实例；合并窗口默认 5s（吸收爬虫扫全站的写洪峰） */
export class PageviewCounter extends ShardedDayCounter<DayPageviews> {
  constructor(kv: PvKv | undefined, opts: PageviewCounterOptions = {}) {
    super(kv, PV_CODEC, { flushDelayMs: 5000, ...opts });
  }

  /** 记一次 HTML 文档请求；返回应交给 waitUntil 的落盘 Promise（无 KV 时立即 resolve） */
  record(pathname: string, ua: string | null | undefined): Promise<void> {
    return this.add((day) => {
      bumpDay(day, pathname, ua);
    });
  }
}
