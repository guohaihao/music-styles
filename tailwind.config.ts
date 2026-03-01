import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        surface: "var(--color-surface)",
        "surface-strong": "var(--color-surface-strong)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      }
    }
  },
  plugins: []
};

export default config;
