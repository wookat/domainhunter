import { describe, expect, it } from "vitest";
import { classifyPath, detectBot, PageviewCounter, pvKey, pvShardKey, readDayPageviews, type DayPageviews, type PvKv } from "./pageviews";

const CHROME = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const IOS_SAFARI = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const WECHAT =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.42";

function memKv(opts?: { failPuts?: number }): PvKv & { store: Map<string, string>; puts: number } {
  const store = new Map<string, string>();
  const kv = {
    store,
    puts: 0,
    async get<T>(key: string): Promise<T | null> {
      const v = store.get(key);
      return v ? (JSON.parse(v) as T) : null;
    },
    async put(key: string, value: string) {
      kv.puts++;
      if (opts?.failPuts && kv.puts <= opts.failPuts) throw new Error("kv down");
      store.set(key, value);
    },
    async list({ prefix }: { prefix: string }) {
      return { keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true };
    },
  };
  return kv;
}

const SHARD = "t1";
const readDay = (kv: { store: Map<string, string> }, date: string): DayPageviews => JSON.parse(kv.store.get(pvShardKey(date, SHARD))!);

describe("classifyPath", () => {
  it("按路由类别归类，未知路径归 other", () => {
    expect(classifyPath("/")).toBe("home");
    expect(classifyPath("/s/abc123_-")).toBe("results");
    expect(classifyPath("/tld")).toBe("tld");
    expect(classifyPath("/tld/com")).toBe("tld");
    expect(classifyPath("/guide")).toBe("guide");
    expect(classifyPath("/guide/ai-startup")).toBe("guide");
    expect(classifyPath("/vs")).toBe("vs");
    expect(classifyPath("/vs/com-vs-cn")).toBe("vs");
    expect(classifyPath("/prices")).toBe("prices");
    for (const p of ["/why", "/mcp", "/advanced", "/shortlist", "/monitors", "/does-not-exist", "/tldx", "/s/"]) {
      expect(classifyPath(p), p).toBe("other");
    }
  });
});

