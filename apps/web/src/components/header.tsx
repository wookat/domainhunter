import { Bookmark, BookmarkCheck, Crosshair, Star, SunMoon } from "lucide-react";
import type { ReactNode } from "react";

import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Header({
  center,
  right,
  onLogoClick,
  shortlistCount,
  shortlistActive = false,
  onShortlistClick,
}: {
  center?: ReactNode;
  right?: ReactNode;
  onLogoClick?: () => void;
  shortlistCount: number;
  shortlistActive?: boolean;
  onShortlistClick: () => void;
}) {
  const [, toggleTheme] = useTheme();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg0/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <button onClick={onLogoClick} className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-brand-line bg-brand-dim">
            <Crosshair className="h-4 w-4 text-brand" />
          </span>
          DomainHunter
        </button>
        <div className="flex items-center gap-1.5">
          {center}
          {right}
          <button
            onClick={onShortlistClick}
            aria-pressed={shortlistActive}
            className={cn(
              "flex h-11 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors sm:h-9",
              shortlistActive
                ? "border-brand-line bg-brand-dim font-semibold text-brand"
                : "border-line text-txt1 hover:bg-bg2 hover:text-txt0",
            )}
          >
            {shortlistActive ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            <span className="hidden sm:inline">候选清单</span>
            <span
              className={cn(
                "tnum rounded-full px-1.5 font-mono text-[11px]",
                shortlistActive ? "bg-brand text-brand-ink" : "bg-brand-dim text-brand",
              )}
            >
              {shortlistCount}
            </span>
          </button>
          <a
            href="https://github.com/wookat/domainhunter"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 w-9 place-items-center rounded-lg text-txt1 hover:bg-bg2 hover:text-txt0 sm:grid"
            title="GitHub"
          >
            <Star className="h-4 w-4" />
          </a>
          <button
            onClick={toggleTheme}
            className="grid h-11 w-11 place-items-center rounded-lg border border-line text-txt1 hover:bg-bg2 hover:text-txt0 sm:h-9 sm:w-9"
            title="切换浅色/暗色"
          >
            <SunMoon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
