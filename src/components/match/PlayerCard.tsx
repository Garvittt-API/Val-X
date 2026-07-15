import type { PlayerRow } from "../../types";
import RankBadge from "../shared/RankBadge";
import clsx from "clsx";

interface Props {
  player: PlayerRow;
  side: "ally" | "enemy";
  index?: number;
}

export default function PlayerCard({ player, side, index = 0 }: Props) {
  const idx = String(index + 1).padStart(2, "0");

  return (
    <div
      className={clsx(
        "relative pl-5 py-3 px-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group"
      )}
    >
      {/* Severity rail */}
      <div className={`severity-rail severity-rail--${side}`} />

      <div className="flex items-center gap-4">
        {/* Index marker */}
        <div className="w-6 h-6 flex items-center justify-center border border-white/[0.1] text-[9px] font-mono text-white/30 shrink-0">
          {idx}
        </div>

        {/* Agent */}
        <div className="w-8 h-8 flex items-center justify-center border border-white/[0.12] shrink-0 overflow-hidden">
          {player.agentIcon ? (
            <img src={player.agentIcon} alt={player.agent} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-white/40">
              {player.agent ? player.agent.charAt(0) : "?"}
            </span>
          )}
        </div>

        {/* Name + Agent */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/80 truncate">
              {player.name || "Hidden"}
            </span>
            {player.hiddenName && (
              <span className="micro-label text-white/20">HIDDEN</span>
            )}
            {player.locked && (
              <span className="text-[9px] font-mono text-neon/60">LOCKED</span>
            )}
          </div>
          <div className="text-[10px] text-white/25 font-mono">{player.agent || "No agent"}</div>
        </div>

        {/* Stats */}
        {player.hasCombat && (
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <StatBlock label="K/D" value={`${player.lastKills}/${player.lastDeaths}`} />
            <StatBlock label="HS" value={`${player.lastHs}%`} highlight />
            <StatBlock label="ACS" value={`${player.lastAcs}`} />
          </div>
        )}

        {/* Party */}
        {player.partySize > 1 && (
          <span className="text-[9px] font-mono text-neon/50 border border-neon/20 px-1.5 py-0.5">
            {player.partySize}x
          </span>
        )}

        {/* Smurf indicator */}
        {player.smurfScore > 20 && (
          <div className={`text-[9px] font-mono px-1.5 py-0.5 border ${
            player.smurfScore >= 60
              ? "text-err border-err/30 bg-err/10"
              : player.smurfScore >= 40
                ? "text-warn border-warn/30 bg-warn/10"
                : "text-white/40 border-white/10"
          }`}>
            {player.smurfScore >= 60 ? "HIGH" : player.smurfScore >= 40 ? "MOD" : "LOW"} SMURF
          </div>
        )}

        {/* Encounter history */}
        {player.encounters > 0 && (
          <div className="text-[9px] font-mono text-white/25 text-right">
            <div>{player.encounters}x</div>
            <div className={player.encounterWins > player.encounterLosses ? "text-neon/50" : player.encounterWins < player.encounterLosses ? "text-err/50" : ""}>
              {player.encounterWins}W {player.encounterLosses}L
            </div>
          </div>
        )}

        {/* Rank */}
        <div className="flex items-center gap-2 shrink-0">
          <RankBadge tier={player.rankTier} name={player.rankName} size="sm" icon={player.rankIcon} />
          <div className="text-right">
            <div className="text-[10px] font-mono text-white/50">{player.rr} RR</div>
            <div className="text-[9px] font-mono text-white/20">WR {player.winRate}%</div>
          </div>
        </div>

        {/* Peak */}
        <RankBadge tier={player.peakRankTier} name={player.peakRankName} size="sm" icon={player.peakRankIcon} />
      </div>
    </div>
  );
}

function StatBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-white/20 text-[8px] tracking-wider uppercase">{label}</div>
      <div className={clsx("text-[10px] font-medium", highlight ? "text-neon" : "text-white/50")}>
        {value}
      </div>
    </div>
  );
}
