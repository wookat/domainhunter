/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Inter Fallback", "PingFang SC", "Noto Sans SC", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        bg2: "var(--bg-2)",
        bg3: "var(--bg-3)",
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        txt0: "var(--txt-0)",
        txt1: "var(--txt-1)",
        txt2: "var(--txt-2)",
        brand: {
          DEFAULT: "var(--brand)",
          strong: "var(--brand-strong)",
          ink: "var(--brand-ink)",
          dim: "var(--brand-dim)",
          line: "var(--brand-line)",
        },
        amber2: {
          DEFAULT: "var(--amber)",
          dim: "var(--amber-dim)",
        },
        taken: {
          DEFAULT: "var(--taken)",
          dim: "var(--taken-dim)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          dim: "var(--gold-dim)",
        },
      },
      borderRadius: {
        lg: "calc(var(--radius) - 0.25rem)",
        xl: "var(--radius)",
      },
    },
  },
  plugins: [animate],
};
