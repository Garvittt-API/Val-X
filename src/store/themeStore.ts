import { create } from "zustand";

export interface Theme {
  id: string;
  name: string;
  accent: string;
  gradient: string;
  bg: string;
}

const themes: Theme[] = [
  { id: "default", name: "Default", accent: "#4a9eff", gradient: "from-blue-500/20 to-purple-500/20", bg: "#0a0a0f" },
  { id: "radiant", name: "Radiant", accent: "#ffbd44", gradient: "from-yellow-500/20 to-orange-500/20", bg: "#0a0a0f" },
  { id: "icebox", name: "Icebox", accent: "#00d4ff", gradient: "from-cyan-500/20 to-blue-500/20", bg: "#0a0a0f" },
  { id: "lotus", name: "Lotus", accent: "#ff4655", gradient: "from-red-500/20 to-pink-500/20", bg: "#0a0a0f" },
  { id: "reaver", name: "Reaver", accent: "#bd00ff", gradient: "from-purple-500/20 to-violet-500/20", bg: "#0a0a0f" },
  { id: "prime", name: "Prime", accent: "#00ff88", gradient: "from-green-500/20 to-emerald-500/20", bg: "#0a0a0f" },
  { id: "glitchpop", name: "Glitchpop", accent: "#ff6b9d", gradient: "from-pink-500/20 to-rose-500/20", bg: "#0a0a0f" },
  { id: "sovereign", name: "Sovereign", accent: "#00b8a9", gradient: "from-teal-500/20 to-cyan-500/20", bg: "#0a0a0f" },
  { id: "elderflame", name: "ElderFlame", accent: "#ff6600", gradient: "from-orange-500/20 to-red-500/20", bg: "#0a0a0f" },
];

interface ThemeStore {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (id: string) => void;
  customWallpaper: string | null;
  setCustomWallpaper: (url: string | null) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: themes[0],
  themes,
  setTheme: (id) =>
    set((s) => ({
      currentTheme: s.themes.find((t) => t.id === id) || s.currentTheme,
    })),
  customWallpaper: null,
  setCustomWallpaper: (url) => set({ customWallpaper: url }),
}));
