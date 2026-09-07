/**
 * R556（R553 P3-2）：index.html 里每个自托管 @font-face 的字体文件都必须有带 `crossorigin` 的 `<link rel="preload" as="font">`。
 *
 * 证据：@font-face 的字体请求按 HTML 规范固定为 CORS anonymous（MDN rel=preload「font and fetch preloading requires the
 * crossorigin attribute」）。页面没有显式 preload 的字体（R553 时的 JetBrains Mono）会被 Chrome LCP Critical Path Predictor
 * 记住，回访时由浏览器自己合成 `Link: <url>; rel="preload"; as="font"`（不带 crossorigin → credentials mode include），
 * 与 @font-face 的 anonymous 请求不匹配 → 12/12 路由控制台
 * 「A preload for '/fonts/jetbrains-mono-latin-var.woff2' is found, but is not used because the request credentials mode does not match」
 * 且字体下载两次；Inter 因已有 crossorigin preload 而不受影响。修法 = 给每个字体加显式 crossorigin preload。
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve(__dirname, "../index.html"), "utf8");

const fontFaceUrls = [...html.matchAll(/@font-face\{[^}]*?src:url\(([^)]+)\)/g)].map((m) => m[1]);
const preloads = [...html.matchAll(/<link\s+rel="preload"\s+as="font"[^>]*>/g)].map((m) => m[0]);

describe("index.html 字体 preload", () => {
  it("每个 @font-face 字体文件都有 preload", () => {
    expect(fontFaceUrls.length).toBeGreaterThanOrEqual(2);
    expect(fontFaceUrls).toEqual(expect.arrayContaining(["/fonts/inter-latin-var.woff2", "/fonts/jetbrains-mono-latin-var.woff2"]));
    for (const url of fontFaceUrls) expect(preloads.some((l) => l.includes(`href="${url}"`)), `缺 preload：${url}`).toBe(true);
  });

  it("字体 preload 全部带 crossorigin 与 type=font/woff2，且不预载 @font-face 未引用的文件", () => {
    for (const link of preloads) {
      expect(link, link).toMatch(/\scrossorigin[\s>=]/);
      expect(link, link).toContain('type="font/woff2"');
      const href = link.match(/href="([^"]+)"/)?.[1];
      expect(fontFaceUrls, `多余 preload：${href}`).toContain(href);
    }
  });
});
