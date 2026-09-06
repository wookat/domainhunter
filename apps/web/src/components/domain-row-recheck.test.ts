import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";

import { DomainRow } from "./domain-row";
import { I18nProvider } from "@/lib/i18n";
import type { Row } from "@/types";

const noop = () => undefined;

// Node 22 自带 navigator.language=en-US；用 localStorage 桩固定语言（SSR 不跑 effect，不会写回）
function setLang(lang: "zh" | "en") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (k: string) => (k === "domainhunter:lang" ? lang : null), setItem: noop, removeItem: noop },
  });
}

function row(domain: string, status: Row["status"], extra: Partial<Row> = {}): Row {
  const dot = domain.indexOf(".");
  return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), status, round: 1, ...extra };
}

function render(r: Row, opts: { onRecheck?: boolean; favorite?: boolean } = { onRecheck: true, favorite: true }): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider,
      null,
      createElement(DomainRow, {
        row: r,
        onRecheck: opts.onRecheck ? noop : undefined,
        onToggleFavorite: opts.favorite ? noop : undefined,
      }),
    ),
  );
}

describe("DomainRow unknown 行：可读原因 + 单行重新核验（/results、/advanced 共用）", () => {
  beforeAll(() => setLang("zh"));

  it("http-429 → 显示「注册局限流」并带 data-recheck 按钮（不显示注册 CTA）", () => {
    const html = render(row("lingxicha.ai", "unknown", { detail: "http-429" }));
    expect(html).toContain('data-unknown-reason="rate-limited"');
    expect(html).not.toContain("http-429");
    expect(html).toContain("注册局限流，稍后重试");
    expect(html).toContain('data-recheck="lingxicha.ai"');
    expect(html).toContain("aria-label=\"重新核验 lingxicha.ai");
    expect(html).not.toContain(">去注册<");
    expect(html).not.toContain("http-429<");
  });

  it("reserved → 「注册局保留」文案，且不提供重新核验（与瞬态 unknown 区分）", () => {
    const html = render(row("nic.cn", "unknown", { detail: "reserved" }));
    expect(html).toContain("注册局保留");
    expect(html).not.toContain("data-recheck=");
  });

  it("无 detail 的 unknown → 通用「暂时无法确认」+ 可重新核验；不传 onRecheck 时无按钮", () => {
    expect(render(row("zqxwv.com", "unknown"))).toContain("暂时无法确认");
    expect(render(row("zqxwv.com", "unknown"))).toContain('data-recheck="zqxwv.com"');
    expect(render(row("zqxwv.com", "unknown"), { onRecheck: false, favorite: true })).not.toContain("data-recheck=");
  });

  it("原始异常串（如 WHOIS 抛错文本）不透出到页面，只映射为固定文案", () => {
    const raw = "TypeError: fetch failed at whois.nic.io:43";
    const html = render(row("x.io", "unknown", { detail: raw }));
    expect(html).toContain("查询网络错误");
    expect(html).not.toContain("whois.nic.io:43<");
  });

  it("英文文案：http-429 → Registry rate-limited", () => {
    setLang("en");
    const html = render(row("lingxicha.ai", "unknown", { detail: "http-429" }));
    expect(html).toContain("Registry rate-limited");
    expect(html).toContain("Re-check lingxicha.ai");
    setLang("zh");
  });
});

describe("DomainRow taken 行：开监控 + 重新核验，不出现注册 CTA，到期日保留", () => {
  beforeAll(() => setLang("zh"));

  it("有到期日（远期）→ 到期日 + 开监控 + 重新核验；无「去注册」", () => {
    const html = render(row("google.com", "taken", { expiresAt: "2028-09-14T04:00:00.000Z" }));
    expect(html).toContain("2028");
    expect(html).toContain("开监控");
    expect(html).toContain('data-recheck="google.com"');
    expect(html).not.toContain(">去注册<");
  });

  it("无到期日的 taken 行同样有开监控与重新核验", () => {
    const html = render(row("stackpilot.io", "taken"));
    expect(html).toContain("开监控");
    expect(html).toContain('data-recheck="stackpilot.io"');
  });

  it("available 行：注册 CTA，无重新核验", () => {
    const html = render(row("zqxwv-avail.com", "available"));
    expect(html).toContain("去注册");
    expect(html).not.toContain("data-recheck=");
  });
});
