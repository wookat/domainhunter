import { useCallback, useEffect, useState } from "react";

const DENSITY_KEY = "dh:density:v1";
/** 紧凑模式只在桌面生效；窄屏保持舒适模式以守住 44px 触点 */
const DESKTOP_QUERY = "(min-width: 768px)";

export type Density = "comfortable" | "compact";

function loadDensity(): Density {
  try {
    return localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "comfortable";
  } catch {
    return "comfortable";
  }
}

function isDesktop(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DESKTOP_QUERY).matches;
}

export function useDensity(): { density: Density; setDensity: (d: Density) => void; compact: boolean } {
  const [density, setDensityState] = useState<Density>(loadDensity);
  const [desktop, setDesktop] = useState(isDesktop);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(DENSITY_KEY, d);
    } catch {
      // ignore
    }
  }, []);

  return { density, setDensity, compact: density === "compact" && desktop };
}
