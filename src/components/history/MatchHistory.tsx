import { useMatchStore } from "../../store/matchStore";
import RankBadge from "../shared/RankBadge";

export default function MatchHistory() {
  const view = useMatchStore((s) => s.view);
  const history = view.history;

  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-white tracking-tight">Match History</h1>
        <p className="text-white/40 text-sm mt-1">Your recent competitive matches</p>
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((match, i) => (
            <div
              key={i}
              className="card-3d-inner p-4 neon-border animate-fade-in group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                {/* Win/Loss indicator */}
                <div
                  className={`w-1.5 h-12 rounded-full ${
                    match.won ? "bg-green-500 shadow-glow-green" : "bg-red-500/60"
                  }`}
                />

                {/* Agent */}
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 text-sm font-bold border border-white/5">
                  {match.agentName ? match.agentName.charAt(0) : "?"}
                </div>

                {/* Map & Mode */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{match.map || "Unknown"}</span>
                    {match.ranked && (
                      <span className="px-2 py-0.5 glass rounded-md border border-accent-blue/20 text-accent-blue text-[10px] font-semibold uppercase tracking-wider">
                        COMP
                      </span>
                    )}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">{match.agentName || "Unknown agent"}</div>
                </div>

                {/* KDA */}
                <div className="text-center">
                  <div className="text-white font-semibold font-mono">
                    {match.kills}/{match.deaths}/{match.assists}
                  </div>
                  <div className="text-white/25 text-[10px] uppercase tracking-wider">KDA</div>
                </div>

                {/* ACS */}
                <div className="text-center">
                  <div className="text-white font-semibold font-mono">{match.acs}</div>
                  <div className="text-white/25 text-[10px] uppercase tracking-wider">ACS</div>
                </div>

                {/* HS% */}
                <div className="text-center">
                  <div className="text-accent-cyan font-semibold font-mono text-glow-cyan">{match.hs}%</div>
                  <div className="text-white/25 text-[10px] uppercase tracking-wider">HS</div>
                </div>

                {/* Rank */}
                <div className="flex flex-col items-center">
                  <RankBadge tier={match.tier} name={match.rankName} size="sm" />
                </div>

                {/* RR Change */}
                {match.ranked && (
                  <div
                    className={`text-sm font-semibold font-mono min-w-[60px] text-right ${
                      match.rrChange >= 0 ? "text-green-400 text-glow-green" : "text-red-400 text-glow-red"
                    }`}
                  >
                    {match.rrChange >= 0 ? "+" : ""}
                    {match.rrChange}
                  </div>
                )}
              </div>

              {/* Expanded stats */}
              {match.hasStats && (
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-5 gap-4">
                  <MiniStat label="Score" value={`${match.selfRounds}-${match.enemyRounds}`} />
                  <MiniStat label="ACS" value={match.acs.toString()} />
                  <MiniStat label="HS%" value={`${match.hs}%`} highlight />
                  <MiniStat label="ADR" value={match.adr.toString()} />
                  <MiniStat label="KAST" value={`${match.kast}%`} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-3d-inner p-16 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 mb-6">
            <span className="text-2xl font-bold text-white/20">H</span>
          </div>
          <h2 className="text-lg font-semibold text-white/50 mb-2">No Match History</h2>
          <p className="text-white/25 text-sm max-w-xs mx-auto">
            Play some competitive matches to see your history here
          </p>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-white/20 text-[9px] uppercase tracking-wider">{label}</div>
      <div className={`text-xs font-semibold font-mono ${highlight ? "text-accent-cyan text-glow-cyan" : "text-white/60"}`}>
        {value}
      </div>
    </div>
  );
}
