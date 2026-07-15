import { useState } from "react";
import { useMatchStore } from "../../store/matchStore";
import RankBadge from "../shared/RankBadge";
import MatchDetail from "../stats/MatchDetail";

export default function MatchHistory() {
  const view = useMatchStore((s) => s.view);
  const history = view.history;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">MATCH_LOGS</span>
        <span className="micro-label">{history.length} RECORDS</span>
      </div>

      {history.length > 0 ? (
        <div>
          {history.map((match, i) => (
            <div
              key={match.matchId || i}
              className="fade-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div
                className="flex items-center gap-4 py-3 px-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                {/* Win/Loss severity rail */}
                <div
                  className="w-1 h-10 shrink-0"
                  style={{
                    background: match.won ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                    boxShadow: match.won
                      ? "0 0 8px rgba(43,255,87,0.4)"
                      : "0 0 8px rgba(239,68,68,0.4)",
                  }}
                />

                {/* Agent */}
                <div className="w-8 h-8 flex items-center justify-center border border-white/[0.12] text-[10px] font-bold text-white/40 shrink-0">
                  {match.agentIcon ? (
                    <img src={match.agentIcon} alt="" className="w-full h-full object-cover" />
                  ) : match.agentName ? (
                    match.agentName.charAt(0)
                  ) : (
                    "?"
                  )}
                </div>

                {/* Map + Mode */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/70 truncate">{match.map || "Unknown"}</span>
                    {match.ranked && (
                      <span className="text-[8px] font-mono text-neon/50 border border-neon/20 px-1 py-0.5">
                        COMP
                      </span>
                    )}
                    {match.selfRounds > 0 || match.enemyRounds > 0 ? (
                      <span className="text-[10px] font-mono text-white/30">
                        {match.selfRounds}-{match.enemyRounds}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[10px] text-white/20 font-mono">{match.agentName}</div>
                </div>

                {/* KDA */}
                <div className="text-center shrink-0">
                  <div className="text-xs font-mono text-white/60">
                    {match.kills}/{match.deaths}/{match.assists}
                  </div>
                  <div className="micro-label">KDA</div>
                </div>

                {/* ACS */}
                <div className="text-center shrink-0 w-12">
                  <div className="text-xs font-mono text-white/50">{match.acs}</div>
                  <div className="micro-label">ACS</div>
                </div>

                {/* HS% */}
                <div className="text-center shrink-0 w-12">
                  <div className="text-xs font-mono text-neon">{match.hs}%</div>
                  <div className="micro-label">HS</div>
                </div>

                {/* ADR */}
                <div className="text-center shrink-0 w-12">
                  <div className="text-xs font-mono text-white/40">{match.adr}</div>
                  <div className="micro-label">ADR</div>
                </div>

                {/* KAST */}
                <div className="text-center shrink-0 w-12">
                  <div className="text-xs font-mono text-white/40">{match.kast}%</div>
                  <div className="micro-label">KAST</div>
                </div>

                {/* Rank */}
                <div className="shrink-0">
                  <RankBadge tier={match.tier} name={match.rankName} size="sm" />
                </div>

                {/* RR Change */}
                {match.ranked && (
                  <div className={`text-xs font-mono font-medium min-w-[50px] text-right ${
                    match.rrChange >= 0 ? "text-neon" : "text-err"
                  }`}>
                    {match.rrChange >= 0 ? "+" : ""}{match.rrChange}
                  </div>
                )}

                {/* Expand indicator */}
                <div className="text-white/20 text-[10px] shrink-0">
                  {expanded === i ? "▼" : "▶"}
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === i && match.scoreboard.length > 0 && (
                <MatchDetail match={match} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">LOG</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO MATCH RECORDS</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Play competitive matches to see your history here</div>
        </div>
      )}
    </div>
  );
}
