import { Brain, Wand2 } from "lucide-react";

import type { Understanding } from "@/types";
import { cn } from "@/lib/utils";

export const REFINE_OPTIONS = ["更简洁", "更国际化", "更大胆造词", "更中文语感"] as const;

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
  return (
    <div className="mx-auto mt-4 w-full max-w-6xl px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-brand-line/60 bg-brand-dim/40 px-4 py-2.5">
        <span className="flex min-w-0 flex-1 basis-64 items-start gap-2 text-[13px] leading-relaxed text-txt1">
          <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          {understanding ? (
            <span className="min-w-0">
              我理解你要的是：<b className="text-txt0">{understanding.core}</b>
              {understanding.style && (
                <>
                  {" "}
                  <span className="whitespace-nowrap rounded bg-bg1/70 px-1.5 py-0.5 text-xs">风格 {understanding.style}</span>
                </>
              )}
              {understanding.scene && (
                <>
                  {" "}
                  <span className="whitespace-nowrap rounded bg-bg1/70 px-1.5 py-0.5 text-xs">场景 {understanding.scene}</span>
                </>
              )}
            </span>
          ) : (
            <span className="min-w-0 truncate">{fallback}</span>
          )}
        </span>
        <span className="flex items-center gap-1.5">
          <Wand2 className="hidden h-3.5 w-3.5 text-txt2 sm:block" />
          {REFINE_OPTIONS.map((p) => (
            <button
              key={p}
              disabled={running}
              onClick={() => onRefine(p)}
              title={`按「${p}」偏好再猎一轮`}
              className={cn(
                "min-h-[44px] whitespace-nowrap rounded-full border border-line bg-bg1 px-2.5 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0 sm:py-1",
                running && "pointer-events-none opacity-50",
              )}
            >
              {p}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
