import { useMatchStore } from "../../store/matchStore";
import PlayerCard from "./PlayerCard";
import MatchHeader from "./MatchHeader";

export default function AgentSelect() {
  const view = useMatchStore((s) => s.view);
  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  return (
    <div className="p-6 space-y-6">
      <MatchHeader />

      <div className="grid grid-cols-2 gap-6">
        {/* Allies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-glow-blue" />
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Your Team
            </h2>
            <span className="text-white/20 text-xs font-mono">({allies.length})</span>
          </div>
          <div className="space-y-3">
            {allies.map((player) => (
              <PlayerCard key={player.puuid} player={player} side="ally" />
            ))}
            {allies.length === 0 && (
              <div className="text-white/15 text-center py-12 glass rounded-xl border border-white/5">
                Waiting for players...
              </div>
            )}
          </div>
        </div>

        {/* Enemies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red shadow-glow-red" />
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Enemy Team
            </h2>
            <span className="text-white/20 text-xs font-mono">({enemies.length})</span>
          </div>
          <div className="space-y-3">
            {enemies.map((player) => (
              <PlayerCard key={player.puuid} player={player} side="enemy" />
            ))}
            {enemies.length === 0 && (
              <div className="text-white/15 text-center py-12 glass rounded-xl border border-white/5">
                Enemies will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
