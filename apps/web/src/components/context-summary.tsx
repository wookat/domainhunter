import { useId, useState } from "react";
import { Brain, ChevronDown, Wand2 } from "lucide-react";

import type { Understanding } from "@/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const REFINE_KEYS = ["refine.concise", "refine.global", "refine.coined", "refine.zhFlavor"] as const;
// 中文 12 字 ≈ 英文 36 字符的视觉宽度；超出部分再由 CSS truncate 兑底
const SNIPPET_CHARS = { zh: 12, en: 36 } as const;

function snippet(text: string, max: number): string {
  const chars = [...text.trim()];
  return chars.length > max ? `${chars.slice(0, max).join("")}…` : chars.join("");
}

/**
 * R472：<768px 专用的单行上下文摘要，替代恢复条 + AI 理解条两块叠放。
 * 折叠态一行「已恢复 · <理解前 12 字> ▾」，展开态放全文、恢复条动作与微调 chips。
 * 桌面（md+）由既有 resumedNotice / UnderstandingBar 承担，本组件 md:hidden。
 */
export function ContextSummary({
  restored,
  understanding,
  fallback,
  description,
  onRefine,
  running,
  quotaExhausted,
  onNewSearch,
  onDismissRestored,
}: {
  restored: boolean;
  understanding: Understanding | null;
  fallback: string;
  description: string;
  onRefine: (pref: string) => void;
  running: boolean;
  quotaExhausted?: boolean;
  onNewSearch: () => void;
  onDismissRestored: () => void;
}) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const blocked = running || quotaExhausted;
  const lead = restored ? t("summary.restored") : t("summary.ai");
  const brief = snippet(understanding?.core || description, SNIPPET_CHARS[lang]);

  return (
    <div className="mx-auto mt-3 w-full max-w-6xl px-4 md:hidden">
      <div className="rounded-xl border border-brand-line/60 bg-brand-dim/40">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t("summary.collapse") : t("summary.expand")}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[44px] w-full items-center gap-2 px-3 text-left text-[13px] text-txt1"
        >
          <Brain className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-medium text-txt0">{lead}</span>
            <span className="text-txt2"> · </span>
            <span>{brief}</span>
          </span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-txt2 transition-transform", open && "rotate-180")} />
        </button>
        <div id={panelId} hidden={!open} className="border-t border-brand-line/40 px-3 pb-3 pt-2 text-[13px] leading-relaxed text-txt1">
          {restored && (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span>{t("resume.notice")}</span>
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  className="min-h-[44px] rounded-md border border-line px-2.5 font-medium text-txt1 transition-colors hover:border-brand-line hover:text-brand"
                  onClick={onNewSearch}
                >
                  {t("resume.newSearch")}
                </button>
                <button
                  type="button"
                  aria-label={t("resume.dismiss")}
                  className="min-h-[44px] min-w-[44px] rounded-md px-2 text-txt2 transition-colors hover:text-txt0"
                  onClick={onDismissRestored}
                >
                  ✕
                </button>
              </span>
            </div>
          )}
          {understanding ? (
            <p>
              {t("understand.prefix")}<b className="text-txt0">{understanding.core}</b>
              {understanding.style && (
                <>
                  {" "}
                  <span className="whitespace-nowrap rounded bg-bg1/70 px-1.5 py-0.5 text-xs">{t("understand.style")} {understanding.style}</span>
                </>
              )}
              {understanding.scene && (
                <>
                  {" "}
                  <span className="whitespace-nowrap rounded bg-bg1/70 px-1.5 py-0.5 text-xs">{t("understand.scene")} {understanding.scene}</span>
                </>
              )}
            </p>
          ) : (
            <p className="break-words">{fallback}</p>
          )}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-txt2">
            <Wand2 className="h-3.5 w-3.5" />
            {t("summary.refineTitle")}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {REFINE_KEYS.map((k) => {
              const label = t(k);
              return (
                <button
                  key={k}
                  type="button"
                  disabled={blocked}
                  onClick={() => onRefine(label)}
                  title={quotaExhausted ? t("results.moreQuota") : t("understand.refineTitle", { pref: label })}
                  className={cn(
                    "min-h-[44px] whitespace-nowrap rounded-full border border-line bg-bg1 px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand",
                    blocked && "pointer-events-none opacity-50",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
