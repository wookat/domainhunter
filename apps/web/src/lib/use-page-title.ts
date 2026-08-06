import { useEffect } from "react";

/** SEO 页水合/切语言后同步 document.title（SSR title 按 accept-language 渲染，可能与本地语言偏好不一致） */
export function usePageTitle(title: string | undefined): void {
  useEffect(() => {
    if (title) document.title = `${title} | DomainHunter`;
  }, [title]);
}
