import { totalScore, type Row } from "@/types";

export function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob(["\ufeff" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRows(rows: Row[], format: "csv" | "txt", filename = "domainhunter-results") {
  let content: string;
  if (format === "csv") {
    const header = "domain,status,score,length,readability,relevance,brandability,meaning";
    const lines = rows.map((r) => {
      const s = r.scores;
      const meaning = `"${(r.meaning ?? "").replace(/"/g, '""')}"`;
      return [r.domain, r.status, s ? totalScore(s) : "", s?.length ?? "", s?.readability ?? "", s?.relevance ?? "", s?.brandability ?? "", meaning].join(",");
    });
    content = [header, ...lines].join("\n");
  } else {
    content = rows.map((r) => r.domain).join("\n");
  }
  downloadText(content, `${filename}.${format}`, format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8");
}
