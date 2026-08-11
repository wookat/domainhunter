import { ChevronRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";

/** 内容详情页可见面包屑：首页 › hub › 当前页，与 SSR（ssr-html.ts hubCrumbKicker）及 BreadcrumbList JSON-LD 语义一致 */
export function Breadcrumb({ hub, current }: { hub: "tld" | "guide" | "vs"; current: string }) {
  const { t, lang } = useI18n();
  const hubLabel = t(hub === "tld" ? "hub.allTld" : hub === "guide" ? "hub.allGuide" : "hub.allVs");
  return (
    <nav aria-label={t("crumb.nav")}>
      <ol className="flex min-w-0 items-center font-mono text-sm text-txt2">
        <li className="shrink-0">
          <a href={`/?lang=${lang}`} className="tap-target inline-block hover:text-brand hover:underline">
            {t("crumb.home")}
          </a>
        </li>
        <li aria-hidden="true" className="shrink-0">
          <ChevronRight className="mx-1 h-3.5 w-3.5" />
        </li>
        <li className="shrink-0">
          <a href={`/${hub}?lang=${lang}`} className="tap-target inline-block hover:text-brand hover:underline">
            {hubLabel}
          </a>
        </li>
        <li aria-hidden="true" className="shrink-0">
          <ChevronRight className="mx-1 h-3.5 w-3.5" />
        </li>
        <li aria-current="page" className="min-w-0 truncate text-brand">
          {current}
        </li>
      </ol>
    </nav>
  );
}
