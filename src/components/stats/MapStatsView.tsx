import { useState, useEffect } from "react";
import type { MapStats } from "../../types";

function invokeCmd(cmd: string) {
  return (window as any).__TAURI__?.core?.invoke?.(cmd);
}

export default function MapStatsView() {
  const [stats, setStats] = useState<MapStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invokeCmd("get_map_stats")
      .then((data: MapStats[]) => setStats(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">MAP_PERFORMANCE</span>
        <span className="micro-label">{stats.length} MAPS</span>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="text-[10px] font-mono text-white/30 animate-pulse">LOADING MAP DATA...</div>
        </div>
      ) : stats.length === 0 ? (
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">MAPS</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO MAP DATA</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Play matches to see map performance stats</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
          {stats.map((map, i) => (
            <div
              key={map.mapName}
              className="bg-bg-primary p-4 hover:bg-bg-elevated transition-colors fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">{map.mapName}</span>
                <span className="text-[10px] font-mono text-white/25">{map.games} GAMES</span>
              </div>

              {/* Win rate bar */}
              <div className="h-1.5 bg-white/[0.05] mb-3 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${map.winRate}%`,
                    background: map.winRate >= 50 ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="micro-label mb-0.5">WIN%</div>
                  <div className={`text-xs font-mono ${map.winRate >= 50 ? "text-neon" : "text-err"}`}>
                    {map.winRate}%
                  </div>
                </div>
                <div>
                  <div className="micro-label mb-0.5">K/D/A</div>
                  <div className="text-xs font-mono text-white/50">
                    {map.kills}/{map.deaths}/{map.assists}
                  </div>
                </div>
                <div>
                  <div className="micro-label mb-0.5">WINS</div>
                  <div className="text-xs font-mono text-white/50">{map.wins}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
