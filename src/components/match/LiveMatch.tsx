import { useMatchStore } from "../../store/matchStore";
import MatchHeader from "./MatchHeader";
import PlayerCard from "./PlayerCard";

export default function LiveMatch() {
  const view = useMatchStore((s) => s.view);
  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  return (
    <div>
      <MatchHeader />
      <div className="p-4">
        {/* Score display */}
        {(view.allyScore > 0 || view.enemyScore > 0) && (
          <div className="flex items-center justify-center gap-8 py-4 mb-4 border-b border-white/[0.12] fade-up">
            <div className="text-center">
              <div className="display-text text-4xl font-thin text-neon">
                {view.allyScore}
              </div>
              <div className="micro-label mt-1">ALLIES</div>
            </div>
            <div className="w-px h-12 bg-white/[0.08]" />
            <div className="text-center">
              <div className="display-text text-4xl font-thin text-err">
                {view.enemyScore}
              </div>
              <div className="micro-label mt-1">ENEMIES</div>
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center gap-3 mb-4 fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="display-text text-2xl font-light text-white/80">COMBAT_ROSTER</span>
          <span className="micro-label">IN_GAME PHASE</span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
          {/* Allies */}
          <div className="bg-bg-primary p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-neon" />
              <span className="micro-label text-neon/60">ALLIED FORCES</span>
            </div>
            {allies.length > 0 ? (
              allies.map((player, i) => (
                <PlayerCard key={player.puuid} player={player} side="ally" index={i} />
              ))
            ) : (
              <div className="py-12 text-center text-white/10 text-xs font-mono">
                NO ALLY DATA
              </div>
            )}
          </div>

          {/* Enemies */}
          <div className="bg-bg-primary p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-err" />
              <span className="micro-label text-err/60">HOSTILE FORCES</span>
            </div>
            {enemies.length > 0 ? (
              enemies.map((player, i) => (
                <PlayerCard key={player.puuid} player={player} side="enemy" index={i} />
              ))
            ) : (
              <div className="py-12 text-center text-white/10 text-xs font-mono">
                NO ENEMY DATA
              </div>
            )}
          </div>
        </div>

        {/* Combat loading indicator */}
        {view.combatLoading && (
          <div className="mt-4 py-3 border border-white/[0.12] text-center">
            <span className="text-[10px] font-mono text-white/20 animate-pulse">
              LOADING COMBAT TELEMETRY...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
