import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./lib/i18n";
import "./index.css";

// 内容页（/tld /guide /vs）已全文 SSR：等路由 chunk 就绪后再挂载 React，
// 避免懒路由 Suspense 先清空 SSR 正文出现白屏/跳变（水合是一次性等量替换）。
function routeModule(): Promise<unknown> | null {
  const p = window.location.pathname;
  if (/^\/tld\/[a-z0-9-]{2,24}$/i.test(p)) return import("./components/tld-page");
  if (/^\/guide\/[a-z0-9-]{2,24}$/i.test(p)) return import("./components/guide-page");
  if (/^\/vs\/[a-z0-9-]{2,48}$/i.test(p)) return import("./components/compare-page");
  return null;
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
