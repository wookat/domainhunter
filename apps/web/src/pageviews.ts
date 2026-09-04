// 服务端漏斗计数（R481）：Worker 每服务一个 HTML 文档 +1，按路由类别聚合到 KV 日键 pv:YYYY-MM-DD。
// 只存计数，不存 IP / UA 原文 / 路径原文；机器人 UA 单独计 bots（按家族），不进 pageviews。
// 写入策略：同一 isolate 内 flushDelayMs 窗口合并后一次读改写（waitUntil 落盘），把 KV 写次数
// 从「每个页面请求 1 次」压到「每窗口 1 次」，爬虫扫全站 1264 页也只产生少量写。
// 分片（R482）：KV 非原子，多 isolate 对同一键读改写会互相覆盖（生产实测 1s 内 3 页只入账 2 页）；
// 因此每个 isolate 只写自己的分片键 pv:YYYY-MM-DD:<shard>（单写者，无竞争），读侧 list 前缀求和，
// 并兼容分片前的旧日键 pv:YYYY-MM-DD。isolate 生命周期以小时计，一天分片数通常在几十到几百量级。

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
export const pvKey = (date: string) => `${PV_KEY_PREFIX}${date}`;
export const pvShardPrefix = (date: string) => `${PV_KEY_PREFIX}${date}:`;
export const pvShardKey = (date: string, shard: string) => `${pvShardPrefix(date)}${shard}`;
export const newShardId = () => Math.random().toString(36).slice(2, 10) || "0";
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

export interface PvKv {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list?(options: { prefix: string; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}

/** 读侧汇总：旧日键 + 全部分片键求和；任一读失败按空处理（下界近似，不抛） */
export async function readDayPageviews(kv: PvKv, date: string, maxPages = 5): Promise<DayPageviews | null> {
  const legacy = await kv.get<DayPageviews>(pvKey(date), "json").catch(() => null);
  const shardKeys: string[] = [];
  if (kv.list) {
    let cursor: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const res = await kv.list({ prefix: pvShardPrefix(date), cursor }).catch(() => null);
      if (!res) break;
      for (const k of res.keys) shardKeys.push(k.name);
      if (res.list_complete || !res.cursor) break;
      cursor = res.cursor;
    }
  }
  if (!legacy && shardKeys.length === 0) return null;
  const shards = await Promise.all(shardKeys.map((k) => kv.get<DayPageviews>(k, "json").catch(() => null)));
  const total = normalizeDay(legacy);
  for (const s of shards) if (s) mergeDay(total, normalizeDay(s));
  return total;
}

export interface PageviewCounterOptions {
  /** 合并窗口；Workers 的 waitUntil 上限 30s，默认 5s */
  flushDelayMs?: number;
  /** 日键保留秒数，与 usage:* 一致（45 天） */
  ttlSeconds?: number;
  /** 分片 id，默认每个 counter 实例（= isolate）随机一个 */
  shardId?: string;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class PageviewCounter {
  private pending = new Map<string, DayPageviews>();
  private scheduled: Promise<void> | null = null;
  private readonly flushDelayMs: number;
  private readonly ttlSeconds: number;
  readonly shardId: string;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  /** 累计成功落盘次数（测试/诊断用） */
  flushes = 0;

  constructor(
    private readonly kv: PvKv | undefined,
    opts: PageviewCounterOptions = {},
  ) {
    this.flushDelayMs = opts.flushDelayMs ?? 5000;
    this.ttlSeconds = opts.ttlSeconds ?? 45 * 86400;
    this.shardId = opts.shardId ?? newShardId();
    this.now = opts.now ?? Date.now;
    this.sleep = opts.sleep ?? defaultSleep;
  }

  /** 记一次 HTML 文档请求；返回应交给 waitUntil 的落盘 Promise（无 KV 时立即 resolve） */
  record(pathname: string, ua: string | null | undefined): Promise<void> {
    if (!this.kv) return Promise.resolve();
    const date = new Date(this.now()).toISOString().slice(0, 10);
    const day = this.pending.get(date) ?? emptyDayPageviews();
    this.pending.set(date, bumpDay(day, pathname, ua));
    if (!this.scheduled) {
      this.scheduled = this.sleep(this.flushDelayMs)
        .then(() => this.flush())
        .finally(() => {
          this.scheduled = null;
        });
    }
    return this.scheduled;
  }

  /** 立即把 pending 合并写入 KV；失败的日键回滚到 pending，等下一窗口重试 */
  async flush(): Promise<void> {
    if (!this.kv) return;
    const batch = this.pending;
    this.pending = new Map();
    for (const [date, delta] of batch) {
      try {
        const key = pvShardKey(date, this.shardId);
        const cur = normalizeDay(await this.kv.get<DayPageviews>(key, "json"));
        await this.kv.put(key, JSON.stringify(mergeDay(cur, delta)), { expirationTtl: this.ttlSeconds });
        this.flushes += 1;
      } catch {
        const back = this.pending.get(date);
        this.pending.set(date, back ? mergeDay(back, delta) : delta);
      }
    }
  }

  /** 测试/诊断：当前未落盘的快照 */
  pendingSnapshot(): Record<string, DayPageviews> {
    return Object.fromEntries(this.pending);
  }
}
