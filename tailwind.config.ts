import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0E14",
        surface: {
          DEFAULT: "#11161F",
          muted: "#161C26",
          elevated: "#1B2230",
        },
        line: "rgba(255,255,255,0.08)",
        pitch: {
          DEFAULT: "#00E676",
          dark: "#00C853",
          soft: "rgba(0,230,118,0.12)",
        },
        gold: "#FFD24A",
        live: "#FF4D4D",
        foreground: "#E6EDF3",
        muted: "#8A93A2",
      },
      fontFamily: {
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        glow: "0 0 28px rgba(0,230,118,0.30)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(1.18)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.6s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
