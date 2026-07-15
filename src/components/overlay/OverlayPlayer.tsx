import type { PlayerRow } from "../../types";

interface Props {
  player: PlayerRow;
}

export default function OverlayPlayer({ player }: Props) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/[0.03] transition-colors">
      {/* Agent */}
      <div className="w-5 h-5 flex items-center justify-center border border-white/[0.12] text-[8px] font-bold text-white/40">
        {player.agent ? player.agent.charAt(0) : "?"}
      </div>

      {/* Name */}
      <span className="flex-1 min-w-0 text-[10px] font-medium text-white/60 truncate">
        {player.name || "Hidden"}
      </span>

      {/* Stats */}
      {player.hasCombat && (
        <div className="flex gap-2 text-[9px] font-mono">
          <span className="text-white/30">{player.lastKills}/{player.lastDeaths}</span>
          <span className="text-neon/40">{player.lastHs}%</span>
          <span className="text-white/20">{player.lastAcs}</span>
        </div>
      )}

      {/* Rank */}
      <div className="w-5 h-5 flex items-center justify-center border border-white/[0.12] text-[7px] font-bold text-white/35">
        {player.rankName ? player.rankName.substring(0, 2).toUpperCase() : "—"}
      </div>
    </div>
  );
}
