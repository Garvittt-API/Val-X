import { useEffect, useState, useCallback } from "react";
import { useMatchStore } from "./store/matchStore";
import { useSettingsStore } from "./store/settingsStore";
import { useThemeStore } from "./store/themeStore";
import Masthead from "./components/layout/Masthead";
import Ticker from "./components/layout/Ticker";
import KpiGrid from "./components/layout/KpiGrid";
import Dashboard from "./components/dashboard/Dashboard";
import AgentSelect from "./components/match/AgentSelect";
import LiveMatch from "./components/match/LiveMatch";
import PlayerSearch from "./components/search/PlayerSearch";
import MatchHistory from "./components/history/MatchHistory";
import ThemesView from "./components/themes/ThemesView";
import LoadoutView from "./components/loadout/LoadoutView";
import AgentStatsView from "./components/stats/AgentStatsView";
import MapStatsView from "./components/stats/MapStatsView";
import TrendsView from "./components/stats/TrendsView";
import IntelligenceRail from "./components/layout/IntelligenceRail";
import type { MatchView } from "./types";

function App() {
  const setView = useMatchStore((s) => s.setView);
  const currentView = useSettingsStore((s) => s.currentView);
  const view = useMatchStore((s) => s.view);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unlisten = (window as any).__TAURI__?.event?.listen?.(
      "match-view",
      (event: { payload: MatchView }) => {
        setView(event.payload);
      }
    );
    return () => {
      unlisten?.then?.((fn: () => void) => fn());
    };
  }, [setView]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const renderMainContent = () => {
    if (view.state === "PreGame" && currentView === "dashboard") {
      return <AgentSelect />;
    }
    if (view.state === "CoreGame" && currentView === "dashboard") {
      return <LiveMatch />;
    }
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "match":
        return view.state === "PreGame" ? <AgentSelect /> : <LiveMatch />;
      case "search":
        return <PlayerSearch />;
      case "history":
        return <MatchHistory />;
      case "themes":
        return <ThemesView />;
      case "loadout":
        return <LoadoutView />;
      case "agent_stats":
        return <AgentStatsView />;
      case "map_stats":
        return <MapStatsView />;
      case "trends":
        return <TrendsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: currentTheme.bg,
        "--theme-accent": currentTheme.accent,
        "--theme-accent-rgb": currentTheme.accentRgb,
      } as React.CSSProperties}
    >
      <Masthead cursorPos={cursorPos} />
      <Ticker />
      <KpiGrid />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
        <IntelligenceRail />
      </div>
      <footer className="min-h-[20px] bg-bg-primary border-t border-white/[0.12] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="status-dot" style={{ background: currentTheme.accent }} />
          <span className="micro-label">SESSION ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="micro-label">CLIENT DISCONNECTED</span>
          <span className="micro-label">REFRESH: 3S</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
