import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "domainhunter:theme";

export type Theme = "dark" | "light";

function loadTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return [theme, toggle];
}
