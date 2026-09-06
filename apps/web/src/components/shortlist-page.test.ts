import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DomainRow } from "./domain-row";
import { batchRegisterTargets, isRegistrable, ShortlistPage } from "./shortlist-page";
import { I18nProvider } from "@/lib/i18n";
import type { ShortlistItem } from "@/lib/shortlist";
import type { Row } from "@/types";

const noop = () => undefined;

// Node 22 自带 navigator.language=en-US，I18nProvider 会据此选英文；用 localStorage 桩固定语言（SSR 不跑 effect，不会写回）
function setLang(lang: "zh" | "en") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (k: string) => (k === "domainhunter:lang" ? lang : null), setItem: noop, removeItem: noop },
  });
}

function item(domain: string, status: ShortlistItem["status"], extra: Partial<ShortlistItem> = {}): ShortlistItem {
  const dot = domain.indexOf(".");
  return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), addedAt: 1, status, ...extra };
}

const ITEMS: ShortlistItem[] = [
  item("google.com", "taken", { expiresAt: "2031-09-14T04:00:00Z" }),
  item("stackpilot.io", "taken"),
  item("zqxwv-unknown.com", "unknown"),
  item("zqxwv-avail.com", "available"),
  item("zqxwv-avail.io", "available"),
  item("zqxwv-legacy.dev", undefined),
];

function renderShortlist(items: ShortlistItem[]): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider,
      null,
      createElement(ShortlistPage, {
        items,
        onRemove: noop,
        onClear: noop,
        onStart: noop,
        onMerge: noop,
        onSetNote: noop,
        lastCheckedAt: null,
        onApplyStatuses: noop,
      }),
    ),
  );
}

/** 桌面表格 <tr> 与移动卡片，按域名切出该行的 HTML 片段（取 data 无关的最小包裹） */
function rowsOf(html: string, domain: string): string[] {
  const label = domain.slice(0, domain.indexOf("."));
  const tld = domain.slice(domain.indexOf(".") + 1);
  const marker = `${label}<span class="text-txt2">.${tld}</span>`;
  const out: string[] = [];
  let from = 0;
  for (;;) {
    const i = html.indexOf(marker, from);
    if (i < 0) break;
    // 桌面：向前找 <tr，向后到 </tr>；移动端：向前找卡片 <div class="rounded-xl，向后到下一张卡/容器尾
    const trStart = html.lastIndexOf("<tr", i);
    const trEnd = html.indexOf("</tr>", i);
    const cardStart = html.lastIndexOf('<div class="rounded-xl border border-line bg-bg1 p-4', i);
    if (trStart >= 0 && trEnd >= 0 && (cardStart < 0 || trStart > cardStart)) {
      out.push(html.slice(trStart, trEnd));
      from = trEnd;
    } else {
      const next = html.indexOf('<div class="rounded-xl border border-line bg-bg1 p-4', i);
      const end = next < 0 ? html.indexOf("</div></div>", i) : next;
      out.push(html.slice(cardStart, end));
      from = end;
    }
  }
  return out;
}

const PRICE_RE = /首年|\$\d|≈¥/;
const REGISTER_RE = />去注册</;

