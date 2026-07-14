import { create } from "zustand";
import type { MatchView, MatchState } from "../types";

interface MatchStore {
  view: MatchView;
  setView: (view: MatchView) => void;
  overlayVisible: boolean;
  toggleOverlay: () => void;
}

const defaultView: MatchView = {
  state: "NoGame",
  mode: "",
  activity: "Idle",
  players: [],
  me: null,
  history: [],
  stale: false,
  phaseTime: 0,
  map: "",
  mapImage: "",
  allyScore: 0,
  enemyScore: 0,
  combatLoading: false,
  historyQueue: 0,
};

export const useMatchStore = create<MatchStore>((set) => ({
  view: defaultView,
  setView: (view) => set({ view }),
  overlayVisible: false,
  toggleOverlay: () => set((s) => ({ overlayVisible: !s.overlayVisible })),
}));
