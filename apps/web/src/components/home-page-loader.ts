import type { HomePage } from "@/components/home-page";

// 首页组件懒加载注册表：main.tsx 在 "/" 挂载前预载，App 里已加载时同步渲染（零 Suspense 回退、零布局跳变）
let loaded: typeof HomePage | null = null;

export function loadHomePage(): Promise<typeof import("@/components/home-page")> {
  return import("@/components/home-page").then((m) => {
    loaded = m.HomePage;
    return m;
  });
}

export const getHomePage = (): typeof HomePage | null => loaded;