describe("R548 /shortlist：已注册 / 未知 / 旧条目不显示注册价、不给去注册 CTA", () => {
  setLang("zh");
  const html = renderShortlist(ITEMS);

  it("taken 行（桌面 + 移动端）：无价格、无去注册；主 CTA 为「开监控」", () => {
    for (const domain of ["google.com", "stackpilot.io"]) {
      const rows = rowsOf(html, domain);
      expect(rows.length, domain).toBe(2);
      for (const row of rows) {
        expect(row, domain).not.toMatch(PRICE_RE);
        expect(row, domain).not.toMatch(REGISTER_RE);
        expect(row, domain).toContain(">开监控<");
        expect(row, domain).toContain("已注册");
        expect(row, domain).toContain("二级市场价以注册商为准");
      }
    }
    // 到期信息作为次级信息保留
    expect(rowsOf(html, "google.com")[0]).toMatch(/2031/);
  });

  it("unknown 与旧条目（无 status）：无价格、无去注册；给「重新核验」", () => {
    for (const domain of ["zqxwv-unknown.com", "zqxwv-legacy.dev"]) {
      const rows = rowsOf(html, domain);
      expect(rows.length, domain).toBe(2);
      for (const row of rows) {
        expect(row, domain).not.toMatch(PRICE_RE);
        expect(row, domain).not.toMatch(REGISTER_RE);
        expect(row, domain).toContain(">重新核验<");
        expect(row, domain).toContain(`只重新核验 ${domain}`);
      }
    }
    expect(rowsOf(html, "zqxwv-unknown.com")[0]).toContain(">未知<");
  });

  it("available 行保持：显示参考价 + 去注册", () => {
    for (const domain of ["zqxwv-avail.com", "zqxwv-avail.io"]) {
      const rows = rowsOf(html, domain);
      expect(rows.length, domain).toBe(2);
      for (const row of rows) {
        expect(row, domain).toMatch(PRICE_RE);
        expect(row, domain).toMatch(REGISTER_RE);
        expect(row, domain).not.toContain(">开监控<");
      }
    }
  });

  it("「批量去注册（N）」只计 available 项，与打开的链接集合一致", () => {
    expect(html).toContain("批量去注册（2）");
    expect(html).not.toContain("批量去注册（6）");
    expect(batchRegisterTargets(ITEMS).map((it) => it.domain)).toEqual(["zqxwv-avail.com", "zqxwv-avail.io"]);
    expect(ITEMS.filter(isRegistrable).length).toBe(2);
  });

  it("全部 taken/unknown 时批量按钮计 0 且禁用", () => {
    const only = renderShortlist(ITEMS.filter((it) => it.status !== "available"));
    expect(only).toContain("批量去注册（0）");
    expect(only).toMatch(/<button[^>]*disabled[^>]*>[^<]*<svg[\s\S]*?批量去注册（0）/);
    expect(batchRegisterTargets(ITEMS.filter((it) => it.status !== "available"))).toEqual([]);
  });

  it("英文界面：taken 行无 Register / 无 1st yr 价，批量计数只计 available", () => {
    setLang("en");
    const en = renderShortlist(ITEMS);
    setLang("zh");
    expect(en).toContain("Register all (2)");
    for (const row of rowsOf(en, "google.com")) {
      expect(row).not.toMatch(/1st yr|\$\d/);
      expect(row).not.toMatch(/>Register</);
      expect(row).toContain(">Monitor<");
    }
    for (const row of rowsOf(en, "zqxwv-avail.com")) {
      expect(row).toMatch(/1st yr/);
      expect(row).toMatch(/>Register</);
    }
  });
});

describe("R548 结果页 DomainRow：unknown 行无价格无去注册；taken 行保持无价格无去注册", () => {
  const base: Omit<Row, "domain" | "label" | "tld" | "status"> = { round: 1, scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } };
  const render = (row: Row) => {
    setLang("zh");
    return renderToStaticMarkup(createElement(I18nProvider, null, createElement(DomainRow, { row, onToggleFavorite: noop })));
  };

  it("unknown", () => {
    const html = render({ ...base, domain: "zqxwv-unknown.com", label: "zqxwv-unknown", tld: "com", status: "unknown" });
    expect(html).toContain(">未知<");
    expect(html).not.toMatch(PRICE_RE);
    expect(html).not.toMatch(REGISTER_RE);
  });

  it("taken", () => {
    const html = render({ ...base, domain: "google.com", label: "google", tld: "com", status: "taken", expiresAt: "2031-09-14T04:00:00Z" });
    expect(html).toContain(">已注册<");
    expect(html).not.toMatch(PRICE_RE);
    expect(html).not.toMatch(REGISTER_RE);
  });

  it("available 保持价格 + 去注册", () => {
    const html = render({ ...base, domain: "zqxwv-avail.com", label: "zqxwv-avail", tld: "com", status: "available" });
    expect(html).toMatch(PRICE_RE);
    expect(html).toMatch(REGISTER_RE);
  });
});
