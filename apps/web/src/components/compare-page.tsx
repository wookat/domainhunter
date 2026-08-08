import { CheckCircle2, HelpCircle, Scale, Sparkles } from "lucide-react";

import { buildCompareFaq } from "@/content/compare-faq";
import { TLD_COMPARES } from "@/content/compares";
import { INDUSTRY_GUIDES, guidesForTld } from "@/content/guides";
import { TLD_GUIDES } from "@/content/tlds";
import { useI18n } from "@/lib/i18n";
import { priceFull, usePrices } from "@/lib/prices";
import { usePageTitle } from "@/lib/use-page-title";

export function ComparePage({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const prices = usePrices();
  const cmp = TLD_COMPARES[slug];
  usePageTitle(cmp?.[lang].title);

  if (!cmp) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center md:px-6">
        <p className="text-sm text-txt1">{t("tld.notFound")}</p>
        <a href="/" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink">
          {t("share.goHome")}
        </a>
      </main>
    );
  }

  const loc = cmp[lang];
  const sides = [cmp.a, cmp.b] as const;
  const picks = [loc.pickA, loc.pickB] as const;
  const faq = buildCompareFaq(cmp, lang);
  const relatedGuides = [...new Set([...guidesForTld(cmp.a), ...guidesForTld(cmp.b)])].slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">
        <a href={`/vs?lang=${lang}`} className="text-txt2 hover:text-brand hover:underline">
          {t("hub.allVs")}
        </a>
        <span className="mx-1.5 text-txt2">/</span>.{cmp.a} vs .{cmp.b}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{loc.title}</h1>

      {/* 对比结论 */}
      <div className="mt-6 rounded-xl border border-line bg-bg1 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Scale className="h-4 w-4 text-brand" />
          {t("vs.verdict")}
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-txt1">{loc.verdict}</p>
      </div>

      {/* 双列：各自的定位、价格与适用场景 */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sides.map((tld, i) => {
          const guide = TLD_GUIDES[tld];
          return (
            <section key={tld} className="rounded-2xl border border-line bg-bg1 p-5">
              <a href={`/tld/${tld}?lang=${lang}`} className="font-mono text-lg font-bold text-brand hover:underline">
                .{tld}
              </a>
              <p className="tnum mt-1 text-xs text-txt2">{priceFull(tld, lang, prices) ?? t("tld.priceLoading")}</p>
              {guide && <p className="mt-3 text-sm leading-relaxed text-txt1">{guide[lang].intro.split(lang === "zh" ? "。" : ". ")[0] + (lang === "zh" ? "。" : ".")}</p>}
              <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                {t("vs.pickWhen", { tld })}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {picks[i].map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-txt1">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* FAQ */}
      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <HelpCircle className="h-4 w-4 text-brand" />
        {t("tld.faq")}
      </h2>
      <div className="mt-3 space-y-2">
        {faq.map((item) => (
          <details key={item.q} className="group rounded-xl border border-line bg-bg1 px-4 py-3">
            <summary className="flex min-h-[28px] cursor-pointer list-none items-center text-sm font-semibold text-txt0 [&::-webkit-details-marker]:hidden">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-txt1">{item.a}</p>
          </details>
        ))}
      </div>

      {/* CTA：同时在两个后缀下猎名 */}
      <div className="mt-10 rounded-2xl border border-brand-line bg-brand-dim p-6 text-center">
        <h2 className="text-lg font-bold">{t("vs.ctaTitle", { a: cmp.a, b: cmp.b })}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt1">{t("vs.ctaDesc")}</p>
        <a
          href={`/?tld=${cmp.a},${cmp.b}`}
          className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("vs.ctaButton")}
        </a>
      </div>

      <p className="mt-4 text-center">
        <a href={`/prices?lang=${lang}`} className="inline-flex min-h-[44px] items-center px-2 text-sm text-txt1 hover:text-brand hover:underline">
          {t("prices.seeAll")}
        </a>
      </p>

      {/* 相关行业命名指南互链 */}
      {relatedGuides.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-txt1">{t("tld.relatedGuides")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedGuides.map((gSlug) => (
              <a
                key={gSlug}
                href={`/guide/${gSlug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                {INDUSTRY_GUIDES[gSlug][lang].label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 其他对比页互链 */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-txt1">{t("vs.others")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.values(TLD_COMPARES).map((other) => (
            <a
              key={other.slug}
              href={`/vs/${other.slug}?lang=${lang}`}
              className={
                other.slug === slug
                  ? "flex min-h-[44px] items-center rounded-lg border border-brand-line bg-brand-dim px-3 font-mono text-xs font-semibold text-brand"
                  : "flex min-h-[44px] items-center rounded-lg border border-line px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              }
            >
              .{other.a} vs .{other.b}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
