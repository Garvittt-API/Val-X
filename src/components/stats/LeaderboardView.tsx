import { useState, useEffect } from "react";

function invokeCmd(cmd: string, args?: Record<string, unknown>) {
  return (window as any).__TAURI__?.core?.invoke?.(cmd, args);
}

interface LeaderboardEntry {
  playerUuid: string;
  gameName: string;
  tagLine: string;
  leaderboardRank: number;
  rankedRating: number;
  competitiveTier: number;
  numberOfWins: number;
}

export default function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");

  const fetchLeaderboard = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const data = await invokeCmd("get_leaderboard", { actId: "0ade0ac3-4f4e-4c1d-9c3a-4d7a1f3c6e3e", apiKey });
      setEntries(data?.players || []);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">LEADERBOARD</span>
        <span className="micro-label">RANKED_RADIANT</span>
      </div>

      {/* API Key input */}
      <div className="flex gap-2 mb-4 fade-up" style={{ animationDelay: "0.05s" }}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="RIOT API KEY (RGAPI-...)"
          className="flex-1 bg-bg-elevated border border-white/[0.12] px-4 py-2 text-xs font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon/30"
        />
        <button
          onClick={fetchLeaderboard}
          disabled={!apiKey || loading}
          className="px-4 py-2 bg-neon/20 text-neon text-[10px] font-bold tracking-wider uppercase border border-neon/30 hover:bg-neon/30 disabled:opacity-40"
        >
          {loading ? "..." : "FETCH"}
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="bg-bg-elevated border border-white/[0.12]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.08] text-[8px] font-mono text-white/25 uppercase tracking-wider">
            <span className="w-10 text-center">#</span>
            <span className="flex-1">Player</span>
            <span className="w-16 text-center">RR</span>
            <span className="w-12 text-center">Wins</span>
          </div>

          {entries.map((entry, i) => (
            <div
              key={entry.playerUuid || i}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
            >
              <span className={`w-10 text-center text-xs font-mono ${
                entry.leaderboardRank <= 3 ? "text-neon" : "text-white/40"
              }`}>
                {entry.leaderboardRank}
              </span>
              <span className="flex-1 text-sm text-white/70">
                {entry.gameName}#{entry.tagLine}
              </span>
              <span className="w-16 text-center text-xs font-mono text-white/50">
                {entry.rankedRating}
              </span>
              <span className="w-12 text-center text-xs font-mono text-white/40">
                {entry.numberOfWins}
              </span>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">RANK</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO LEADERBOARD DATA</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Enter a Riot API key to fetch the leaderboard</div>
        </div>
      ) : null}
    </div>
  );
}
