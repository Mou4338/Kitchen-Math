import type { Config } from "tailwindcss";

/** Every colour is a CSS variable (see app/globals.css), so the light (white & blue) and dark (black & gold) themes swap automatically. */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        paper: v("paper"),
        card: v("card"),
        ink: { DEFAULT: v("ink"), soft: v("ink-soft") },
        muted: { DEFAULT: v("muted"), light: v("muted-light") },
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        wash: v("wash"),
        accent: { DEFAULT: v("accent"), dark: v("accent-dark"), soft: v("accent-soft"), ink: v("accent-ink"), bright: v("accent-bright") },
        inverse: v("inverse"),
        "on-inverse": v("on-inverse"),
        sage: { DEFAULT: v("sage"), dark: v("sage-dark"), soft: v("sage-soft") },
        caution: { DEFAULT: v("caution"), soft: v("caution-soft") },
        danger: { DEFAULT: v("danger"), soft: v("danger-soft") },
        chart: { 1: v("chart-1"), 2: v("chart-2"), 3: v("chart-3"), 4: v("chart-4"), 5: v("chart-5"), 6: v("chart-6") },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: { xl: "14px", "2xl": "18px", "3xl": "26px" },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: { "fade-in": "fade-in .25s ease-out both", float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [],
};

export default config;
