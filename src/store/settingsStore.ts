import { create } from "zustand";
import type { NavView } from "../types";

interface SettingsStore {
  currentView: NavView;
  setView: (view: NavView) => void;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  overlayPosition: "top" | "bottom" | "left" | "right";
  setOverlayPosition: (pos: "top" | "bottom" | "left" | "right") => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  currentView: "dashboard",
  setView: (view) => set({ currentView: view }),
  overlayOpacity: 90,
  setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity }),
  overlayPosition: "top",
  setOverlayPosition: (pos) => set({ overlayPosition: pos }),
}));
