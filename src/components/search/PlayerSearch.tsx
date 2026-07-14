import { useState } from "react";
import { Search } from "lucide-react";
import RankBadge from "../shared/RankBadge";
import type { PlayerProfile } from "../../types";

export default function PlayerSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.includes("#")) {
      alert("Use format: Name#Tag");
      return;
    }
    setLoading(true);
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const profile = await invoke<PlayerProfile>("search_player", { query });
      setResult(profile);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-white tracking-tight">Player Search</h1>
        <p className="text-white/40 text-sm mt-1">
          Look up players by Riot ID to view their stats and match history
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter Riot ID (e.g., PlayerName#1234)"
            className="w-full pl-11 pr-4 py-3.5 glass rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-accent-blue/30 focus:shadow-glow-blue transition-all duration-300 border border-white/5"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3.5 glass rounded-xl text-accent-blue font-semibold border border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 btn-3d"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Result */}
      {result && (
        <div className="card-3d-inner p-6 neon-border animate-slide-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <RankBadge tier={result.rankTier} name={result.rankName} size="lg" />
              <div className="absolute -inset-3 bg-accent-blue/10 rounded-2xl blur-xl pointer-events-none" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-white">{result.name || "Unknown"}</div>
              <div className="text-white/40 text-sm">Level {result.level}</div>
              <div className="flex gap-6 mt-3">
                <ResultStat label="Current Rank" value={result.rankName} />
                <ResultStat label="Peak Rank" value={result.peakRankName} />
                <ResultStat label="Win Rate" value={`${result.winRate}%`} highlight />
                <ResultStat label="Games" value={result.games.toString()} />
                <ResultStat label="Wins" value={result.wins.toString()} />
              </div>
            </div>
          </div>

          {/* Match History */}
          {result.history.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Recent Matches</h3>
              <div className="space-y-2">
                {result.history.slice(0, 5).map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 glass rounded-xl group hover:border-white/10 transition-all duration-200"
                  >
                    <div
                      className={`w-1.5 h-10 rounded-full ${
                        match.won ? "bg-green-500 shadow-glow-green" : "bg-red-500/60"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{match.map}</div>
                      <div className="text-white/30 text-xs font-mono mt-0.5">
                        {match.kills}/{match.deaths}/{match.assists} | ACS {match.acs} | HS {match.hs}%
                      </div>
                    </div>
                    {match.ranked && (
                      <div
                        className={`text-sm font-semibold font-mono ${
                          match.rrChange >= 0 ? "text-green-400 text-glow-green" : "text-red-400 text-glow-red"
                        }`}
                      >
                        {match.rrChange >= 0 ? "+" : ""}{match.rrChange}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-white/30 text-[10px] uppercase tracking-wider">{label}</div>
      <div className={`font-semibold text-sm ${highlight ? "text-accent-cyan text-glow-cyan" : "text-white"}`}>{value}</div>
    </div>
  );
}
