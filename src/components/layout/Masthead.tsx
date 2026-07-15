import { useSettingsStore } from "../../store/settingsStore";
import { useMatchStore } from "../../store/matchStore";
import { Minus, Square, X, LayoutDashboard, Users, Search, History, Palette, Crosshair, BarChart3, Map, TrendingUp, Swords, Trophy, Target } from "lucide-react";
import type { NavView } from "../../types";

interface Props {
  cursorPos: { x: number; y: number };
}

const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "DASHBOARD", icon: <LayoutDashboard size={14} /> },
  { id: "match", label: "LIVE MATCH", icon: <Users size={14} /> },
  { id: "search", label: "SEARCH", icon: <Search size={14} /> },
  { id: "history", label: "HISTORY", icon: <History size={14} /> },
  { id: "agent_stats", label: "AGENTS", icon: <BarChart3 size={14} /> },
  { id: "map_stats", label: "MAPS", icon: <Map size={14} /> },
  { id: "weapon_stats", label: "WEAPONS", icon: <Swords size={14} /> },
  { id: "trends", label: "TRENDS", icon: <TrendingUp size={14} /> },
  { id: "leaderboard", label: "LEADERBOARD", icon: <Trophy size={14} /> },
  { id: "crosshairs", label: "CROSSHAIRS", icon: <Target size={14} /> },
  { id: "loadout", label: "LOADOUT", icon: <Crosshair size={14} /> },
  { id: "themes", label: "THEMES", icon: <Palette size={14} /> },
];

function invokeCmd(cmd: string, args?: Record<string, unknown>) {
  return (window as any).__TAURI__?.core?.invoke?.(cmd, args);
}

export default function Masthead({ cursorPos }: Props) {
  const currentView = useSettingsStore((s) => s.currentView);
  const setView = useSettingsStore((s) => s.setView);
  const view = useMatchStore((s) => s.view);

  const handleMinimize = () => invokeCmd("window_minimize");
  const handleMaximize = () => invokeCmd("window_toggle_maximize");
  const handleClose = () => invokeCmd("window_close");

  const isConnected = view.state !== "NoGame";

  return (
    <header
      className="relative border-b border-white/[0.12] bg-bg-primary shrink-0 overflow-hidden"
      style={{ minHeight: "64px" }}
    >
      {/* Top utility bar */}
      <div className="flex items-center justify-between px-5 h-8 border-b border-white/[0.12]">
        <div className="flex items-center gap-2">
          <div className={`status-dot ${!isConnected ? "status-dot--err" : ""}`} />
          <span className="micro-label">
            {isConnected ? "CLIENT CONNECTED" : "CLIENT DISCONNECTED"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/[0.05] transition-colors"
          >
            <Minus size={12} className="text-white/40" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/[0.05] transition-colors"
          >
            <Square size={10} className="text-white/40" />
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-err/20 transition-colors"
          >
            <X size={12} className="text-white/40 hover:text-err" />
          </button>
        </div>
      </div>

      {/* Main masthead */}
      <div
        className="flex items-center justify-between px-5 h-9"
        data-tauri-drag-region
      >
        {/* Wordmark with spotlight mask */}
        <h1
          className="display-text text-[5vw] font-thin text-white/[0.1] select-none spotlight-mask leading-none tracking-tight"
          style={{
            "--mx": `${cursorPos.x}px`,
            "--my": `${cursorPos.y}px`,
            fontStretch: "125%",
          } as React.CSSProperties}
        >
          VALX CONTROL
        </h1>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                currentView === item.id
                  ? "text-neon"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
