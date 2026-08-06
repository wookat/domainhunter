import { CheckCircle2, Lightbulb, Sparkles, Tag } from "lucide-react";

import { TLD_COMPARES, comparesForTld } from "@/content/compares";
import { INDUSTRY_GUIDES, guidesForTld } from "@/content/guides";
import { TLD_GUIDES, TLD_LIST } from "@/content/tlds";
import { useI18n } from "@/lib/i18n";
import { priceFull, priceShort, toCny, usePrices } from "@/lib/prices";
import { cn } from "@/lib/utils";

export function TldPage({ tld }: { tld: string }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const guide = TLD_GUIDES[tld];

  if (!guide) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center md:px-6">
        <p className="text-sm text-txt1">{t("tld.notFound")}</p>
        <a href="/" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink">
          {t("share.goHome")}
        </a>
      </main>
    );
  }

  const loc = guide[lang];
  const live = prices?.[tld];
  const relatedGuides = guidesForTld(tld);
  const relatedCompares = comparesForTld(tld);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">.{tld}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{loc.title}</h1>

      {/* 价格卡：实时 Porkbun 价，失败回退静态参考价 */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-bg1 px-5 py-4">
        <Tag className="h-4 w-4 shrink-0 text-brand" />
        {live ? (
          <>
            <span className="text-sm">
              {t("tld.priceReg")} <b className="tnum font-mono">${live.registration}</b>
              <span className="tnum ml-1 text-xs text-txt2">≈ ¥{toCny(live.registration)}</span>
            </span>
            <span className="text-sm">
              {t("tld.priceRenew")} <b className="tnum font-mono">${live.renewal}</b>
              <span className="tnum ml-1 text-xs text-txt2">≈ ¥{toCny(live.renewal)}</span>
            </span>
            <span className="text-[11px] text-txt2">{t("tld.priceSource")}</span>
          </>
        ) : (
          <span className="text-sm text-txt1">{priceFull(tld, lang, prices) ?? t("tld.priceLoading")}</span>
        )}
        <a href={`/prices?lang=${lang}`} className="ml-auto inline-flex min-h-[36px] items-center text-xs text-txt2 hover:text-brand hover:underline">
          {t("prices.seeAll")}
        </a>
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-txt1">{loc.intro}</p>

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <CheckCircle2 className="h-4 w-4 text-brand" />
        {t("tld.bestFor")}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {loc.bestFor.map((item) => (
          <li key={item} className="rounded-lg border border-line bg-bg1 px-3.5 py-2.5 text-sm text-txt1">
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Lightbulb className="h-4 w-4 text-gold" />
        {t("tld.naming")}
      </h2>
      <ul className="mt-3 space-y-2">
        {loc.namingTips.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm leading-relaxed text-txt1">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
            {tip}
          </li>
        ))}
      </ul>

      {/* CTA：预填该 TLD 的猎名入口 */}
      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center">
        <h2 className="text-lg font-bold">{t("tld.ctaTitle", { tld })}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt1">{t("tld.ctaDesc", { tld })}</p>
        <a
          href={`/?tld=${tld}`}
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("tld.ctaButton", { tld })}
        </a>
      </div>

      {/* 其他 TLD 指南互链 */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-txt1">{t("tld.others")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TLD_LIST.map((other) => (
            <a
              key={other}
              href={`/tld/${other}?lang=${lang}`}
              className={cn(
                "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                other === tld ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:border-brand-line hover:text-brand",
              )}
            >
              .{other}
              {priceShort(other, lang, prices) && <span className="tnum ml-1.5 text-[10px] text-txt2">{priceShort(other, lang, prices)}</span>}
            </a>
          ))}
        </div>
      </div>

      {/* 相关后缀对比互链 */}
      {relatedCompares.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-txt1">{t("vs.relatedCompares")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCompares.map((slug) => (
              <a
                key={slug}
                href={`/vs/${slug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                .{TLD_COMPARES[slug].a} vs .{TLD_COMPARES[slug].b}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 相关行业命名指南互链 */}
      {relatedGuides.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-txt1">{t("tld.relatedGuides")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedGuides.map((slug) => (
              <a
                key={slug}
                href={`/guide/${slug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                {INDUSTRY_GUIDES[slug][lang].label}
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
