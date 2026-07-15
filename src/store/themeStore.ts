import { create } from "zustand";

export interface Theme {
  id: string;
  name: string;
  accent: string;
  accentRgb: string;
  bg: string;
}

const themes: Theme[] = [
  { id: "default", name: "VALX Green", accent: "#2BFF57", accentRgb: "43,255,87", bg: "#050505" },
  { id: "blue", name: "Neon Blue", accent: "#4a9eff", accentRgb: "74,158,255", bg: "#050505" },
  { id: "cyan", name: "Icebox Cyan", accent: "#00d4ff", accentRgb: "0,212,255", bg: "#050505" },
  { id: "red", name: "Lotus Red", accent: "#ff4655", accentRgb: "255,70,85", bg: "#050505" },
  { id: "purple", name: "Reaver Purple", accent: "#bd00ff", accentRgb: "189,0,255", bg: "#050505" },
  { id: "gold", name: "Radiant Gold", accent: "#ffbd44", accentRgb: "255,189,68", bg: "#050505" },
  { id: "pink", name: "Glitchpop Pink", accent: "#ff6b9d", accentRgb: "255,107,157", bg: "#050505" },
  { id: "teal", name: "Sovereign Teal", accent: "#00b8a9", accentRgb: "0,184,169", bg: "#050505" },
  { id: "orange", name: "ElderFlame Orange", accent: "#ff6600", accentRgb: "255,102,0", bg: "#050505" },
];

interface ThemeStore {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: themes[0],
  themes,
  setTheme: (id) =>
    set((s) => ({
      currentTheme: s.themes.find((t) => t.id === id) || s.currentTheme,
    })),
}));
