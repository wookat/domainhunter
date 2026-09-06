/**
 * R565：/monitors「通知方式」卡片的纯函数与请求封装。
 * URL 校验（仅 https、≤500）、脱敏展示、「发送测试」对 /api/monitor/webhook-test 各响应的映射，以及到期日 zh/en 文案格式。
 */
import { describe, expect, it } from "vitest";

import { formatExpiry } from "./utils";
import { isValidWebhook, maskWebhook, sendWebhookTest, WEBHOOK_MAX_LENGTH, webhookInvalidReason } from "./monitor";
import { dictionary, interpolate } from "./i18n";

const zh = dictionary("zh");
const en = dictionary("en");

const FEISHU = "https://open.feishu.cn/open-apis/bot/v2/hook/0a1b2c3d-4e5f-6789-abcd-ef0123456789";

describe("webhook URL 校验", () => {
  it("仅接受 https，且 ≤ 500 字符（与 worker sanitizeWebhook 同规则）", () => {
    expect(WEBHOOK_MAX_LENGTH).toBe(500);
    expect(isValidWebhook(FEISHU)).toBe(true);
    expect(isValidWebhook("http://hook.example/x")).toBe(false);
    expect(isValidWebhook("ftp://hook.example/x")).toBe(false);
    expect(isValidWebhook("hook.example/x")).toBe(false);
    expect(isValidWebhook(`https://hook.example/${"a".repeat(480)}`)).toBe(false);
    expect(isValidWebhook(`https://hook.example/${"a".repeat(479)}`)).toBe(true);
  });

  it("webhookInvalidReason 按原因分流：length 优先于 syntax/scheme", () => {
    expect(webhookInvalidReason(FEISHU)).toBeNull();
    expect(webhookInvalidReason("http://hook.example/x")).toBe("scheme");
    expect(webhookInvalidReason("not a url")).toBe("syntax");
    expect(webhookInvalidReason(`http://x/${"a".repeat(600)}`)).toBe("length");
  });

  it("zh/en 三种校验文案都存在", () => {
    for (const key of ["monitors.notify.err.scheme", "monitors.notify.err.length", "monitors.notify.err.syntax"] as const) {
      expect(zh[key]).toBeTruthy();
      expect(en[key]).toBeTruthy();
    }
    expect(zh["monitors.notify.err.length"]).toContain("{max}");
    expect(en["monitors.notify.err.length"]).toContain("{max}");
  });
});

describe("maskWebhook：只露 origin 与末 4 位", () => {
  it("飞书/钉钉/Slack 风格长路径 → origin/…尾4", () => {
    expect(maskWebhook(FEISHU)).toBe("https://open.feishu.cn/…6789");
    expect(maskWebhook("https://oapi.dingtalk.com/robot/send?access_token=abcdef0123456789")).toBe("https://oapi.dingtalk.com/…6789");
    expect(maskWebhook("https://hooks.slack.com/services/T000/B000/XXXXYYYYzzzz")).toBe("https://hooks.slack.com/…zzzz");
  });

  it("脱敏结果不包含原始路径中段", () => {
    const masked = maskWebhook(FEISHU);
    expect(masked).not.toContain("0a1b2c3d");
    expect(masked).not.toContain("hook/");
  });

  it("路径太短没有可隐藏部分时原样返回；非 URL 文本掐头去尾", () => {
    expect(maskWebhook("https://hook.example/x")).toBe("https://hook.example/x");
    expect(maskWebhook("https://hook.example")).toBe("https://hook.example");
    expect(maskWebhook("not-a-url-at-all")).toBe("not-…-all");
  });
});

function fakeFetch(status: number, body: unknown, headers: Record<string, string> = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
  }) as typeof fetch;
  return { impl, calls };
}

describe("sendWebhookTest：POST /api/monitor/webhook-test 并映射结果", () => {
  it("本地先校验：非法地址不发请求", async () => {
    const { impl, calls } = fakeFetch(200, {});
    expect(await sendWebhookTest("http://hook.example/x", impl)).toEqual({ kind: "invalid" });
    expect(calls).toHaveLength(0);
  });

  it("请求体只带 trim 后的 webhook；对方 2xx → delivered，非 2xx → rejected（带状态码）", async () => {
    const ok = fakeFetch(200, { ok: true, delivered: true, status: 200 });
    expect(await sendWebhookTest(`  ${FEISHU}  `, ok.impl)).toEqual({ kind: "delivered", status: 200 });
    expect(ok.calls[0]?.url).toBe("/api/monitor/webhook-test");
    expect(ok.calls[0]?.init?.method).toBe("POST");
    expect(JSON.parse(String(ok.calls[0]?.init?.body))).toEqual({ webhook: FEISHU });

    const rejected = fakeFetch(200, { ok: true, delivered: false, status: 403 });
    expect(await sendWebhookTest(FEISHU, rejected.impl)).toEqual({ kind: "rejected", status: 403 });
  });

  it("429 → rateLimited（优先 Retry-After 头，其次 body.retryAfter）；400 → invalid；502 unreachable → unreachable", async () => {
    expect(await sendWebhookTest(FEISHU, fakeFetch(429, { ok: false, error: "rate_limited", retryAfter: 12 }, { "Retry-After": "12" }).impl)).toEqual({ kind: "rateLimited", retryAfter: 12 });
    expect(await sendWebhookTest(FEISHU, fakeFetch(429, { ok: false, retryAfter: 7 }).impl)).toEqual({ kind: "rateLimited", retryAfter: 7 });
    expect(await sendWebhookTest(FEISHU, fakeFetch(400, { ok: false, error: "invalid_webhook" }).impl)).toEqual({ kind: "invalid" });
    expect(await sendWebhookTest(FEISHU, fakeFetch(502, { ok: false, error: "unreachable" }).impl)).toEqual({ kind: "unreachable" });
  });

  it("网络异常 / 503 / 响应体不合形 → failed", async () => {
    const boom = (async () => { throw new TypeError("network"); }) as unknown as typeof fetch;
    expect(await sendWebhookTest(FEISHU, boom)).toEqual({ kind: "failed" });
    expect(await sendWebhookTest(FEISHU, fakeFetch(503, { ok: false, error: "monitor_unavailable" }).impl)).toEqual({ kind: "failed" });
    expect(await sendWebhookTest(FEISHU, fakeFetch(200, { ok: true }).impl)).toEqual({ kind: "failed" });
  });
});

describe("到期日格式化 zh/en", () => {
  it("formatExpiry 输出 YYYY-MM-DD；expiry.on 双语文案带 {date} 占位", () => {
    expect(formatExpiry("2027-04-06T10:59:44.720Z")).toBe("2027-04-06");
    expect(formatExpiry("not-a-date")).toBeNull();
    expect(interpolate(zh["expiry.on"], { date: "2027-04-06" })).toBe("2027-04-06 到期");
    expect(interpolate(en["expiry.on"], { date: "2027-04-06" })).toBe("expires 2027-04-06");
  });

  it("通知卡片文案的核验频率与 wrangler cron 一致（每 6 小时 / 0 */6 * * *）", () => {
    expect(zh["monitors.notify.desc"]).toContain("6 小时");
    expect(zh["monitors.notify.desc"]).toContain("0 */6 * * *");
    expect(en["monitors.notify.desc"]).toContain("6 hours");
    expect(en["monitors.notify.desc"]).toContain("0 */6 * * *");
  });
});
