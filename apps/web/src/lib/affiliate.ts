/**
 * 前端侧返佣配置与外链点击计数（R480）。
 * 配置来自 GET /api/registrars（Worker 把 wrangler var REGISTRAR_AFFILIATE_JSON 解析后原样下发，公开非 secret）；
 * 拉取前 / 拉取失败 → 空配置，所有链接即纯搜索链接，与 R480 之前完全一致。
 */
import { useSyncExternalStore } from "react";

import { hasActiveAffiliate, isRegistrarId, parseAffiliateConfig, type AffiliateConfig, type RegistrarId } from "@/lib/registrars";

declare global {
  interface Window {
    /** 可选 SSR 注入（与 /api/registrars 同结构）；存在时省一次请求 */
    __DH_REGISTRARS__?: { affiliate?: unknown } | null;
  }
}

const EMPTY: AffiliateConfig = {};
let config: AffiliateConfig = EMPTY;
let loaded = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setConfig(next: AffiliateConfig) {
  config = next;
  loaded = true;
  for (const l of listeners) l();
}

function load(): Promise<void> {
  if (loaded) return Promise.resolve();
  if (loading) return loading;
  const injected = typeof window !== "undefined" ? window.__DH_REGISTRARS__ : undefined;
  if (injected && typeof injected === "object") {
    setConfig(parseAffiliateConfig(injected.affiliate));
    return Promise.resolve();
  }
  loading = fetch("/api/registrars", { headers: { accept: "application/json" } })
    .then(async (r) => (r.ok ? ((await r.json()) as { affiliate?: unknown }) : null))
    .then((body) => setConfig(parseAffiliateConfig(body?.affiliate)))
    .catch(() => setConfig(EMPTY))
    .finally(() => {
      loading = null;
    });
  return loading;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  void load();
  return () => {
    listeners.delete(cb);
  };
}

/** 当前返佣配置（首帧为空对象，拉取完成后触发一次重渲染） */
export function useAffiliateConfig(): AffiliateConfig {
  return useSyncExternalStore(subscribe, () => config, () => EMPTY);
}

/** 是否需要展示页脚返佣声明 */
export function useAffiliateActive(): boolean {
  return hasActiveAffiliate(useAffiliateConfig());
}

/** 仅测试用：重置模块状态 */
export function resetAffiliateStoreForTests(): void {
  config = EMPTY;
  loaded = false;
  loading = null;
}

/**
 * 轻量 outbound 点击计数：POST /api/click {registrar, tld}。
 * 不含域名明文、不含任何个人信息；失败静默。sendBeacon 保证新开窗口时请求不被丢弃。
 */
export function trackOutbound(registrar: RegistrarId, tld: string): void {
  if (!isRegistrarId(registrar) || typeof window === "undefined") return;
  const body = JSON.stringify({ registrar, tld: tld.toLowerCase().replace(/^\./, "") });
  try {
    if (typeof navigator.sendBeacon === "function") {
      if (navigator.sendBeacon("/api/click", new Blob([body], { type: "application/json" }))) return;
    }
    void fetch("/api/click", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => undefined);
  } catch { /* 计数失败不影响跳转 */ }
}
