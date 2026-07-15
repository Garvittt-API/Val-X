import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0c0c0f",
          elevated: "#121216",
          surface: "#1a1a1f",
          hover: "rgba(255, 255, 255, 0.05)",
        },
        neon: "#2BFF57",
        err: "#EF4444",
        warn: "#F97316",
        rank: {
          iron: "#68707a",
          bronze: "#cd7f4e",
          silver: "#8c9bb0",
          gold: "#c9a738",
          platinum: "#00b8a9",
          diamond: "#4a6bff",
          ascendant: "#00c853",
          immortal: "#ff4655",
          radiant: "#ffbd44",
        },
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-neon": "0 0 12px rgba(43, 255, 87, 0.6)",
        "glow-err": "0 0 12px rgba(239, 68, 68, 0.5)",
        "glow-warn": "0 0 12px rgba(249, 115, 22, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "fade-in": "fade-in 0.3s ease-out",
        ticker: "ticker 40s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
