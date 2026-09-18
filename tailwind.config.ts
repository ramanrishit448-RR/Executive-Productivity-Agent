import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neu: {
          base: "var(--color-neu-bg)",
          dark: "var(--color-neu-dark)",
          light: "var(--color-neu-light)"
        },
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)"
        },
        accent: {
          dark: "var(--color-accent-dark)",
          light: "var(--color-accent-light)"
        },
        vivid: { green: "var(--color-green-success)" },
        tangerine: "var(--color-red-danger)" /* repurpose for warning/red */
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        tags: "9999px",
        cards: "24px",
        inputs: "12px",
        buttons: "12px",
      },
      boxShadow: {
        'neu-flat': 'var(--shadow-neu-flat)',
        'neu-flat-sm': 'var(--shadow-neu-flat-sm)',
        'neu-pressed': 'var(--shadow-neu-pressed)',
        'neu-float': 'var(--shadow-soft-float)',
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
