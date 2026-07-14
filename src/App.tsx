import { useEffect } from "react";
import { useMatchStore } from "./store/matchStore";
import { useSettingsStore } from "./store/settingsStore";
import Sidebar from "./components/layout/Sidebar";
import TitleBar from "./components/layout/TitleBar";
import Dashboard from "./components/dashboard/Dashboard";
import AgentSelect from "./components/match/AgentSelect";
import LiveMatch from "./components/match/LiveMatch";
import PlayerSearch from "./components/search/PlayerSearch";
import MatchHistory from "./components/history/MatchHistory";
import { Box } from "lucide-react";
import type { MatchView } from "./types";

function App() {
  const setView = useMatchStore((s) => s.setView);
  const currentView = useSettingsStore((s) => s.currentView);
  const view = useMatchStore((s) => s.view);

  useEffect(() => {
    // Listen for match view events from Tauri backend
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

  const renderView = () => {
    // Auto-switch to match view when in a game
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
      case "overlay":
        return <OverlaySettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function OverlaySettings() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-white tracking-tight">Overlay Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure the in-game overlay appearance and position</p>
      </div>
      <div className="card-3d-inner p-8 text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/10 mb-6 shadow-glow-purple">
          <Box size={24} className="text-accent-purple/60" />
        </div>
        <h2 className="text-lg font-semibold text-white/50 mb-2">Configure Overlay</h2>
        <p className="text-white/25 text-sm max-w-xs mx-auto">
          Customize the in-game overlay appearance, position, and transparency
        </p>
      </div>
    </div>
  );
}

export default App;