describe("detectBot", () => {
  it("真人浏览器不算机器人", () => {
    expect(detectBot(CHROME)).toBeNull();
    expect(detectBot(IOS_SAFARI)).toBeNull();
    expect(detectBot(WECHAT)).toBeNull();
  });
  it("搜索引擎按家族识别", () => {
    expect(detectBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe("google");
    expect(detectBot("Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe("google");
    expect(detectBot("Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)")).toBe("google");
    expect(detectBot("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36")).toBe("bing");
    expect(detectBot("Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)")).toBe("baidu");
  });
  it("AI 爬虫优先于通配 bot 归入 ai", () => {
    expect(detectBot("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot")).toBe("ai");
    expect(detectBot("Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)")).toBe("ai");
    expect(detectBot("Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)")).toBe("ai");
    expect(detectBot("Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)")).toBe("ai");
  });
  it("脚本/工具/空 UA 归 other", () => {
    expect(detectBot("curl/8.5.0")).toBe("other");
    expect(detectBot("python-requests/2.32.0")).toBe("other");
    expect(detectBot("Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)")).toBe("other");
    expect(detectBot("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36")).toBe("other");
    expect(detectBot("")).toBe("other");
    expect(detectBot(undefined)).toBe("other");
  });
});

describe("PageviewCounter", () => {
  const T0 = Date.parse("2026-09-04T10:00:00Z");
  const manual = () => {
    let release: () => void = () => {};
    const gate = new Promise<void>((r) => (release = r));
    return { sleep: () => gate, release: () => release() };
  };

  it("同窗口多次请求合并为一次 KV 写；按类别与 bots 分开计", async () => {
    const kv = memKv();
    const m = manual();
    const pc = new PageviewCounter(kv, { now: () => T0, sleep: m.sleep, shardId: SHARD });
    const p1 = pc.record("/", CHROME);
    const p2 = pc.record("/tld/com", IOS_SAFARI);
    const p3 = pc.record("/tld/cn", CHROME);
    const p4 = pc.record("/guide/ai-startup", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
    const p5 = pc.record("/why", "curl/8.5.0");
    expect(p1).toBe(p2); // 同一个已排程的 flush
    expect(kv.puts).toBe(0);
    m.release();
    await Promise.all([p1, p2, p3, p4, p5]);
    expect(kv.puts).toBe(1);
    const day = readDay(kv, "2026-09-04");
    expect(day.pageviews).toEqual({ home: 1, tld: 2 });
    expect(day.bots).toBe(2);
    expect(day.botsBy).toEqual({ google: 1, other: 1 });
    expect(pc.pendingSnapshot()).toEqual({});
  });

  it("与 KV 中已有的本分片当日计数累加，不覆盖", async () => {
    const kv = memKv();
    kv.store.set(pvShardKey("2026-09-04", SHARD), JSON.stringify({ pageviews: { home: 10, vs: 1 }, bots: 3, botsBy: { bing: 3 } }));
    const pc = new PageviewCounter(kv, { now: () => T0, sleep: async () => {}, shardId: SHARD });
    await pc.record("/", CHROME);
    await pc.record("/vs/com-vs-cn", CHROME);
    const day = readDay(kv, "2026-09-04");
    expect(day.pageviews).toEqual({ home: 11, vs: 2 });
    expect(day.bots).toBe(3);
    expect(day.botsBy).toEqual({ bing: 3 });
  });

  it("跨 UTC 日界的请求落到各自日键", async () => {
    const kv = memKv();
    let now = Date.parse("2026-09-04T23:59:59Z");
    const m = manual();
    const pc = new PageviewCounter(kv, { now: () => now, sleep: m.sleep, shardId: SHARD });
    const a = pc.record("/prices", CHROME);
    now = Date.parse("2026-09-05T00:00:01Z");
    const b = pc.record("/prices", CHROME);
    m.release();
    await Promise.all([a, b]);
    expect(readDay(kv, "2026-09-04").pageviews).toEqual({ prices: 1 });
    expect(readDay(kv, "2026-09-05").pageviews).toEqual({ prices: 1 });
    expect(kv.puts).toBe(2);
  });

  it("KV 写失败时保留 pending，下一窗口重试不丢计数", async () => {
    const kv = memKv({ failPuts: 1 });
    const pc = new PageviewCounter(kv, { now: () => T0, sleep: async () => {}, shardId: SHARD });
    await pc.record("/", CHROME);
    expect(kv.store.size).toBe(0);
    expect(pc.pendingSnapshot()["2026-09-04"]?.pageviews).toEqual({ home: 1 });
    await pc.record("/", CHROME);
    expect(readDay(kv, "2026-09-04").pageviews).toEqual({ home: 2 });
    expect(pc.pendingSnapshot()).toEqual({});
  });

  it("无 KV 绑定：record 立即完成且不抛", async () => {
    const pc = new PageviewCounter(undefined);
    await expect(pc.record("/", CHROME)).resolves.toBeUndefined();
  });

  it("旧格式/残缺 JSON 读回后补齐结构", async () => {
    const kv = memKv();
    kv.store.set(pvShardKey("2026-09-04", SHARD), JSON.stringify({ pageviews: { home: 1 } }));
    const pc = new PageviewCounter(kv, { now: () => T0, sleep: async () => {}, shardId: SHARD });
    await pc.record("/", "curl/8");
    expect(readDay(kv, "2026-09-04")).toEqual({ pageviews: { home: 1 }, bots: 1, botsBy: { other: 1 } });
  });

  it("多 isolate 并发写同一天：各写自己的分片，不互相覆盖（R482）", async () => {
    const kv = memKv();
    // 模拟两个 isolate 的 flush 交错：都先读到空，再各自写回——同键下会丢一份，分片下两份都在
    const a = new PageviewCounter(kv, { now: () => T0, sleep: async () => {}, shardId: "isoA" });
    const b = new PageviewCounter(kv, { now: () => T0, sleep: async () => {}, shardId: "isoB" });
    await Promise.all([a.record("/", CHROME), b.record("/tld/com", CHROME), a.record("/tld/cn", CHROME)]);
    expect(a.shardId).not.toBe(b.shardId);
    expect(kv.store.has(pvShardKey("2026-09-04", "isoA"))).toBe(true);
    expect(kv.store.has(pvShardKey("2026-09-04", "isoB"))).toBe(true);
    expect(kv.store.has(pvKey("2026-09-04"))).toBe(false);
    const total = await readDayPageviews(kv, "2026-09-04");
    expect(total?.pageviews).toEqual({ home: 1, tld: 2 });
  });

  it("默认分片 id 每个实例独立且非空", () => {
    const ids = new Set(Array.from({ length: 20 }, () => new PageviewCounter(undefined).shardId));
    expect(ids.size).toBe(20);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe("readDayPageviews", () => {
  it("旧日键 + 全部分片求和，残缺结构补齐", async () => {
    const kv = memKv();
    kv.store.set(pvKey("2026-09-04"), JSON.stringify({ pageviews: { home: 5 }, bots: 1, botsBy: { google: 1 } }));
    kv.store.set(pvShardKey("2026-09-04", "a"), JSON.stringify({ pageviews: { home: 1, vs: 2 } }));
    kv.store.set(pvShardKey("2026-09-04", "b"), JSON.stringify({ pageviews: { prices: 3 }, bots: 2, botsBy: { ai: 2 } }));
    kv.store.set(pvShardKey("2026-09-05", "a"), JSON.stringify({ pageviews: { home: 99 } }));
    expect(await readDayPageviews(kv, "2026-09-04")).toEqual({
      pageviews: { home: 6, vs: 2, prices: 3 },
      bots: 3,
      botsBy: { google: 1, ai: 2 },
    });
  });

  it("无任何键返回 null；仅旧键时原样返回；KV 不支持 list 时退化为旧键", async () => {
    const kv = memKv();
    expect(await readDayPageviews(kv, "2026-09-04")).toBeNull();
    kv.store.set(pvKey("2026-09-04"), JSON.stringify({ pageviews: { home: 5 }, bots: 0, botsBy: {} }));
    expect((await readDayPageviews(kv, "2026-09-04"))?.pageviews).toEqual({ home: 5 });
    const noList: PvKv = { get: kv.get, put: kv.put };
    kv.store.set(pvShardKey("2026-09-04", "a"), JSON.stringify({ pageviews: { home: 1 } }));
    expect((await readDayPageviews(noList, "2026-09-04"))?.pageviews).toEqual({ home: 5 });
  });

  it("list 分页跟随 cursor 直到 list_complete", async () => {
    const kv = memKv();
    for (let i = 0; i < 5; i++) kv.store.set(pvShardKey("2026-09-04", `s${i}`), JSON.stringify({ pageviews: { home: 1 } }));
    const all = [...kv.store.keys()];
    let calls = 0;
    const paged: PvKv = {
      get: kv.get,
      put: kv.put,
      async list({ cursor }) {
        calls++;
        const start = cursor ? Number(cursor) : 0;
        const keys = all.slice(start, start + 2).map((name) => ({ name }));
        const next = start + 2;
        return next >= all.length ? { keys, list_complete: true } : { keys, list_complete: false, cursor: String(next) };
      },
    };
    expect((await readDayPageviews(paged, "2026-09-04"))?.pageviews).toEqual({ home: 5 });
    expect(calls).toBe(3);
  });
});
