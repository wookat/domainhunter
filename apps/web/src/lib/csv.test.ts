import { describe, expect, it } from "vitest";

import { CSV_PRICE_COLUMNS, csvNumber, priceCsvCells } from "./csv";
import { buildResultsCsv, type ResultsCsvRow } from "./results-export";
import type { PriceMap } from "./prices";
import { tldPrice } from "@/types";

const LIVE: PriceMap = { com: { registration: 11.08, renewal: 11.08 }, io: { registration: 39.5, renewal: 45 } };
const NUMERIC = /^\d+(\.\d+)?$/;

/** 最小 RFC 4180 解析：双引号包裹、`""` 转义、字段内允许逗号 */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function row(domain: string, status: ResultsCsvRow["status"], extra: Partial<ResultsCsvRow> = {}): ResultsCsvRow {
  return { domain, tld: domain.slice(domain.indexOf(".") + 1), status, ...extra };
}

describe("csvNumber", () => {
  it("有限数字转十进制字符串，其余为空", () => {
    expect(csvNumber(80)).toBe("80");
    expect(csvNumber(11.08)).toBe("11.08");
    expect(csvNumber(undefined)).toBe("");
    expect(csvNumber(Number.NaN)).toBe("");
    expect(csvNumber(Number.POSITIVE_INFINITY)).toBe("");
  });
});

describe("priceCsvCells", () => {
  it("实时价：CNY 为汇率换算整数、USD 为原值、来源 porkbun_live", () => {
    expect(priceCsvCells("com", "available", LIVE)).toEqual(["80", "80", "11.08", "11.08", "porkbun_live"]);
  });

  it("静态参考价：只有 CNY，USD 两列留空、来源 static_reference", () => {
    const s = tldPrice("cn")!;
    expect(priceCsvCells("cn", "available", LIVE)).toEqual([String(s.first), String(s.renew), "", "", "static_reference"]);
    expect(priceCsvCells("cn", "available", null)).toEqual([String(s.first), String(s.renew), "", "", "static_reference"]);
  });

  it("taken / unknown / 无 status 行五列全空（注册价不适用）", () => {
    for (const status of ["taken", "unknown", undefined] as const) {
      expect(priceCsvCells("com", status, LIVE)).toEqual(["", "", "", "", ""]);
    }
  });

  it("无实时价也无静态价的 TLD 五列全空", () => {
    expect(priceCsvCells("zzzz-nonexistent", "available", null)).toEqual(["", "", "", "", ""]);
  });
});

describe("buildResultsCsv 数值价格列", () => {
  const rows = [
    row("lingxicha.com", "available", { meaning: '灵犀茶，"心有灵犀"' }),
    row("lingxicha.cn", "available"),
    row("google.com", "taken"),
    row("zqxwv.io", "unknown"),
  ];

  it("表头：旧列 first_year_price 保留在第 10 列，新 5 列紧随其后，再接可选列", () => {
    const header = parseCsvLine(buildResultsCsv(rows, "zh", LIVE, { expiresAt: true, note: true }).split("\n")[0]);
    expect(header.slice(0, 10)).toEqual(["domain", "status", "meaning", "theme", "score", "length", "readability", "relevance", "brandability", "first_year_price"]);
    expect(header.slice(10, 15)).toEqual([...CSV_PRICE_COLUMNS]);
    expect(header.slice(15)).toEqual(["expires_at", "note"]);
  });

  it("数值列为纯数字或空，不带引号/货币符号；旧列仍是带标签字符串", () => {
    const lines = buildResultsCsv(rows, "zh", LIVE).split("\n");
    const header = parseCsvLine(lines[0]);
    const col = (name: string) => header.indexOf(name);
    const body = lines.slice(1).map(parseCsvLine);
    expect(body).toHaveLength(4);
    for (const cells of body) {
      expect(cells).toHaveLength(header.length);
      for (const name of CSV_PRICE_COLUMNS.slice(0, 4)) {
        const v = cells[col(name)];
        expect(v === "" || NUMERIC.test(v), `${cells[0]} ${name}=${JSON.stringify(v)}`).toBe(true);
      }
    }
    const [com, cn, taken, unknown] = body;
    expect(com[col("first_year_price")]).toBe("首年 $11.08 ≈¥80");
    expect(com.slice(col("price_first_year_cny"), col("price_source") + 1)).toEqual(["80", "80", "11.08", "11.08", "porkbun_live"]);
    expect(cn.slice(col("price_first_year_cny"), col("price_source") + 1)).toEqual([String(tldPrice("cn")!.first), String(tldPrice("cn")!.renew), "", "", "static_reference"]);
    expect(taken.slice(col("first_year_price"), col("price_source") + 1)).toEqual(["", "", "", "", "", ""]);
    expect(unknown.slice(col("first_year_price"), col("price_source") + 1)).toEqual(["", "", "", "", "", ""]);
    // 原始行文本里数值列没有被引号包裹（RFC 4180 允许不加引号；Excel/Numbers/WPS 据此识别为数值）
    expect(lines[1]).toContain(",80,80,11.08,11.08,porkbun_live");
  });

  it("含双引号/逗号的 meaning 仍按 RFC 4180 转义，不影响后续数值列对齐", () => {
    const lines = buildResultsCsv(rows.slice(0, 1), "zh", LIVE).split("\n");
    const cells = parseCsvLine(lines[1]);
    expect(cells[2]).toBe('灵犀茶，"心有灵犀"');
    expect(cells[10]).toBe("80");
    expect(lines[1]).toContain('"灵犀茶，""心有灵犀"""');
  });

  it("en 语言只影响旧列文案，数值列不变", () => {
    const zh = parseCsvLine(buildResultsCsv(rows.slice(0, 1), "zh", LIVE).split("\n")[1]);
    const en = parseCsvLine(buildResultsCsv(rows.slice(0, 1), "en", LIVE).split("\n")[1]);
    expect(en[9]).toBe("1st yr $11.08");
    expect(en.slice(10, 15)).toEqual(zh.slice(10, 15));
  });
});
