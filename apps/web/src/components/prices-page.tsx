import { ArrowDown, ArrowUp, ArrowUpDown, HelpCircle, Sparkles, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { COMPARE_SLUGS, compareLabel } from "@/content/compare-slugs";
import { buildPricesFaq } from "@/content/prices-faq";
import { TLD_LIST } from "@/content/tld-list";
import { useI18n } from "@/lib/i18n";
import { toCny, toUsd, usePriceMeta, usePrices, usePricesSettled } from "@/lib/prices";
import { tldPrice } from "@/types";
import { cn } from "@/lib/utils";

type SortKey = "reg" | "renew" | "tld";

interface PriceRow {
  tld: string;
  reg: number;
  renew: number;
  live: boolean;
}

/** 每行价格：实时 Porkbun 美元优先，缺失回退静态人民币参考价换算（标注 ≈） */
function buildRows(prices: ReturnType<typeof usePrices>): PriceRow[] {
  return TLD_LIST.map((tld) => {
    const p = prices?.[tld];
    if (p) return { tld, reg: p.registration, renew: p.renewal, live: true };
    const s = tldPrice(tld);
    return { tld, reg: s ? toUsd(s.first) : Number.MAX_SAFE_INTEGER, renew: s ? toUsd(s.renew) : Number.MAX_SAFE_INTEGER, live: false };
  });
}

export function PricesPage() {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const settled = usePricesSettled();
  const meta = usePriceMeta();
  const [sort, setSort] = useState<SortKey>("reg");
  const [desc, setDesc] = useState(false);
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase().replace(/^\./, "");
    const list = buildRows(prices).filter((r) => !q || r.tld.includes(q));
    if (sort === "tld") list.sort((a, b) => a.tld.localeCompare(b.tld));
    else list.sort((a, b) => (sort === "reg" ? a.reg - b.reg : a.renew - b.renew));
    return desc ? list.reverse() : list;
  }, [prices, sort, desc, filter]);

  // 再点同一列切换升/降序，切换列时重置为升序
  const TH = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => {
        if (sort === k) setDesc((d) => !d);
        else {
          setSort(k);
          setDesc(false);
        }
      }}
      className={cn("flex min-h-[32px] items-center gap-1 text-xs font-semibold", sort === k ? "text-brand" : "text-txt1 hover:text-txt0")}
    >
      {label}
      {sort === k ? (desc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
    </button>
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="flex items-center gap-1.5 font-mono text-sm text-brand">
        <Tag className="h-4 w-4" />
        {t("prices.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{t("prices.title")}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-txt1">{t("prices.intro")}</p>
      {meta?.stale && meta.fetchedAt !== null && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[13px] text-amber-600">
          {t("prices.staleNote", { hours: Math.max(1, Math.round((Date.now() - meta.fetchedAt) / 3600_000)) })}
        </p>
      )}

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t("prices.filter")}
        className="mt-6 h-10 w-full max-w-xs rounded-lg border border-line bg-bg1 px-3 font-mono text-sm text-txt0 outline-none transition-colors placeholder:font-sans placeholder:text-txt2 focus:border-brand-line"
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 border-b border-line bg-bg1 px-4 py-2.5">
          <TH k="tld" label={t("prices.colTld")} />
          <TH k="reg" label={t("prices.colReg")} />
          <TH k="renew" label={t("prices.colRenew")} />
          <span />
        </div>
        {rows.length === 0 && <p className="px-4 py-6 text-center text-sm text-txt2">{t("prices.noMatch")}</p>}
        {!settled &&
          rows.map((r) => (
            <div key={r.tld} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 border-b border-line px-4 py-3 last:border-b-0">
              <a href={`/tld/${r.tld}?lang=${lang}`} className="tap-target font-mono text-sm font-semibold text-txt0 hover:text-brand">
                .{r.tld}
              </a>
              <span className="h-5 w-14 animate-pulse rounded bg-bg1" />
              <span className="h-5 w-14 animate-pulse rounded bg-bg1" />
              <a
                href={`/?tld=${r.tld}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-2.5 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-[36px]"
              >
                {t("prices.hunt")}
              </a>
            </div>
          ))}
        {settled &&
          rows.map((r) => (
          <div key={r.tld} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 border-b border-line px-4 py-3 last:border-b-0 hover:bg-bg1">
            <a href={`/tld/${r.tld}?lang=${lang}`} className="tap-target font-mono text-sm font-semibold text-txt0 hover:text-brand">
              .{r.tld}
            </a>
            <span className="tnum font-mono text-sm">
              {r.live ? "" : "≈"}${r.reg}
              <span className="tnum ml-1 hidden text-[11px] text-txt2 sm:inline">¥{toCny(r.reg)}</span>
            </span>
            <span className="tnum flex items-center gap-1.5 font-mono text-sm text-txt1">
              <span>
                {r.live ? "" : "≈"}${r.renew}
                <span className="tnum ml-1 hidden text-[11px] text-txt2 sm:inline">¥{toCny(r.renew)}</span>
              </span>
              {r.renew >= r.reg * 3 && r.reg > 0 && (
                <span title={t("prices.trapTip")} className="rounded bg-amber-500/15 px-1 py-0.5 font-sans text-[10px] font-semibold text-amber-500">
                  {t("prices.trap")}
                </span>
              )}
            </span>
            <a
              href={`/?tld=${r.tld}`}
              className="flex min-h-[44px] items-center rounded-lg border border-line px-2.5 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-[36px]"
            >
              {t("prices.hunt")}
            </a>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-txt2">{t("prices.source")}</p>

      {/* FAQ */}
      <h2 className="mt-10 flex items-center gap-2 text-base font-bold">
        <HelpCircle className="h-4 w-4 text-brand" />
        {t("tld.faq")}
      </h2>
      <div className="mt-3 space-y-2">
        {buildPricesFaq(lang).map((item) => (
          <details key={item.q} className="group rounded-xl border border-line bg-bg1 px-4 py-3">
            <summary className="flex min-h-[28px] cursor-pointer list-none items-center text-sm font-semibold text-txt0 [&::-webkit-details-marker]:hidden">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-txt1">{item.a}</p>
          </details>
        ))}
      </div>

      {/* 对比页内链：价格看完直接进两两对比 */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-txt0">{t("footer.compares")}</h2>
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-0.5">
          {COMPARE_SLUGS.map((slug) => (
            <a
              key={slug}
              href={`/vs/${slug}?lang=${lang}`}
              className="inline-flex min-h-[40px] items-center px-2 font-mono text-xs text-txt1 hover:text-brand hover:underline"
            >
              {compareLabel(slug)}
            </a>
          ))}
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center">
        <h2 className="text-lg font-bold">{t("prices.ctaTitle")}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt1">{t("prices.ctaDesc")}</p>
        <a
          href="/"
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("prices.ctaButton")}
        </a>
      </div>
    </main>
  );
}
