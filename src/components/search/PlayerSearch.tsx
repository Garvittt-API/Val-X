import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { PlayerProfile } from "../../types";
import RankBadge from "../shared/RankBadge";

export default function PlayerSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.includes("#")) {
      setError("Use format: Name#Tag");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const profile = await invoke<PlayerProfile>("search_player", { query });
      setResult(profile);
    } catch (e: any) {
      setError(e?.toString() || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">PLAYER_SEARCH</span>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-6 fade-up" style={{ animationDelay: "0.05s" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="NAME#TAG"
          className="flex-1 bg-bg-elevated border border-white/[0.12] px-4 py-3 text-sm font-mono text-white/80 placeholder:text-white/15 focus:outline-none focus:border-neon/30 transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 bg-neon text-black text-xs font-bold tracking-wider uppercase hover:bg-neon/90 transition-colors disabled:opacity-40"
        >
          {loading ? "..." : "SEARCH"}
        </button>
      </div>

      {error && (
        <div className="mb-4 py-2 px-3 border border-err/20 text-err text-xs font-mono fade-up">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="micro-label mb-3">SEARCH_RESULT</div>
          <div className="bg-bg-elevated border border-white/[0.12] p-4">
            <div className="flex items-center gap-4 mb-4">
              <RankBadge tier={result.rankTier} name={result.rankName} size="lg" />
              <div>
                <div className="display-text text-lg font-light text-white/90">{result.name}</div>
                <div className="micro-label mt-0.5">LEVEL {result.level}</div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-px bg-white/[0.08]">
              <ResultStat label="RANK" value={result.rankName} />
              <ResultStat label="PEAK" value={result.peakRankName} />
              <ResultStat label="WIN_RATE" value={`${result.winRate}%`} highlight />
              <ResultStat label="WINS" value={`${result.wins}`} />
              <ResultStat label="GAMES" value={`${result.games}`} />
            </div>

            {/* Recent matches */}
            {result.history.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.12]">
                <div className="micro-label mb-2">RECENT_MATCHES</div>
                {result.history.slice(0, 5).map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0"
                  >
                    <div
                      className="w-1 h-6 shrink-0"
                      style={{
                        background: match.won ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                      }}
                    />
                    <span className="text-[10px] text-white/50 flex-1">{match.map}</span>
                    <span className="text-[10px] font-mono text-white/40">
                      {match.kills}/{match.deaths}/{match.assists}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      match.rrChange >= 0 ? "text-neon" : "text-err"
                    }`}>
                      {match.rrChange >= 0 ? "+" : ""}{match.rrChange}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-elevated p-3">
      <div className="micro-label mb-0.5">{label}</div>
      <div className={`text-xs font-mono ${highlight ? "text-neon" : "text-white/60"}`}>
        {value || "—"}
      </div>
    </div>
  );
}
