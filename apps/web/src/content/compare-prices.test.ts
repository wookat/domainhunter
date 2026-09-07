import { describe, expect, it } from "vitest";

import { toCny, toUsd } from "../lib/currency";
import { tldPrice } from "../types";
import { buildComparePriceView, fiveYearCost, formatFetchedAt, priceRow, snapshotFromPayload, type ComparePriceSnapshot } from "./compare-prices";
import { TLD_COMPARES } from "./compares";
import { compareContentBlocks, comparePriceTableHtml } from "./ssr-html";
import { TLD_LIST } from "./tld-list";

const FETCHED_AT = Date.UTC(2026, 8, 6, 6, 0, 49); // 2026-09-06 06:00:49Z

/** 生产 /api/prices 2026-09-06 实测口径：com/io/dev 有实时价，cn 无（回退静态参考价） */
const LIVE: ComparePriceSnapshot = {
  live: { com: { registration: 11.08, renewal: 11.08 }, io: { registration: 28.12, renewal: 51.8 }, dev: { registration: 8.75, renewal: 12.87 } },
  fetchedAt: FETCHED_AT,
  stale: false,
};
const NO_DATA: ComparePriceSnapshot = { live: {}, fetchedAt: null, stale: true };

describe("fiveYearCost", () => {
  it("首年 + 4 × 续费，保留两位小数（避免浮点尾数）", () => {
    expect(fiveYearCost(11.08, 11.08)).toBe(55.4);
    expect(fiveYearCost(28.12, 51.8)).toBe(235.32);
    expect(fiveYearCost(33, 38)).toBe(185);
    expect(1 + 4 * 3.94).not.toBe(16.76); // 未取整会带浮点尾数
    expect(fiveYearCost(1, 3.94)).toBe(16.76);
  });
});

describe("priceRow", () => {
  it("实时价：美元为准、人民币按 toCny 估算、不带 ≈", () => {
    const row = priceRow("io", LIVE);
    expect(row).not.toBeNull();
    expect(row!.live).toBe(true);
    expect(row!.first).toMatchObject({ usd: 28.12, cny: toCny(28.12), approx: false, usdText: "$28.12", cnyText: `¥${toCny(28.12)}` });
    expect(row!.fiveYear).toMatchObject({ usd: 235.32, cny: toCny(235.32), usdText: "$235.32" });
  });

  it("无实时价回退静态参考价：人民币为准、美元 toUsd 换算并加 ≈（与 /prices 口径一致）", () => {
    const s = tldPrice("cn")!;
    const row = priceRow("cn", LIVE)!;
    expect(row.live).toBe(false);
    expect(row.first).toMatchObject({ usd: toUsd(s.first), cny: s.first, approx: true, usdText: `≈$${toUsd(s.first)}`, cnyText: `¥${s.first}` });
    expect(row.renew.cnyText).toBe(`¥${s.renew}`);
    expect(row.fiveYear).toMatchObject({ cny: s.first + 4 * s.renew, usdText: `≈$${toUsd(s.first + 4 * s.renew)}` });
  });

  it("实时价与静态参考价都缺失返回 null", () => {
    expect(priceRow("not-a-tld", LIVE)).toBeNull();
  });
});

