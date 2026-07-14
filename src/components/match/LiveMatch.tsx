import { useMatchStore } from "../../store/matchStore";
import PlayerCard from "./PlayerCard";
import MatchHeader from "./MatchHeader";

export default function LiveMatch() {
  const view = useMatchStore((s) => s.view);
  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  return (
    <div className="p-6 space-y-6">
      <MatchHeader />

      {/* Score Display */}
      {view.allyScore > 0 && (
        <div className="flex items-center justify-center gap-10 py-4 animate-fade-in">
          <div className="text-right">
            <div className="text-5xl font-bold text-accent-blue text-glow-blue font-mono">{view.allyScore}</div>
            <div className="text-white/30 text-xs uppercase tracking-wider mt-1">Allies</div>
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="text-left">
            <div className="text-5xl font-bold text-accent-red text-glow-red font-mono">{view.enemyScore}</div>
            <div className="text-white/30 text-xs uppercase tracking-wider mt-1">Enemies</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Allies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-glow-blue" />
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Your Team
            </h2>
          </div>
          <div className="space-y-3">
            {allies.map((player) => (
              <PlayerCard key={player.puuid} player={player} side="ally" />
            ))}
          </div>
        </div>

        {/* Enemies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red shadow-glow-red" />
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Enemy Team
            </h2>
          </div>
          <div className="space-y-3">
            {enemies.map((player) => (
              <PlayerCard key={player.puuid} player={player} side="enemy" />
            ))}
          </div>
        </div>
      </div>

      {/* Combat Loading */}
      {view.combatLoading && (
        <div className="text-center py-3 glass rounded-xl border border-white/5">
          <span className="text-white/30 text-sm animate-pulse font-mono">
            Loading combat stats...
          </span>
        </div>
      )}
    </div>
  );
}
