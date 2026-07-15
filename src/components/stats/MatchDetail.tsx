import type { HistoryEntry, ScoreEntry } from "../../types";

interface Props {
  match: HistoryEntry;
}

export default function MatchDetail({ match }: Props) {
  const allies = match.scoreboard.filter((s) => s.ally);
  const enemies = match.scoreboard.filter((s) => !s.ally);

  return (
    <div className="border-t border-white/[0.08] p-4 bg-bg-elevated">
      {/* Score */}
      <div className="flex items-center gap-4 mb-4">
        <span className="micro-label">SCORE</span>
        <span className="font-mono text-sm">
          <span className="text-neon">{match.selfRounds}</span>
          <span className="text-white/20 mx-1">—</span>
          <span className="text-err">{match.enemyRounds}</span>
        </span>
        <span className={`text-[10px] font-mono ${match.won ? "text-neon" : "text-err"}`}>
          {match.won ? "VICTORY" : "DEFEAT"}
        </span>
      </div>

      {/* Round Timeline */}
      {match.roundTimeline.length > 0 && (
        <div className="mb-4">
          <div className="micro-label mb-2">ROUND_TIMELINE</div>
          <div className="flex gap-0.5">
            {match.roundTimeline.map((round, i) => {
              const selfWon = round.winningTeam === round.selfTeam;
              return (
                <div
                  key={i}
                  className="flex-1 h-6 flex items-center justify-center text-[8px] font-mono transition-colors"
                  style={{
                    background: selfWon ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                    opacity: round.isPistol ? 1 : 0.6,
                  }}
                  title={`Round ${round.roundNum}: ${selfWon ? "WON" : "LOST"}${round.isPistol ? " (PISTOL)" : ""}`}
                >
                  {round.roundNum}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] font-mono text-white/20">ATTACK</span>
            <span className="text-[8px] font-mono text-white/20">DEFENSE</span>
          </div>
        </div>
      )}

      {/* Combat Highlights */}
      <div className="grid grid-cols-5 gap-px bg-white/[0.08] mb-4">
        <MiniStat label="ACES" value={`${match.aces}`} highlight={match.aces > 0} />
        <MiniStat label="CLUTCHES" value={`${match.clutches}`} highlight={match.clutches > 0} />
        <MiniStat label="FIRST BLOODS" value={`${match.firstBloods}`} />
        <MiniStat label="PLANTS" value={`${match.plants}`} />
        <MiniStat label="DEFUSES" value={`${match.defuses}`} />
      </div>

      {/* Attack vs Defense */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.08] mb-4">
        <div className="bg-bg-primary p-2">
          <div className="micro-label mb-1">ATTACK</div>
          <div className="text-xs font-mono">
            <span className="text-neon">{match.attackWon}</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">{match.attackRounds}</span>
          </div>
        </div>
        <div className="bg-bg-primary p-2">
          <div className="micro-label mb-1">DEFENSE</div>
          <div className="text-xs font-mono">
            <span className="text-err">{match.defenseWon}</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">{match.defenseRounds}</span>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
        <div className="bg-bg-primary">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.08]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon" />
            <span className="micro-label text-neon/60">ALLIES</span>
          </div>
          <ScoreboardColumn players={allies} />
        </div>
        <div className="bg-bg-primary">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.08]">
            <div className="w-1.5 h-1.5 rounded-full bg-err" />
            <span className="micro-label text-err/60">ENEMIES</span>
          </div>
          <ScoreboardColumn players={enemies} />
        </div>
      </div>
    </div>
  );
}

function ScoreboardColumn({ players }: { players: ScoreEntry[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-1 text-[8px] font-mono text-white/25 uppercase tracking-wider border-b border-white/[0.05]">
        <span className="flex-1">Player</span>
        <span className="w-8 text-center">K</span>
        <span className="w-8 text-center">D</span>
        <span className="w-8 text-center">A</span>
        <span className="w-10 text-center">ACS</span>
        <span className="w-8 text-center">HS</span>
      </div>
      {players.map((p, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
            p.isSelf ? "bg-white/[0.03]" : ""
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 flex items-center justify-center border border-white/[0.08] text-[8px] font-bold text-white/40 shrink-0">
              {p.agentIcon ? (
                <img src={p.agentIcon} alt="" className="w-full h-full object-cover" />
              ) : (
                "?"
              )}
            </div>
            <span className={`truncate ${p.isSelf ? "text-neon font-medium" : "text-white/60"}`}>
              {p.name || "Unknown"}
            </span>
          </div>
          <span className="w-8 text-center font-mono text-white/50">{p.kills}</span>
          <span className="w-8 text-center font-mono text-white/50">{p.deaths}</span>
          <span className="w-8 text-center font-mono text-white/50">{p.assists}</span>
          <span className="w-10 text-center font-mono text-white/60">{p.acs}</span>
          <span className="w-8 text-center font-mono text-neon/70">{p.hs}%</span>
        </div>
      ))}
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-primary p-2 text-center">
      <div className="micro-label mb-0.5">{label}</div>
      <div className={`text-xs font-mono ${highlight ? "text-neon" : "text-white/50"}`}>{value}</div>
    </div>
  );
}
