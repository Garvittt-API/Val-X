import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#06060c",
          secondary: "#0c0c14",
          card: "rgba(16, 16, 28, 0.6)",
          hover: "rgba(30, 30, 42, 0.8)",
        },
        accent: {
          blue: "#4a9eff",
          cyan: "#00d4ff",
          red: "#ff4655",
          gold: "#ffbd44",
          green: "#00ff88",
          purple: "#bd00ff",
        },
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
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(74, 158, 255, 0.4), 0 0 60px rgba(74, 158, 255, 0.1)",
        "glow-blue-lg": "0 0 30px rgba(74, 158, 255, 0.5), 0 0 80px rgba(74, 158, 255, 0.2)",
        "glow-red": "0 0 20px rgba(255, 70, 85, 0.4), 0 0 60px rgba(255, 70, 85, 0.1)",
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.1)",
        "glow-gold": "0 0 20px rgba(255, 189, 68, 0.4), 0 0 60px rgba(255, 189, 68, 0.1)",
        "glow-purple": "0 0 20px rgba(189, 0, 255, 0.4), 0 0 60px rgba(189, 0, 255, 0.1)",
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.1)",
        "depth-sm": "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        "depth-md": "0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        "depth-lg": "0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)",
        "depth-xl": "0 16px 48px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.5)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
