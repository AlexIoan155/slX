import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0C10",
          soft: "#0D1015",
        },
        surface: {
          DEFAULT: "#12151C",
          elevated: "#191D25",
          border: "#242933",
        },
        ink: {
          DEFAULT: "#F5F6F8",
          muted: "#9098A6",
          faint: "#5C6472",
        },
        risk: {
          low: "#34D399",
          moderate: "#FFB020",
          high: "#FF7A3D",
          critical: "#FF4136",
        },
        shield: {
          from: "#22D3EE",
          to: "#34D399",
        },
        alert: {
          from: "#FF5A36",
          to: "#FFB020",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "glow-alert": "radial-gradient(circle, rgba(255,90,54,0.35) 0%, rgba(255,90,54,0) 70%)",
        "glow-shield": "radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(34,211,238,0) 70%)",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
        glow: "0 0 40px -8px rgba(255,122,61,0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
