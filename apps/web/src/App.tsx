import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { Header } from "@/components/header";
import type { HomeValues } from "@/components/home-page";
import { getHomePage, loadHomePage } from "@/components/home-page-loader";
import type { LogEntry } from "@/components/agent-page";
import { UnderstandingBar } from "@/components/understanding-bar";
import { ContextSummary } from "@/components/context-summary";
import { isMockEnabled, runMockStream } from "@/mock";
import { clearAiQuotaDown, loadSearch, markAiQuotaDown, saveSearch, type SavedFallback } from "@/lib/persist";
import { TLD_LIST } from "@/content/tld-list";
import { GUIDE_LABELS } from "@/content/guide-labels";
import { COMPARE_SLUGS, compareLabel } from "@/content/compare-slugs";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { useShortlist } from "@/lib/shortlist";
import { cn, errorSpec, httpErrorSpec, UiErrorException, uiErrorText, type UiError } from "@/lib/utils";
import type { AiErrorKind, FallbackReason, Row, RoundInfo, StreamEvent, Status, Understanding } from "@/types";

// 按路由懒加载：这些页面不在首屏关键路径上，拆包降低首屏 JS。
// chunk 加载失败（新部署后旧 hashed 文件 404）时自动整页刷新一次拿新版本，避免白屏。
function lazyChunk<T, P>(load: () => Promise<T>, pick: (m: T) => React.ComponentType<P>) {
  return lazy(async () => {
    try {
      const m = await load();
      sessionStorage.removeItem("dh:chunkReloaded");
      return { default: pick(m) };
    } catch (e) {
      if (!sessionStorage.getItem("dh:chunkReloaded")) {
        sessionStorage.setItem("dh:chunkReloaded", "1");
        window.location.reload();
        await new Promise(() => undefined); // 等待刷新，不再渲染
      }
      throw e;
    }
  });
}

// R472：上游瞬时限流（SSE errorKind=rate-limit）后自动重试一次的倒计时秒数
const AUTO_RETRY_SEC = 30;

// 首页组件：预载完成后同步渲染（首次落地 "/" 时 main.tsx 已等 chunk 就绪，不走 Suspense 回退）
const LazyHomePage = lazyChunk(loadHomePage, (m) => m.HomePage);

// 已预载时同步渲染首页，避免 Suspense 回退帧带来的布局跳变（CLS）
function HomePageSlot(props: React.ComponentProps<typeof import("@/components/home-page").HomePage>) {
  const Loaded = getHomePage();
  return Loaded ? <Loaded {...props} /> : <LazyHomePage {...props} />;
}
const SharePage = lazyChunk(() => import("@/components/share-page"), (m) => m.SharePage);
const TldPage = lazyChunk(() => import("@/components/tld-page"), (m) => m.TldPage);
const GuidePage = lazyChunk(() => import("@/components/guide-page"), (m) => m.GuidePage);
const ComparePage = lazyChunk(() => import("@/components/compare-page"), (m) => m.ComparePage);
const ShortlistPage = lazyChunk(() => import("@/components/shortlist-page"), (m) => m.ShortlistPage);
const MonitorsPage = lazyChunk(() => import("@/components/monitors-page"), (m) => m.MonitorsPage);
const AdvancedPage = lazyChunk(() => import("@/components/advanced-page"), (m) => m.AdvancedPage);
const PricesPage = lazyChunk(() => import("@/components/prices-page"), (m) => m.PricesPage);
const WhyPage = lazyChunk(() => import("@/components/why-page"), (m) => m.WhyPage);
const TldHubPage = lazyChunk(() => import("@/components/tld-hub-page"), (m) => m.TldHubPage);
const GuideHubPage = lazyChunk(() => import("@/components/guide-hub-page"), (m) => m.GuideHubPage);
const CompareHubPage = lazyChunk(() => import("@/components/compare-hub-page"), (m) => m.CompareHubPage);
const McpPage = lazyChunk(() => import("@/components/mcp-page"), (m) => m.McpPage);
const AgentPage = lazyChunk(() => import("@/components/agent-page"), (m) => m.AgentPage);
const ResultsPage = lazyChunk(() => import("@/components/results-page"), (m) => m.ResultsPage);
const NotFoundPage = lazyChunk(() => import("@/components/not-found-page"), (m) => m.NotFoundPage);

