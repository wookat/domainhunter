import { useState } from "react";

import { downloadText } from "@/lib/export";
import { priceShort, type PriceMap } from "@/lib/prices";
import { totalScore, type Row } from "@/types";

/** 结果 CSV 的最小行结构：结果页 Row 与分享页快照条目都能满足 */
export type ResultsCsvRow = Pick<Row, "domain" | "tld" | "meaning" | "theme" | "scores"> & {
  status?: Row["status"];
  /** 已格式化的到期日文本（仅 opts.expiresAt 时输出） */
  expiresAt?: string;
  /** 用户备注（仅 opts.note 时输出；目前只有候选清单会传） */
  note?: string;
};

/** 可选附加列；不传时输出与原有结果 CSV 完全一致 */
export interface ResultsCsvOptions {
  expiresAt?: boolean;
  note?: boolean;
}

const CSV_HEADER = "domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price";

export function buildResultsCsv(rows: ResultsCsvRow[], lang: "zh" | "en", prices: PriceMap | null, opts?: ResultsCsvOptions): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = CSV_HEADER + (opts?.expiresAt ? ",expires_at" : "") + (opts?.note ? ",note" : "");
  const lines = rows.map((r) => {
    const s = r.scores;
    const cells: (string | number)[] = [
      r.domain,
      r.status ?? "",
      esc(r.meaning ?? ""),
      r.theme ?? "",
      s ? totalScore(s) : "",
      s?.length ?? "",
      s?.readability ?? "",
      s?.relevance ?? "",
      s?.brandability ?? "",
      r.status === "available" ? esc(priceShort(r.tld, lang, prices) ?? "") : "",
    ];
    if (opts?.expiresAt) cells.push(esc(r.expiresAt ?? ""));
    if (opts?.note) cells.push(esc(r.note ?? ""));
    return cells.join(",");
  });
  return [header, ...lines].join("\n");
}

export function exportResultsCsv(rows: ResultsCsvRow[], lang: "zh" | "en", prices: PriceMap | null, filenamePrefix = "domainhunter-results", opts?: ResultsCsvOptions) {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  downloadText(buildResultsCsv(rows, lang, prices, opts), `${filenamePrefix}-${ymd}.csv`, "text/csv;charset=utf-8");
}

/** 复制可注册域名列表（换行分隔），带 1.5s 已复制反馈 */
export function useCopyAvailable() {
  const [copied, setCopied] = useState(false);
  const copy = (domains: string[]) => {
    void navigator.clipboard.writeText(domains.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}