describe("buildComparePriceView", () => {
  it("两侧都有价：两行 + 差额行（A − B，正数带 +，负数带 −），脚注含公式与 fetchedAt", () => {
    const view = buildComparePriceView("io", "dev", "zh", LIVE);
    expect(view.kind).toBe("table");
    if (view.kind !== "table") return;
    expect(view.table.rows.map((r) => r.tld)).toEqual(["io", "dev"]);
    expect(view.table.diff).not.toBeNull();
    expect(view.table.diff!.first).toMatchObject({ usd: 19.37, usdText: "+$19.37", approx: false });
    expect(view.table.diff!.fiveYear.usdText).toBe(`+$${fiveYearCost(28.12, 51.8) - fiveYearCost(8.75, 12.87)}`);
    const reverse = buildComparePriceView("dev", "io", "zh", LIVE);
    if (reverse.kind !== "table") throw new Error("expected table");
    expect(reverse.table.diff!.first.usdText).toBe("−$19.37");
    expect(view.table.notes[0]).toContain("5 年持有成本 = 首年价 + 4 × 续费价");
    expect(view.table.notes[1]).toContain(formatFetchedAt(FETCHED_AT));
    expect(view.table.notes[1]).toContain("Porkbun");
    expect(view.table.headers).toEqual(["后缀", "注册/首年", "续费/年", "5 年持有成本"]);
  });

  it("差额为 0 不带符号", () => {
    const same: ComparePriceSnapshot = { ...LIVE, live: { com: LIVE.live.com, net: LIVE.live.com } };
    const view = buildComparePriceView("com", "net", "en", same);
    if (view.kind !== "table") throw new Error("expected table");
    expect(view.table.diff!.first.usdText).toBe("$0");
    expect(view.table.diff!.first.cnyText).toBe("¥0");
  });

  it("一侧实时、一侧静态参考价：参考侧标 live=false，差额带 ≈", () => {
    const view = buildComparePriceView("com", "cn", "en", LIVE);
    if (view.kind !== "table") throw new Error("expected table");
    expect(view.table.rows.map((r) => r.live)).toEqual([true, false]);
    expect(view.table.diff!.fiveYear.approx).toBe(true);
    expect(view.table.diff!.fiveYear.usdText.startsWith("≈")).toBe(true);
    expect(view.table.refBadge).toBe("reference");
  });

  it("fetchedAt=null（KV 无数据）：全部静态参考价，脚注与 /prices staleNoteNoData 同义（实时报价暂不可用 + ≈）", () => {
    const view = buildComparePriceView("com", "cn", "zh", NO_DATA);
    if (view.kind !== "table") throw new Error("expected table");
    expect(view.table.rows.every((r) => !r.live)).toBe(true);
    expect(view.table.notes[1]).toContain("实时报价暂不可用，当前显示静态参考价（≈）");
    expect(view.table.notes[1]).not.toContain("UTC");
  });

  it("stale 且有 fetchedAt：脚注标明缓存价与拉取时间（确定性 UTC 文本，不依赖当前时间）", () => {
    const view = buildComparePriceView("com", "io", "en", { ...LIVE, stale: true });
    if (view.kind !== "table") throw new Error("expected table");
    expect(view.table.notes[1]).toContain("temporarily unavailable");
    expect(view.table.notes[1]).toContain("2026-09-06 06:00 UTC");
  });

  it("仅一侧缺价：单行、无差额行、脚注说明缺价侧", () => {
    const view = buildComparePriceView("com", "zzz", "zh", LIVE);
    if (view.kind !== "table") throw new Error("expected table");
    expect(view.table.rows).toHaveLength(1);
    expect(view.table.diff).toBeNull();
    expect(view.table.notes.at(-1)).toBe(".zzz 暂无实时报价与静态参考价，未计算差额。");
  });

  it("两侧价格都缺失：整表不渲染（kind=empty）并给一句说明，zh/en", () => {
    const zh = buildComparePriceView("zzz", "yyy", "zh", NO_DATA);
    expect(zh).toEqual({ kind: "empty", heading: "价格与 5 年持有成本", note: ".zzz 与 .yyy 暂无实时报价与静态参考价，本页不显示价格对比表；其他后缀价格见价格总览。" });
    const en = buildComparePriceView("zzz", "yyy", "en", NO_DATA);
    expect(en.kind).toBe("empty");
    if (en.kind === "empty") expect(en.note).toContain("price table is not shown");
    const html = comparePriceTableHtml(zh);
    expect(html).not.toContain("<table");
    expect(html).toContain(".zzz 与 .yyy 暂无实时报价与静态参考价");
  });

  it("全部 TLD 都有静态参考价：任一 /vs 组合在 KV 无数据时也不会落入 empty 分支（生产不会出现空表）", () => {
    for (const tld of TLD_LIST) expect(tldPrice(tld), tld).toBeDefined();
    for (const cmp of Object.values(TLD_COMPARES)) expect(buildComparePriceView(cmp.a, cmp.b, "zh", NO_DATA).kind, cmp.slug).toBe("table");
  });
});

describe("snapshotFromPayload", () => {
  it("从 /api/prices 负载抽出两侧实时价与 fetchedAt/stale；负载缺失或损坏 → fetchedAt=null、stale=true", () => {
    const payload = JSON.stringify({ prices: { com: { registration: 11.08, renewal: 11.08 }, io: { registration: 28.12, renewal: 51.8 } }, currency: "USD", usdToCny: 7.2, fetchedAt: FETCHED_AT, tldCount: 2 });
    expect(snapshotFromPayload(payload, ["com", "cn"])).toEqual({ live: { com: { registration: 11.08, renewal: 11.08 } }, fetchedAt: FETCHED_AT, stale: false });
    expect(snapshotFromPayload(JSON.stringify({ prices: {}, fetchedAt: 5, stale: true }), ["com"])).toEqual({ live: {}, fetchedAt: 5, stale: true });
    expect(snapshotFromPayload(null, ["com"])).toEqual(NO_DATA);
    expect(snapshotFromPayload("{oops", ["com"])).toEqual(NO_DATA);
  });
});

describe("comparePriceTableHtml / compareContentBlocks", () => {
  it("表格含 caption、th scope=col ×4、th scope=row（两侧 + 差额）、横向滚动容器，且位于结论块之后", () => {
    const view = buildComparePriceView("com", "cn", "zh", LIVE);
    const html = comparePriceTableHtml(view);
    expect(html).toContain("<caption");
    expect(html.match(/<th scope="col"/g)).toHaveLength(4);
    expect(html.match(/<th scope="row"/g)).toHaveLength(3);
    expect(html).toContain('class="mt-3 overflow-x-auto');
    expect(html).toContain(">参考价</span>");
    const blocks = compareContentBlocks(TLD_COMPARES["com-vs-cn"], "zh", LIVE);
    expect(blocks[1]).toBe(html);
    expect(blocks[0]).toContain("怎么选");
  });

  it("单元格文本按 escapeHtml 输出，模型文本与 HTML 文本逐字一致", () => {
    const view = buildComparePriceView("io", "dev", "en", LIVE);
    if (view.kind !== "table") throw new Error("expected table");
    const html = comparePriceTableHtml(view);
    for (const row of view.table.rows) for (const c of [row.first, row.renew, row.fiveYear]) expect(html).toContain(`>${c.usdText}</span>`);
    for (const note of view.table.notes) expect(html).toContain(`<li>${note}</li>`);
  });
});
