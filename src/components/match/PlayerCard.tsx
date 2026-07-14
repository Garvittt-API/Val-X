import type { PlayerRow } from "../../types";
import RankBadge from "../shared/RankBadge";
import clsx from "clsx";

interface Props {
  player: PlayerRow;
  side: "ally" | "enemy";
}

export default function PlayerCard({ player, side }: Props) {
  const isPartyLeader = player.partySize > 1;

  return (
    <div
      className={clsx(
        "relative rounded-2xl p-4 border transition-all duration-300 group",
        side === "ally"
          ? "glass card-3d-ally border-blue-500/10 hover:border-blue-500/30"
          : "glass card-3d-enemy border-red-500/10 hover:border-red-500/30"
      )}
    >
      {/* Party indicator */}
      {isPartyLeader && (
        <div className="absolute -left-px top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-full bg-accent-gold shadow-glow-gold" />
      )}

      <div className="flex items-center gap-3">
        {/* Agent icon */}
        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border transition-all duration-300",
            side === "ally"
              ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400 group-hover:shadow-glow-blue group-hover:border-blue-500/40"
              : "bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/20 text-red-400 group-hover:shadow-glow-red group-hover:border-red-500/40"
          )}
        >
          {player.agent ? player.agent.charAt(0) : "?"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm truncate">
              {player.name || "Hidden"}
            </span>
            {player.hiddenName && (
              <span className="text-white/20 text-[10px] px-1.5 py-0.5 glass rounded">(Hidden)</span>
            )}
          </div>
          <div className="text-white/35 text-xs mt-0.5">{player.agent || "No agent"}</div>
        </div>

        {/* Rank */}
        <div className="flex flex-col items-end gap-1">
          <RankBadge tier={player.rankTier} name={player.rankName} size="sm" />
          {player.rr > 0 && (
            <span className="text-white/25 text-[10px] font-mono">{player.rr} RR</span>
          )}
        </div>

        {/* Peak rank */}
        <div className="flex flex-col items-end gap-1 ml-1">
          <div className="text-white/20 text-[9px] uppercase tracking-wider">Peak</div>
          <RankBadge tier={player.peakRankTier} name={player.peakRankName} size="sm" />
        </div>

        {/* Lock state */}
        {player.locked && (
          <div className="ml-2 px-2 py-1 glass rounded-lg border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase tracking-wider">
            Locked
          </div>
        )}
      </div>

      {/* Combat stats row */}
      {player.hasCombat && (
        <div className="flex gap-5 mt-3 pt-3 border-t border-white/5">
          <MiniStat label="K/D" value={`${player.lastKills}/${player.lastDeaths}`} />
          <MiniStat label="HS%" value={`${player.lastHs}%`} highlight />
          <MiniStat label="ACS" value={player.lastAcs.toString()} />
          <MiniStat
            label="W/L"
            value={`${player.recentWins}W ${player.recentLosses}L`}
          />
        </div>
      )}

      {/* Party size indicator */}
      {player.partySize > 1 && (
        <div className="absolute top-3 right-3 px-2 py-1 glass rounded-lg border border-accent-gold/20 text-accent-gold text-[10px] font-semibold">
          {player.partySize} STACK
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-white/25 text-[9px] uppercase tracking-wider">{label}</div>
      <div className={clsx(
        "text-xs font-semibold font-mono",
        highlight ? "text-accent-cyan text-glow-cyan" : "text-white/60"
      )}>
        {value}
      </div>
    </div>
  );
}
