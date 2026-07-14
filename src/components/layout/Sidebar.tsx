import {
  LayoutDashboard,
  Users,
  Search,
  History,
  Palette,
  MessageSquare,
  Box,
  Settings,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { NavView } from "../../types";
import clsx from "clsx";

const navItems: { id: NavView; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "match", icon: Users, label: "Live Match" },
  { id: "overlay", icon: Box, label: "Overlay" },
  { id: "search", icon: Search, label: "Player Search" },
  { id: "history", icon: History, label: "Match History" },
  { id: "loadout", icon: Palette, label: "Loadout" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "themes", icon: Settings, label: "Themes" },
];

export default function Sidebar() {
  const currentView = useSettingsStore((s) => s.currentView);
  const setView = useSettingsStore((s) => s.setView);

  return (
    <aside className="w-[72px] glass-strong border-r border-white/5 flex flex-col items-center py-4 gap-2 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-blue/5 rounded-full blur-2xl pointer-events-none" />

      {navItems.map(({ id, icon: Icon, label }) => {
        const isActive = currentView === id;
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            title={label}
            className={clsx(
              "relative w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-300 group",
              isActive
                ? "text-accent-blue"
                : "text-white/30 hover:text-white/70"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-accent-blue/10 border border-accent-blue/20 shadow-glow-blue" />
            )}

            {/* Hover effect */}
            {!isActive && (
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}

            <Icon size={20} className="relative z-10" />
            <span className="text-[9px] mt-1 font-medium relative z-10 opacity-70">
              {label.split(" ")[0]}
            </span>

            {/* Active dot */}
            {isActive && (
              <div className="absolute -right-px top-1/2 -translate-y-1/2 w-[2px] h-6 bg-accent-blue rounded-full shadow-glow-blue" />
            )}
          </button>
        );
      })}
    </aside>
  );
}
