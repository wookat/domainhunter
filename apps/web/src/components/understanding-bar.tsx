import { Brain, Wand2 } from "lucide-react";

import type { Understanding } from "@/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const REFINE_KEYS = ["refine.concise", "refine.global", "refine.coined", "refine.zhFlavor"] as const;

export function UnderstandingBar({
  understanding,
  fallback,
  onRefine,
  running,
}: {
  understanding: Understanding | null;
  fallback: string;
  onRefine: (pref: string) => void;
  running: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto mt-4 w-full max-w-6xl px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-brand-line/60 bg-brand-dim/40 px-4 py-2.5">
        <span className="flex min-w-0 flex-1 basis-64 items-start gap-2 text-[13px] leading-relaxed text-txt1">
          <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          {understanding ? (
            <span className="min-w-0">
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
            </span>
          ) : (
            <span className="min-w-0 truncate">{fallback}</span>
          )}
        </span>
        <span className="flex items-center gap-1.5">
          <Wand2 className="hidden h-3.5 w-3.5 text-txt2 sm:block" />
          {REFINE_KEYS.map((k) => {
            const label = t(k);
            return (
              <button
                key={k}
                disabled={running}
                onClick={() => onRefine(label)}
                title={t("understand.refineTitle", { pref: label })}
                className={cn(
                  "min-h-[44px] whitespace-nowrap rounded-full border border-line bg-bg1 px-2.5 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0 sm:py-1",
                  running && "pointer-events-none opacity-50",
                )}
              >
                {label}
              </button>
            );
          })}
        </span>
      </div>
    </div>
  );
}