/** 首屏空闲时预取搜索路径的懒 chunk，点「开始猎取」时零等待 */
function prefetchSearchChunks() {
  const load = () => {
    void loadHomePage();
    void import("@/components/agent-page");
    void import("@/components/results-page");
  };
  const idle = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(load);
    else window.setTimeout(load, 3000);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

function PageFallback() {
  return <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-16" />;
}

type Mode = "home" | "agent" | "results" | "shortlist" | "advanced" | "monitors";
const TARGET = 10;

function shareIdFromPath(): string | null {
  const m = window.location.pathname.match(/^\/s\/([\w-]{1,32})$/);
  return m ? m[1] : null;
}

function tldFromPath(): string | null {
  const m = window.location.pathname.match(/^\/tld\/([a-z0-9-]{2,24})$/i);
  return m ? m[1].toLowerCase() : null;
}

function guideFromPath(): string | null {
  const m = window.location.pathname.match(/^\/guide\/([a-z0-9-]{2,24})$/i);
  return m ? m[1].toLowerCase() : null;
}

const pricesFromPath = () => window.location.pathname === "/prices";

const tldHubFromPath = () => window.location.pathname === "/tld";

const guideHubFromPath = () => window.location.pathname === "/guide";

const compareHubFromPath = () => window.location.pathname === "/vs";

const whyFromPath = () => window.location.pathname === "/why";

const mcpFromPath = () => window.location.pathname === "/mcp";

const shortlistFromPath = () => window.location.pathname === "/shortlist";

const advancedFromPath = () => window.location.pathname === "/advanced";

const monitorsFromPath = () => window.location.pathname === "/monitors";

function compareFromPath(): string | null {
  const m = window.location.pathname.match(/^\/vs\/([a-z0-9-]{2,48})$/i);
  return m ? m[1].toLowerCase() : null;
}

/** 未知顶层路径：不匹配任何已知路由时渲染客户端 404 页（HTTP 状态码/noindex 由 worker 负责） */
function notFoundFromPath(): boolean {
  return (
    window.location.pathname !== "/" &&
    !shareIdFromPath() &&
    !tldFromPath() &&
    !guideFromPath() &&
    !compareFromPath() &&
    !pricesFromPath() &&
    !tldHubFromPath() &&
    !guideHubFromPath() &&
    !compareHubFromPath() &&
    !whyFromPath() &&
    !mcpFromPath() &&
    !shortlistFromPath() &&
    !advancedFromPath() &&
    !monitorsFromPath()
  );
}

/** 服务端是否注入了分析 beacon（Worker var ANALYTICS_*，见 growth-inject.ts）；仅此时页脚展示隐私说明 */
function analyticsEnabled(): boolean {
  return typeof document !== "undefined" && document.querySelector("script[data-cf-beacon]") !== null;
}

/** 首页默认 TLD：支持 /?tld=xx 或 /?tld=xx,yy 精确预填（TLD 指南页 / 对比页 CTA、分享搜索链接入口），不自动补 com */
function initialTlds(): string[] {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("tld")?.trim().toLowerCase();
  const list = (q ?? "").split(",").map((s) => s.trim().replace(/^\./, "")).filter((s) => /^[a-z0-9-]{2,24}$/.test(s));
  if (list.length > 0) return [...new Set(list)];
  return ["com", "cn"];
}

export default function App() {
  const { t, lang } = useI18n();
  const [shareId] = useState<string | null>(shareIdFromPath);
  const [guideTld] = useState<string | null>(tldFromPath);
  const [guideSlug] = useState<string | null>(guideFromPath);
  const [compareSlug] = useState<string | null>(compareFromPath);
  const [isPrices] = useState(pricesFromPath);
  const [isTldHub] = useState(tldHubFromPath);
  const [isGuideHub] = useState(guideHubFromPath);
  const [isCompareHub] = useState(compareHubFromPath);
  const [isWhy] = useState(whyFromPath);
  const [isNotFound] = useState(notFoundFromPath);
  const [isMcp] = useState(mcpFromPath);
  const [hasAnalytics] = useState(analyticsEnabled);
  const [saved] = useState(() => {
    if (shareIdFromPath() || tldFromPath() || guideFromPath() || compareFromPath() || pricesFromPath() || whyFromPath() || mcpFromPath() || advancedFromPath() || tldHubFromPath() || guideHubFromPath() || compareHubFromPath()) return null;
    // /?q= 或 /?tpl= 是显式预填入口（分享搜索链接 / 指南页 CTA），/?mode=exact 是精确核验入口（AI 不可用时的降级 CTA），
    // 都直接进首页，不恢复上次结果
    const params = new URLSearchParams(window.location.search);
    if (params.get("q") || params.get("tpl") || params.get("mode") === "exact") return null;
    return loadSearch();
  });
  const [mode, setMode] = useState<Mode>(() => (shortlistFromPath() ? "shortlist" : monitorsFromPath() ? "monitors" : advancedFromPath() ? "advanced" : saved ? "results" : "home"));
  const [resumedNotice, setResumedNotice] = useState(() => Boolean(saved) && !shortlistFromPath() && !monitorsFromPath());
  // R465（R464 复评）：恢复态结果页的「再来一轮」需两步确认，本会话首次真实发起后解除
  const [restoredGuard, setRestoredGuard] = useState(() => Boolean(saved));
  const [noticeClosing, setNoticeClosing] = useState(false);
  const dismissNotice = () => {
    setNoticeClosing(true);
    window.setTimeout(() => {
      setResumedNotice(false);
      setNoticeClosing(false);
    }, 350);
  };
  const [values, setValues] = useState<HomeValues>(() => saved?.values ?? { description: "", tlds: initialTlds(), style: "", lengthPref: "" });
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? []);
  const [rounds, setRounds] = useState<RoundInfo[]>(saved?.rounds ?? []);
  const [currentRound, setCurrentRound] = useState(0);
  const [running, setRunning] = useState(false);
  // 错误条存结构化描述（i18n key/params 或服务端 literal），渲染期再 t()，切换语言即重译
  const [error, setError] = useState<UiError | null>(null);
  // R264：AI 上游错误类别：quota 类重试无效，不展示重试 CTA
  const [errorKind, setErrorKind] = useState<AiErrorKind | null>(null);
  // R472：rate-limit 自动重试倒计时（剩余秒数；null = 无倒计时）。
  // 每个用户显式发起的序列内只自动重试一次；取消或第二次仍限流都退回手动重试。
  const [autoRetryLeft, setAutoRetryLeft] = useState<number | null>(null);
  const autoRetriedRef = useRef(false);
  // R247：多轮低产出提示（worker 每次搜索至多发一次 hint 事件）
  const [lowYieldHint, setLowYieldHint] = useState(false);
  // R471：AI 不可用时的规则降级（fallback 事件）：结果页顶部挂横幅，候选交互照常
  const [fallback, setFallback] = useState<SavedFallback | null>(saved?.fallback ?? null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [elapsedSec, setElapsedSec] = useState<number | undefined>(saved?.elapsedSec);
  const [locked, setLocked] = useState<Set<string>>(() => new Set(saved?.locked ?? []));
  const [aiUnderstanding, setAiUnderstanding] = useState<Understanding | null>(saved?.aiUnderstanding ?? null);
  const [refinements, setRefinements] = useState<string[]>(saved?.refinements ?? []);
  const [disliked, setDisliked] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);
  const triedLabelsRef = useRef<string[]>(saved?.triedLabels ?? []);
  const roundOffsetRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastRunRef = useRef<{ v: HomeValues; opts: { more?: boolean; aroundLocked?: boolean; refinePrefs?: string[] } } | null>(null);
  const shortlist = useShortlist();
  const beforeShortlistRef = useRef<Mode>(saved ? "results" : "home");

  const openShortlist = () => {
    if (mode !== "shortlist") beforeShortlistRef.current = mode;
    window.history.replaceState(null, "", "/shortlist");
    setMode("shortlist");
  };
  const closeShortlist = () => {
    if (shortlistFromPath()) window.history.replaceState(null, "", "/");
    setMode(beforeShortlistRef.current);
  };
  const closeMonitors = () => {
    if (monitorsFromPath()) window.history.replaceState(null, "", "/");
    setMode(saved || rows.length > 0 ? "results" : "home");
  };
  const openAdvanced = () => {
    window.history.replaceState(null, "", "/advanced");
    setMode("advanced");
  };
  const closeAdvanced = () => {
    if (advancedFromPath()) window.history.replaceState(null, "", "/");
    setMode("home");
  };

  const toggleDislike = (label: string) =>
    setDisliked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const toggleLock = (domain: string) =>
    setLocked((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });

  const availableCount = rows.filter((r) => r.status === "available").length;
  // R267：quota（401/402/403）重试必然失败，抑制所有会触发 AI 的入口；
  // R471：因 quota / 服务端熔断降级时同样抑制（再来一轮只会再次命中熔断）
  const quotaExhausted = errorKind === "quota" || fallback?.reason === "quota" || fallback?.reason === "quota-breaker";
  // 降级横幅全文：原因 + 候选数 + （配额类）熔断预计解除时间；恢复快照时熔断已过期则不再给时间提示
  const fallbackFullText = fallback
    ? t("fallback.banner", { reason: t(`fallback.reason.${fallback.reason}` as I18nKey), count: fallback.count }) +
      (fallback.retryAt !== undefined && fallback.retryAt > Date.now()
        ? " " + t("fallback.retryIn", { min: Math.max(1, Math.ceil((fallback.retryAt - Date.now()) / 60_000)) })
        : "")
    : "";

  // SEO 内容页（/tld/:x、/guide/:x、/vs/:x、/prices 等）提前 return，mode 仍是 "home"，
  // 不应为纯阅读流量预取搜索 chunk；点 logo 回首页是整页导航，按需加载即可。
  const isSeoRoute = Boolean(guideTld || guideSlug || compareSlug || isPrices || isTldHub || isGuideHub || isCompareHub || isWhy || isMcp || isNotFound || shareId);
  useEffect(() => {
    if (mode === "home" && !isSeoRoute) prefetchSearchChunks();
  }, [mode, isSeoRoute]);

  useEffect(() => {
    // 只要有已落地（非 checking）的结果就覆盖快照，与所在页面/是否运行中无关：
    // 搜索每轮结果落地与最终完成都会写入，恢复条恢复的永远是最近一次搜索。
    if (rows.some((r) => r.status !== "checking")) {
      saveSearch({ values, rows, rounds, elapsedSec, aiUnderstanding, refinements, triedLabels: triedLabelsRef.current, locked: [...locked], fallback });
    }
  }, [rows, rounds, values, elapsedSec, aiUnderstanding, refinements, locked, fallback]);

  function handleEvent(ev: StreamEvent) {
    const round = (ev.round ?? 0) + roundOffsetRef.current;
    if (ev.type === "round") {
      setCurrentRound(round);
      setRounds((prev) =>
        prev.some((r) => r.round === round)
          ? prev
          : [...prev, { round, noteKey: ev.round === 1 ? "agent.note.first" : "agent.note.more", proposed: 0, checked: 0, available: 0 } as RoundInfo],
      );
    } else if (ev.type === "proposed") {
      const filtered = ev.guard ? Object.values(ev.guard.dropped).reduce((a, b) => a + b, 0) : 0;
      if (filtered > 0) {
        setRounds((rs) => rs.map((r) => (r.round === round ? { ...r, filtered: (r.filtered ?? 0) + filtered } : r)));
      }
      const newRows: Row[] = ev.items!.flatMap((it) =>
        ev.tlds!.map(
          (t): Row => ({
            domain: `${it.label}.${t}`,
            label: it.label,
            tld: t,
            status: "checking",
            meaning: it.meaning,
            theme: it.theme,
            scores: it.scores,
            round,
          }),
        ),
      );
      // 规则降级候选不代表 AI 已恢复，不清除首页的 AI 不可用标记
      if (ev.items!.length > 0 && !ev.items!.some((i) => i.theme === "rule")) clearAiQuotaDown();
      triedLabelsRef.current.push(...ev.items!.map((i) => i.label));
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.domain));
        const fresh = newRows.filter((r) => !seen.has(r.domain));
        setRounds((rs) => rs.map((r) => (r.round === round ? { ...r, proposed: r.proposed + fresh.length } : r)));
        return [...prev, ...fresh];
      });
    } else if (ev.type === "fallback") {
      const reason = ev.reason ?? "unknown";
      setFallback({
        reason,
        count: ev.count ?? 0,
        ...(typeof ev.retryAfterS === "number" ? { retryAt: Date.now() + ev.retryAfterS * 1000 } : {}),
      });
      setRounds((prev) => prev.map((r) => (r.round === (ev.round ?? 1) ? { ...r, noteKey: "agent.note.fallback" } : r)));
      if (reason === "quota" || reason === "quota-breaker") markAiQuotaDown();
    } else if (ev.type === "hint") {
      if (ev.kind === "lowYield") setLowYieldHint(true);
    } else if (ev.type === "understanding") {
      setAiUnderstanding({ core: ev.core ?? "", style: ev.style ?? "", scene: ev.scene ?? "" });
    } else if (ev.type === "done") {
      // no-op：running 状态在流结束时统一收尾
    } else if (ev.type === "error") {
      const kind = ev.errorKind ?? "unknown";
      setErrorKind(kind);
      if (kind === "quota") markAiQuotaDown();
      const autoRetry = kind === "rate-limit" && !autoRetriedRef.current && lastRunRef.current !== null;
      if (autoRetry) setAutoRetryLeft(AUTO_RETRY_SEC);
      setError({
        key:
          kind === "quota"
            ? "error.ai.quota"
            : kind === "rate-limit"
              ? autoRetry
                ? "error.ai.rateLimit"
                : "error.ai.rateLimitAgain"
              : kind === "upstream"
                ? "error.ai.upstream"
                : kind === "network"
                  ? "error.ai.network"
                  : "error.ai",
      });
    } else if (ev.domain) {
      const status = ev.status as Status;
      setLogs((prev) => [...prev.slice(-19), { domain: ev.domain!, status, cached: ev.cached }]);
      setRows((prev) => {
        const row = prev.find((r) => r.domain === ev.domain);
        if (!row) return prev;
        setRounds((rs) =>
          rs.map((r) =>
            r.round === row.round
              ? { ...r, checked: r.checked + 1, available: r.available + (status === "available" ? 1 : 0) }
              : r,
          ),
        );
        return prev.map((r) => (r.domain === ev.domain ? { ...r, status, meaning: r.meaning ?? ev.meaning, theme: r.theme ?? ev.theme, expiresAt: ev.expiresAt ?? r.expiresAt } : r));
      });
    }
  }

  async function run(v: HomeValues, opts: { more?: boolean; aroundLocked?: boolean; refinePrefs?: string[] } = {}, retry = false) {
    const { more = false, aroundLocked = false, refinePrefs = refinements } = opts;
    lastRunRef.current = { v, opts };
    if (!retry) autoRetriedRef.current = false;
    setAutoRetryLeft(null);
    setResumedNotice(false);
    setRestoredGuard(false);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    if (more) {
      roundOffsetRef.current = rounds.reduce((max, r) => Math.max(max, r.round), 0);
    } else {
      setRows([]);
      setRounds([]);
      setCurrentRound(0);
      setLocked(new Set());
      setAiUnderstanding(null);
      setRefinements([]);
      setDisliked(new Set());
      triedLabelsRef.current = [];
      roundOffsetRef.current = 0;
    }
    setLogs([]);
    setError(null);
    setErrorKind(null);
    setFallback(null);
    setLowYieldHint(false);
    setRunning(true);
    setMode("agent");
    startedAtRef.current = Date.now();
    try {
      if (isMockEnabled()) {
        await runMockStream(handleEvent, ac.signal);
        return;
      }
      let description = v.description;
      if (more && refinePrefs.length > 0) {
        description +=
          lang === "en"
            ? `\n\nStyle preferences: ${refinePrefs.join(", ")}. Please adjust the naming direction accordingly.`
            : `\n\n风格微调偏好：${refinePrefs.join("、")}。请按这些偏好调整命名方向。`;
      }
      if (more && disliked.size > 0) {
        const names = [...disliked].join(", ");
        description +=
          lang === "en"
            ? `\n\nI dislike these names and their style: ${names}. Avoid similar roots, word-building, and vibe.`
            : `\n\n我不喜欢这些名字及其风格：${names}。请避开类似的词根、构词方式与气质。`;
      }
      if (aroundLocked && locked.size > 0) {
        const names = [...locked].map((d) => d.split(".")[0]).join(", ");
        description +=
          lang === "en"
            ? `\n\nI especially like the style of these names: ${names}. Please riff on their roots, word-building, and vibe to explore similar new names.`
            : `\n\n我特别喜欢这些名字的风格：${names}。请围绕它们的词根、构词方式与气质再发散相似的新名字。`;
      }
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          tlds: v.tlds,
          style: v.style,
          lengthPref: v.lengthPref,
          lang,
          target: TARGET,
          excludeLabels: more ? triedLabelsRef.current : [],
          // 点踩候选带 theme 一起回传，worker 据此在 refine prompt 中生成风格规避提示
          disliked: more
            ? [...disliked].map((label) => ({ label, theme: rows.find((r) => r.label === label)?.theme }))
            : [],
          fast: !more, // 首轮快速模式：先出少量候选降低首字节时间
        }),
        signal: ac.signal,
      });
      if (!res.ok) {
        let spec = httpErrorSpec(res.status);
        try {
          const j = (await res.json()) as { message?: string };
          if (j.message) spec = { literal: j.message };
        } catch { /* 非 JSON 响应，用默认文案 */ }
        throw new UiErrorException(spec);
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop()!;
        for (const line of lines) {
          if (!line) continue;
          handleEvent(JSON.parse(line) as StreamEvent);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(errorSpec(e as Error));
    } finally {
      setRunning(false);
      setElapsedSec(Math.round((Date.now() - startedAtRef.current) / 1000));
      if (!ac.signal.aborted) setMode((m) => (m === "agent" ? "results" : m));
    }
  }

  // 手动「重试本轮」与自动重试共用：lastRunRef 只在 run() 内赋值，而 run() 一进入就解除 R465 恢复态护栏，
  // 所以到这里必然是用户已显式发起过一轮之后的续接，不会绕过 R463/R465 的两步确认。
  function retryLast() {
    const last = lastRunRef.current;
    if (!last) return;
    setError(null);
    setErrorKind(null);
    void run(last.v, last.opts, true);
  }

  function cancelAutoRetry() {
    autoRetriedRef.current = true;
    setAutoRetryLeft(null);
  }

  // 倒计时每秒递减；到 0 且页面在前台时发起自动重试，后台标签页等回到前台再发。
  useEffect(() => {
    if (autoRetryLeft === null) return;
    if (autoRetryLeft > 0) {
      const id = window.setTimeout(() => setAutoRetryLeft((n) => (n === null ? null : n - 1)), 1000);
      return () => window.clearTimeout(id);
    }
    const fire = () => {
      if (document.hidden) return;
      autoRetriedRef.current = true;
      retryLast();
    };
    fire();
    document.addEventListener("visibilitychange", fire);
    return () => document.removeEventListener("visibilitychange", fire);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRetryLeft]);

  // 离开结果/进行中页面即放弃自动重试，避免在首页或清单页被动切回 agent 视图
  useEffect(() => {
    if (mode !== "agent" && mode !== "results") setAutoRetryLeft(null);
  }, [mode]);

  function refine(pref: string) {
    const next = [...refinements, pref];
    setRefinements(next);
    void run(values, { more: true, refinePrefs: next });
  }

  function stop() {
    abortRef.current?.abort();
    setRunning(false);
    setElapsedSec(Math.round((Date.now() - startedAtRef.current) / 1000));
    setMode(rows.length > 0 ? "results" : "home");
  }

  const understanding = [
    t("understand.fallback", { desc: values.description }),
    values.style && `${t("agent.style")}${lang === "en" ? ": " : "："}${values.style}`,
    values.lengthPref && `${t("agent.length")}${lang === "en" ? ": " : "："}${values.lengthPref}`,
  ]
    .filter(Boolean)
    .join(" · ");

  if (isNotFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <NotFoundPage />
        </Suspense>
      </div>
    );
  }

  if (isTldHub || isGuideHub || isCompareHub) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          {isTldHub ? <TldHubPage /> : isGuideHub ? <GuideHubPage /> : <CompareHubPage />}
        </Suspense>
      </div>
    );
  }

  if (guideSlug) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <GuidePage slug={guideSlug} />
        </Suspense>
      </div>
    );
  }

  if (compareSlug) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <ComparePage slug={compareSlug} />
        </Suspense>
      </div>
    );
  }

  if (isWhy) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <WhyPage />
        </Suspense>
      </div>
    );
  }

  if (isMcp) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <McpPage />
        </Suspense>
      </div>
    );
  }

  if (isPrices) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <PricesPage />
        </Suspense>
      </div>
    );
  }

  if (guideTld) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <TldPage tld={guideTld} />
        </Suspense>
      </div>
    );
  }

  if (shareId) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header
          onLogoClick={() => window.location.assign("/")}
          shortlistCount={shortlist.items.length}
          onShortlistClick={() => window.location.assign("/")}
        />
        <Suspense fallback={<PageFallback />}>
          <SharePage id={shareId} />
        </Suspense>
      </div>
    );
  }

  const headerRight =
    mode === "home" ? (
      <button
        className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0 sm:h-9"
        onClick={openAdvanced}
        aria-label={t("header.advanced")}
        title={t("header.advanced")}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">{t("header.advanced")}</span>
      </button>
    ) : mode === "advanced" || mode === "shortlist" || mode === "monitors" ? (
      <button
        className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-txt1 hover:bg-bg2 hover:text-txt0"
        onClick={() => (mode === "shortlist" ? closeShortlist() : mode === "monitors" ? closeMonitors() : closeAdvanced())}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </button>
    ) : undefined;

  const headerCenter =
    mode === "agent" && running ? (
      <span className="mr-2 hidden items-center gap-1.5 text-xs text-txt1 md:flex">
        <span className="dot-breathe h-1.5 w-1.5 rounded-full bg-brand" />{t("header.running", { round: currentRound || 1 })}{" "}
        <b className="tnum font-mono text-txt0">{rows.filter((r) => r.status !== "checking").length}</b> {t("header.runningChecked")}{" "}
        <b className="tnum font-mono text-brand">{availableCount}</b> {t("header.runningUnit")}
      </span>
    ) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        center={headerCenter}
        right={headerRight}
        onLogoClick={() => {
          if (shortlistFromPath() || advancedFromPath() || monitorsFromPath()) window.history.replaceState(null, "", "/");
          setMode("home");
        }}
        shortlistCount={shortlist.items.length}
        shortlistActive={mode === "shortlist"}
        onShortlistClick={() => (mode === "shortlist" ? closeShortlist() : openShortlist())}
      />

      {/* header 下的横幅栈：错误横幅（destructive 色系）与 R471 将加入的 fallback 横幅（建议 brand/warning 色系）
          作为兄弟节点竖向堆叠，互不遮挡；R471 只需在此容器内追加一个 <div>。 */}
      {error && (
        <div className="mx-auto mt-4 w-full max-w-6xl space-y-3 px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5">
            <p className="text-sm text-destructive">
              {autoRetryLeft !== null && errorKind === "rate-limit" ? (
                <>
                  <span aria-hidden="true">{t("error.ai.rateLimitAuto", { n: autoRetryLeft })}</span>
                  {/* 读屏播报只在 30/20/10 三个刻度变化，避免每秒打断 */}
                  <span className="sr-only" aria-live="polite" aria-atomic="true">
                    {t("error.ai.autoRetryAria", { n: Math.max(10, Math.ceil(autoRetryLeft / 10) * 10) })}
                  </span>
                </>
              ) : (
                uiErrorText(error, t)
              )}
            </p>
            {quotaExhausted && (
              <span className="flex flex-wrap items-center gap-2 text-xs text-txt1">
                <a
                  href="/?mode=exact"
                  className="inline-flex min-h-[44px] items-center rounded-md border border-brand-line bg-bg1 px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-dim/60 sm:min-h-0 sm:py-1 sm:text-xs"
                >
                  {t("error.ai.quotaQuick")}
                </a>
                <a
                  href="/advanced"
                  className="inline-flex min-h-[44px] items-center rounded-md border border-brand-line bg-bg1 px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-dim/60 sm:min-h-0 sm:py-1 sm:text-xs"
                >
                  {t("error.ai.quotaBulk")}
                </a>
                {(
                  [
                    { href: "/tld", key: "error.ai.fallbackTld" },
                    { href: "/guide", key: "error.ai.fallbackGuide" },
                    { href: "/vs", key: "error.ai.fallbackVs" },
                  ] as const
                ).map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="hidden items-center rounded-md border border-line bg-bg1 px-2.5 py-1 font-medium text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:inline-flex"
                  >
                    {t(l.key)}
                  </a>
                ))}
              </span>
            )}
            {autoRetryLeft !== null && errorKind === "rate-limit" ? (
              <button
                type="button"
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-md border border-destructive/40 px-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 sm:min-h-0 sm:py-1.5"
                onClick={cancelAutoRetry}
              >
                {t("error.ai.autoRetryCancel")}
              </button>
            ) : (
              !running &&
              !quotaExhausted &&
              lastRunRef.current && (
                <button
                  type="button"
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-md border border-destructive/40 px-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 sm:min-h-0 sm:py-1.5"
                  onClick={retryLast}
                >
                  {t("error.retry")}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {fallback && (mode === "results" || mode === "agent") && (
        <div className="mx-auto mt-4 w-full max-w-6xl px-4 md:px-6">
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 sm:py-2.5"
          >
            {/* <640px 一行摘要 + 原生 details 展开全文，避免横幅把首张卡顶出首屏；桌面直接全文 */}
            <details className="min-w-0 flex-1 sm:hidden">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-sm text-txt0 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 truncate">
                  {t("fallback.bannerShort", { reason: t(`fallback.reason.${fallback.reason}` as I18nKey), count: fallback.count })}
                </span>
                <span aria-hidden="true" className="shrink-0 text-xs text-txt2">
                  ▾
                </span>
              </summary>
              <p className="pb-2 text-sm text-txt1">{fallbackFullText}</p>
            </details>
            <p className="hidden min-w-0 flex-1 text-sm text-txt0 sm:block">{fallbackFullText}</p>
            {!running && !quotaExhausted && lastRunRef.current && (
              <button
                type="button"
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-md border border-amber-500/40 px-3 text-sm font-semibold text-txt0 transition-colors hover:bg-amber-500/20 sm:min-h-0 sm:py-1.5"
                onClick={() => {
                  const last = lastRunRef.current!;
                  void run(last.v, last.opts);
                }}
              >
                {t("fallback.retryAi")}
              </button>
            )}
          </div>
        </div>
      )}

      {(mode === "agent" || mode === "results") && (
        <ContextSummary
          restored={resumedNotice && mode === "results"}
          understanding={aiUnderstanding}
          fallback={understanding}
          description={values.description}
          onRefine={refine}
          running={running}
          quotaExhausted={quotaExhausted}
          onNewSearch={() => {
            setResumedNotice(false);
            setNoticeClosing(false);
            setMode("home");
          }}
          onDismissRestored={dismissNotice}
        />
      )}

      {resumedNotice && mode === "results" && (
        <div
          className={`mx-auto hidden w-full max-w-6xl overflow-hidden px-4 transition-all duration-200 ease-out md:block md:px-6 ${noticeClosing ? "mt-0 max-h-0 opacity-0" : "mt-4 max-h-24"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-bg1 px-4 py-2 text-[13px] text-txt1">
            <span>{t("resume.notice")}</span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-txt1 transition-colors hover:border-brand-line hover:text-brand"
                onClick={() => {
                  setResumedNotice(false);
                  setNoticeClosing(false);
                  setMode("home");
                }}
              >
                {t("resume.newSearch")}
              </button>
              <button
                type="button"
                aria-label={t("resume.dismiss")}
                className="rounded-md px-2 py-1 text-xs text-txt2 transition-colors hover:text-txt0"
                onClick={dismissNotice}
              >
                ✕
              </button>
            </span>
          </div>
        </div>
      )}

      {(mode === "agent" || mode === "results") && (
        <div className={cn("hidden md:block", noticeClosing && "pointer-events-none")}>
          <UnderstandingBar
            understanding={aiUnderstanding}
            fallback={understanding}
            onRefine={refine}
            running={running}
            quotaExhausted={quotaExhausted}
          />
        </div>
      )}

      {mode === "home" && (
        <Suspense fallback={<PageFallback />}>
        <HomePageSlot
          initial={values}
          onSubmit={(v) => {
            setValues(v);
            void run(v);
          }}
          onBackToResults={rows.length > 0 ? () => setMode("results") : undefined}
          onOpenAdvanced={openAdvanced}
          shortlist={shortlist}
          quotaExhausted={quotaExhausted}
        />
        </Suspense>
      )}
      {mode === "agent" && (
        <Suspense fallback={<PageFallback />}>
        <AgentPage
          understanding={understanding}
          tlds={values.tlds}
          style={values.style}
          lengthPref={values.lengthPref}
          rows={rows}
          rounds={rounds}
          currentRound={currentRound}
          availableCount={availableCount}
          target={TARGET}
          running={running}
          logs={logs}
          lowYieldHint={lowYieldHint}
          onEdit={() => {
            abortRef.current?.abort();
            setRunning(false);
            setMode("home");
          }}
          onStop={stop}
          shortlistHas={shortlist.has}
          onToggleFavorite={shortlist.toggle}
        />
        </Suspense>
      )}
      {mode === "results" && (
        <Suspense fallback={<PageFallback />}>
        <ResultsPage
          rows={rows}
          description={values.description}
          tlds={values.tlds}
          style={values.style}
          lengthPref={values.lengthPref}
          roundCount={rounds.length}
          elapsedSec={elapsedSec}
          locked={locked}
          onToggleLock={toggleLock}
          shortlistHas={shortlist.has}
          onToggleFavorite={shortlist.toggle}
          onAddFavorites={shortlist.addMany}
          onMore={() => void run(values, { more: true })}
          onMoreAroundLocked={() => void run(values, { more: true, aroundLocked: true })}
          running={running}
          moreDisabled={!values.description.trim()}
          quotaExhausted={quotaExhausted}
          dislikedHas={(label) => disliked.has(label)}
          onToggleDislike={toggleDislike}
          restoredGuard={restoredGuard}
        />
        </Suspense>
      )}
      {mode === "shortlist" && (
        <Suspense fallback={<PageFallback />}>
          <ShortlistPage
            items={shortlist.items}
            onRemove={shortlist.remove}
            onClear={shortlist.clear}
            onStart={() => {
              if (shortlistFromPath()) window.history.replaceState(null, "", "/");
              setMode("home");
            }}
            onMerge={shortlist.merge}
            onSetNote={shortlist.setNote}
            lastCheckedAt={shortlist.lastCheckedAt}
            onApplyStatuses={shortlist.applyStatuses}
          />
        </Suspense>
      )}
      {mode === "advanced" && (
        <Suspense fallback={<PageFallback />}>
          <AdvancedPage shortlist={shortlist} />
        </Suspense>
      )}
      {mode === "monitors" && (
        <Suspense fallback={<PageFallback />}>
          <MonitorsPage
            onStart={() => {
              if (monitorsFromPath()) window.history.replaceState(null, "", "/shortlist");
              setMode("shortlist");
            }}
          />
        </Suspense>
      )}

      {(mode === "home" || mode === "results") && (
        <footer className="pb-8 text-center text-xs text-txt2">
          {/* TLD 指南页内链：SEO + 用户入口 */}
          <div className="mx-auto mb-5 max-w-3xl px-4">
            <p className="font-semibold text-txt1">{t("footer.tldGuides")}</p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-1 gap-y-0.5">
              <a className="inline-flex min-h-[44px] items-center px-2 text-brand hover:underline" href={`/tld?lang=${lang}`}>
                {t("footer.browseAll")}
              </a>
              {TLD_LIST.map((tld) => (
                <a key={tld} className="inline-flex min-h-[44px] items-center px-2 font-mono hover:text-brand hover:underline" href={`/tld/${tld}?lang=${lang}`}>
                  .{tld}
                </a>
              ))}
              <a className="inline-flex min-h-[44px] items-center px-2 hover:text-brand hover:underline" href={`/prices?lang=${lang}`}>
                {t("footer.prices")}
              </a>
              <a className="inline-flex min-h-[44px] items-center px-2 hover:text-brand hover:underline" href={`/why?lang=${lang}`}>
                {t("footer.why")}
              </a>
              <a className="inline-flex min-h-[44px] items-center px-2 hover:text-brand hover:underline" href={`/mcp?lang=${lang}`}>
                {t("footer.mcp")}
              </a>
              <a className="inline-flex min-h-[44px] items-center px-2 hover:text-brand hover:underline" href="/monitors">
                {t("footer.monitors")}
              </a>
            </div>
          </div>
          {/* 行业命名指南内链：SEO + 用户入口 */}
          <div className="mx-auto mb-5 max-w-3xl px-4">
            <p className="font-semibold text-txt1">{t("footer.industryGuides")}</p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-1 gap-y-0.5">
              <a className="inline-flex min-h-[44px] items-center px-2 text-brand hover:underline" href={`/guide?lang=${lang}`}>
                {t("footer.browseAll")}
              </a>
              {GUIDE_LABELS.map((g) => (
                <a key={g.slug} className="inline-flex min-h-[44px] items-center px-2 hover:text-brand hover:underline" href={`/guide/${g.slug}?lang=${lang}`}>
                  {g[lang]}
                </a>
              ))}
            </div>
          </div>
          {/* TLD 对比页内链：SEO + 用户入口 */}
          <div className="mx-auto mb-5 max-w-3xl px-4">
            <p className="font-semibold text-txt1">{t("footer.compares")}</p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-1 gap-y-0.5">
              <a className="inline-flex min-h-[44px] items-center px-2 text-brand hover:underline" href={`/vs?lang=${lang}`}>
                {t("footer.browseAll")}
              </a>
              {COMPARE_SLUGS.map((slug) => (
                <a key={slug} className="inline-flex min-h-[44px] items-center px-2 font-mono hover:text-brand hover:underline" href={`/vs/${slug}?lang=${lang}`}>
                  {compareLabel(slug)}
                </a>
              ))}
            </div>
          </div>
          open-core · MIT ·{" "}
          <a className="underline hover:text-txt1" href="https://github.com/wookat/domainhunter">
            GitHub
          </a>
          {hasAnalytics && <p className="mx-auto mt-3 max-w-md px-4 leading-relaxed">{t("footer.analyticsNotice")}</p>}
        </footer>
      )}
    </div>
  );
}
