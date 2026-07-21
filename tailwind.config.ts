import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        gray: {
          50: "rgb(var(--c-g50) / <alpha-value>)",
          100: "rgb(var(--c-g100) / <alpha-value>)",
          200: "rgb(var(--c-g200) / <alpha-value>)",
          300: "rgb(var(--c-g300) / <alpha-value>)",
          400: "rgb(var(--c-g400) / <alpha-value>)",
          500: "rgb(var(--c-g500) / <alpha-value>)",
          600: "rgb(var(--c-g600) / <alpha-value>)",
          700: "rgb(var(--c-g700) / <alpha-value>)",
          800: "rgb(var(--c-g800) / <alpha-value>)",
          900: "rgb(var(--c-g900) / <alpha-value>)",
          950: "rgb(var(--c-g950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        pixel: [
          "Geist Pixel",
          "var(--font-geist-mono)",
          "ui-monospace",
          "monospace",
        ],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 8px 22px -14px rgb(0 0 0 / 0.25)",
        "card-hover": "0 18px 36px -20px rgb(0 0 0 / 0.4)",
        modal: "0 40px 90px -20px rgb(0 0 0 / 0.35)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        measure: "42rem",
        wide: "56rem",
      },
    },
  },
  plugins: [],
};

export default config;
