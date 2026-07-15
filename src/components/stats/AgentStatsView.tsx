import { useState, useEffect } from "react";
import type { AgentStats } from "../../types";

function invokeCmd(cmd: string) {
  return (window as any).__TAURI__?.core?.invoke?.(cmd);
}

export default function AgentStatsView() {
  const [stats, setStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"games" | "winRate" | "acs" | "hs">("games");

  useEffect(() => {
    invokeCmd("get_agent_stats")
      .then((data: AgentStats[]) => setStats(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...stats].sort((a, b) => {
    if (sortBy === "games") return b.games - a.games;
    if (sortBy === "winRate") return b.winRate - a.winRate;
    if (sortBy === "acs") return b.acs - a.acs;
    return b.hs - a.hs;
  });

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">AGENT_PERFORMANCE</span>
        <span className="micro-label">{stats.length} AGENTS</span>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 mb-4 fade-up" style={{ animationDelay: "0.05s" }}>
        {(["games", "winRate", "acs", "hs"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
              sortBy === key
                ? "border-neon/30 text-neon bg-neon/10"
                : "border-white/[0.08] text-white/30 hover:text-white/50"
            }`}
          >
            {key === "winRate" ? "WIN%" : key.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="text-[10px] font-mono text-white/30 animate-pulse">LOADING AGENT DATA...</div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">AGENTS</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO AGENT DATA</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Play matches to see agent performance stats</div>
        </div>
      ) : (
        <div className="space-y-px bg-white/[0.08]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-2 bg-bg-primary text-[8px] font-mono text-white/25 uppercase tracking-wider">
            <span className="flex-1">Agent</span>
            <span className="w-10 text-center">Games</span>
            <span className="w-10 text-center">Win%</span>
            <span className="w-12 text-center">K/D/A</span>
            <span className="w-10 text-center">ACS</span>
            <span className="w-10 text-center">HS%</span>
            <span className="w-10 text-center">ADR</span>
          </div>

          {sorted.map((agent, i) => (
            <div
              key={agent.agentName}
              className="flex items-center gap-3 px-4 py-3 bg-bg-primary hover:bg-bg-elevated transition-colors fade-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Agent icon + name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 flex items-center justify-center border border-white/[0.12] overflow-hidden shrink-0">
                  {agent.agentIcon ? (
                    <img src={agent.agentIcon} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-white/40">{agent.agentName.charAt(0)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-white/70 truncate">{agent.agentName}</span>
              </div>

              <span className="w-10 text-center text-xs font-mono text-white/50">{agent.games}</span>
              <span className={`w-10 text-center text-xs font-mono ${agent.winRate >= 50 ? "text-neon" : "text-err"}`}>
                {agent.winRate}%
              </span>
              <span className="w-12 text-center text-xs font-mono text-white/50">
                {agent.kills}/{agent.deaths}/{agent.assists}
              </span>
              <span className="w-10 text-center text-xs font-mono text-white/60">{agent.acs}</span>
              <span className="w-10 text-center text-xs font-mono text-neon">{agent.hs}%</span>
              <span className="w-10 text-center text-xs font-mono text-white/40">{agent.adr}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
