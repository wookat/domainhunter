import { Tag } from "lucide-react";

import type { ComparePriceView, PriceCell } from "@/content/compare-prices";

/**
 * /vs 页价格数据表（R521）。DOM/类名与 content/ssr-html.ts comparePriceTableHtml 逐字一致：
 * 首屏由 worker SSR 输出，React 挂载后按同一份快照重渲染，文本零差异。
 */
export function ComparePriceTable({ view }: { view: ComparePriceView }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-base font-bold">
        <Tag className="h-4 w-4 text-brand" />
        {view.kind === "empty" ? view.heading : view.table.heading}
      </h2>
      {view.kind === "empty" ? (
        <p className="mt-2.5 text-sm leading-relaxed text-txt1">{view.note}</p>
      ) : (
        <>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-bg1">
            <table className="w-full min-w-[320px] text-sm">
              <caption className="px-4 pb-1 pt-3 text-left text-xs leading-relaxed text-txt2">{view.table.caption}</caption>
              <thead>
                <tr className="border-b border-line text-xs text-txt2">
                  <th scope="col" className="px-4 py-2 text-left font-medium">
                    {view.table.headers[0]}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {view.table.headers[1]}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {view.table.headers[2]}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {view.table.headers[3]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.table.rows.map((row) => (
                  <tr key={row.tld} className="border-b border-line">
                    <th scope="row" className="whitespace-nowrap px-4 py-2.5 text-left font-mono font-semibold text-brand">
                      .{row.tld}
                      {!row.live && <span className="ml-1.5 rounded bg-bg2 px-1 font-sans text-[10px] font-normal text-txt2">{view.table.refBadge}</span>}
                    </th>
                    <Cell cell={row.first} />
                    <Cell cell={row.renew} />
                    <Cell cell={row.fiveYear} />
                  </tr>
                ))}
                {view.table.diff && (
                  <tr className="bg-bg2/40">
                    <th scope="row" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-txt1">
                      {view.table.diff.label}
                    </th>
                    <Cell cell={view.table.diff.first} />
                    <Cell cell={view.table.diff.renew} />
                    <Cell cell={view.table.diff.fiveYear} />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-txt2">
            {view.table.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function Cell({ cell }: { cell: PriceCell }) {
  return (
    <td className="tnum whitespace-nowrap px-3 py-2.5 text-right">
      <span className="block text-txt0">{cell.usdText}</span>
      <span className="block text-[11px] text-txt2">{cell.cnyText}</span>
    </td>
  );
}
