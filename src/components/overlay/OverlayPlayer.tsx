import type { PlayerRow } from "../../types";

interface Props {
  player: PlayerRow;
}

export default function OverlayPlayer({ player }: Props) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-lg transition-all duration-200 group">
      {/* Agent initial */}
      <div className="w-6 h-6 rounded-lg glass flex items-center justify-center text-[9px] font-bold text-white/60 border border-white/5">
        {player.agent ? player.agent.charAt(0) : "?"}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="text-white/80 text-[11px] font-medium truncate">
          {player.name || "Hidden"}
        </div>
      </div>

      {/* Stats */}
      {player.hasCombat && (
        <div className="flex gap-2.5 text-[10px] font-mono">
          <span className="text-white/40">
            {player.lastKills}/{player.lastDeaths}
          </span>
          <span className="text-accent-cyan/60">{player.lastHs}%</span>
          <span className="text-white/30">{player.lastAcs}</span>
        </div>
      )}

      {/* Rank */}
      <div className="w-6 h-6 rounded-lg glass flex items-center justify-center text-[8px] font-bold text-white/50 border border-white/5">
        {player.rankName
          .split(" ")
          .map((w) => w.charAt(0))
          .join("")
          .slice(0, 2) || "?"}
      </div>
    </div>
  );
}
