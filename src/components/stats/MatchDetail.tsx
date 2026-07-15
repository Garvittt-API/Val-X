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

      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
        {/* Allies */}
        <div className="bg-bg-primary">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.08]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon" />
            <span className="micro-label text-neon/60">ALLIES</span>
          </div>
          <ScoreboardColumn players={allies} />
        </div>

        {/* Enemies */}
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
      {/* Header */}
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
          {/* Agent + Name */}
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

          {/* Stats */}
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
