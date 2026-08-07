import { useState } from "react";

import { downloadText } from "@/lib/export";
import { priceShort, type PriceMap } from "@/lib/prices";
import { totalScore, type Row } from "@/types";

/** 结果 CSV 的最小行结构：结果页 Row 与分享页快照条目都能满足 */
export type ResultsCsvRow = Pick<Row, "domain" | "tld" | "meaning" | "theme" | "scores"> & {
  status?: Row["status"];
};

const CSV_HEADER = "domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price";

export function buildResultsCsv(rows: ResultsCsvRow[], lang: "zh" | "en", prices: PriceMap | null): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) => {
    const s = r.scores;
    return [
      r.domain,
      r.status ?? "",
      esc(r.meaning ?? ""),
      r.theme ?? "",
      s ? totalScore(s) : "",
      s?.length ?? "",
      s?.readability ?? "",
      s?.relevance ?? "",
      s?.brandability ?? "",
      esc(priceShort(r.tld, lang, prices) ?? ""),
    ].join(",");
  });
  return [CSV_HEADER, ...lines].join("\n");
}

export function exportResultsCsv(rows: ResultsCsvRow[], lang: "zh" | "en", prices: PriceMap | null) {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  downloadText(buildResultsCsv(rows, lang, prices), `domainhunter-results-${ymd}.csv`, "text/csv;charset=utf-8");
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
