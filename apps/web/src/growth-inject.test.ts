import { describe, expect, it } from "vitest";
import { buildHeadInjection, cloudflareBeaconTag, injectIntoHead, isHtmlDocument, resolveAnalytics } from "./growth-inject";

const HTML = '<!doctype html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8" />\n    <title>x</title>\n  </head>\n  <body><div id="root"></div></body>\n</html>\n';
const CF_TOKEN = "0123456789abcdef0123456789abcdef";

describe("buildHeadInjection", () => {
  it("默认（vars 全空/缺失/空白）不产生任何注入", () => {
    expect(buildHeadInjection({})).toBe("");
    expect(buildHeadInjection({ GSC_VERIFICATION: "", BING_VERIFICATION: "  ", BAIDU_VERIFICATION: "", ANALYTICS_PROVIDER: "", ANALYTICS_TOKEN: "" })).toBe("");
    expect(injectIntoHead(HTML, buildHeadInjection({ BAIDU_VERIFICATION: undefined }))).toBe(HTML);
  });
  it("百度验证值渲染官方 meta 名 baidu-site-verification，且与 GSC/Bing 顺序固定", () => {
    expect(buildHeadInjection({ BAIDU_VERIFICATION: " codeva-os2v9vP2vB " })).toBe('<meta name="baidu-site-verification" content="codeva-os2v9vP2vB" />');
    expect(buildHeadInjection({ BING_VERIFICATION: "1234567890ABCDEF1234567890ABCDEF", BAIDU_VERIFICATION: "codeva-os2v9vP2vB" })).toBe(
      '<meta name="msvalidate.01" content="1234567890ABCDEF1234567890ABCDEF" />' + '<meta name="baidu-site-verification" content="codeva-os2v9vP2vB" />',
    );
    expect(buildHeadInjection({ BAIDU_VERIFICATION: 'codeva-x" onload="x' })).toBe("");
    expect(buildHeadInjection({ BAIDU_VERIFICATION: "short" })).toBe("");
  });
  it("GSC / Bing 验证值分别渲染官方 meta 名", () => {
    const out = buildHeadInjection({ GSC_VERIFICATION: "KTL9D51NIMvR4Dc9YISCfRpjIR2vxOwzEbYsNm1oy_g", BING_VERIFICATION: "1234567890ABCDEF1234567890ABCDEF" });
    expect(out).toBe(
      '<meta name="google-site-verification" content="KTL9D51NIMvR4Dc9YISCfRpjIR2vxOwzEbYsNm1oy_g" />' +
        '<meta name="msvalidate.01" content="1234567890ABCDEF1234567890ABCDEF" />',
    );
  });
  it("非法字符（属性/标签注入）与过短值被拒绝", () => {
    expect(buildHeadInjection({ GSC_VERIFICATION: 'abc" onload="x' })).toBe("");
    expect(buildHeadInjection({ BING_VERIFICATION: "<script>" })).toBe("");
    expect(buildHeadInjection({ GSC_VERIFICATION: "short" })).toBe("");
  });
  it("Cloudflare beacon：provider=cloudflare + 32 位 hex token 才注入，官方 module 片段", () => {
    expect(buildHeadInjection({ ANALYTICS_PROVIDER: "cloudflare", ANALYTICS_TOKEN: CF_TOKEN })).toBe(cloudflareBeaconTag(CF_TOKEN));
    expect(cloudflareBeaconTag(CF_TOKEN)).toBe(
      `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${CF_TOKEN}"}'></script>`,
    );
    expect(buildHeadInjection({ ANALYTICS_PROVIDER: "cloudflare", ANALYTICS_TOKEN: "" })).toBe("");
    expect(buildHeadInjection({ ANALYTICS_PROVIDER: "cloudflare", ANALYTICS_TOKEN: "not-a-token" })).toBe("");
    expect(buildHeadInjection({ ANALYTICS_PROVIDER: "", ANALYTICS_TOKEN: CF_TOKEN })).toBe("");
    expect(buildHeadInjection({ ANALYTICS_PROVIDER: "plausible", ANALYTICS_TOKEN: CF_TOKEN })).toBe("");
  });
  it("resolveAnalytics 对 provider 大小写与空白宽容", () => {
    expect(resolveAnalytics({ ANALYTICS_PROVIDER: " Cloudflare ", ANALYTICS_TOKEN: ` ${CF_TOKEN.toUpperCase()} ` })).toEqual({ provider: "cloudflare", token: CF_TOKEN });
  });
});

describe("injectIntoHead", () => {
  it("片段为空时返回同一字符串（字节一致）", () => {
    expect(injectIntoHead(HTML, "")).toBe(HTML);
  });
  it("插到首个 </head> 之前，其余内容不变", () => {
    const out = injectIntoHead(HTML, "<meta name=\"x\" />");
    expect(out).toBe(HTML.replace("</head>", '<meta name="x" /></head>'));
    expect(out.length).toBe(HTML.length + '<meta name="x" />'.length);
  });
  it("无 </head> 的文档原样返回", () => {
    expect(injectIntoHead("<p>no head</p>", "<meta />")).toBe("<p>no head</p>");
  });
});

describe("isHtmlDocument", () => {
  it("仅 text/html 响应为真", () => {
    expect(isHtmlDocument(new Response("", { headers: { "content-type": "text/html; charset=utf-8" } }))).toBe(true);
    expect(isHtmlDocument(new Response("", { headers: { "content-type": "application/json" } }))).toBe(false);
    expect(isHtmlDocument(new Response("", { headers: { "content-type": "application/xml" } }))).toBe(false);
    expect(isHtmlDocument(new Response("", { headers: { "content-type": "text/plain; charset=utf-8" } }))).toBe(false);
    expect(isHtmlDocument(new Response(""))).toBe(false);
  });
});
