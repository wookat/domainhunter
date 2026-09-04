import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./lib/i18n";
import "./index.css";

// 内容页（/tld /guide /vs）已全文 SSR：等路由 chunk 就绪后再挂载 React，
// 避免懒路由 Suspense 先清空 SSR 正文出现白屏/跳变（水合是一次性等量替换）。
function routeModule(): Promise<unknown> | null {
  const p = window.location.pathname;
  if (/^\/tld\/[a-z0-9-]{2,24}$/i.test(p)) return Promise.all([import("./components/tld-page"), ensureInjectedContent("tld", p.slice(5))]);
  if (/^\/guide\/[a-z0-9-]{2,24}$/i.test(p)) return Promise.all([import("./components/guide-page"), ensureInjectedContent("guide", p.slice(7))]);
  if (/^\/vs\/[a-z0-9-]{2,48}$/i.test(p)) return Promise.all([import("./components/compare-page"), ensureInjectedContent("vs", p.slice(4))]);
  if (p === "/") return import("./components/home-page-loader").then((m) => m.loadHomePage());
  return null;
}

// 页面数据随 HTML 注入（window.__DH_CONTENT__，见 content/injected.ts）；
// 注入缺失（如异常缓存的旧 HTML）时动态加载全量内容模块兜底构建，保证渲染一致
async function ensureInjectedContent(kind: "tld" | "guide" | "vs", key: string): Promise<void> {
  const k = key.toLowerCase();
  const data = window.__DH_CONTENT__;
  if (data && data.kind === kind && (data.kind === "tld" ? data.tld : data.slug) === k) return;
  const m = await import("./content/injected-build");
  window.__DH_CONTENT__ = kind === "tld" ? m.buildTldContent(k) : kind === "guide" ? m.buildGuideContent(k) : m.buildVsContent(k);
}

function mount() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>,
  );
}

const pending = routeModule();
if (pending) void pending.catch(() => undefined).then(mount);
else mount();
