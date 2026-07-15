import { useMatchStore } from "../../store/matchStore";
import MatchHeader from "./MatchHeader";
import PlayerCard from "./PlayerCard";

export default function AgentSelect() {
  const view = useMatchStore((s) => s.view);
  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  return (
    <div>
      <MatchHeader />
      <div className="p-4">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4 fade-up">
          <span className="display-text text-2xl font-light text-white/80">LIVE_ROSTER</span>
          <span className="micro-label">AGENT_SELECT PHASE</span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
          {/* Allies */}
          <div className="bg-bg-primary p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-neon" />
              <span className="micro-label text-neon/60">ALLIED FORCES</span>
              <span className="micro-label">{allies.length}</span>
            </div>
            <div>
              {allies.length > 0 ? (
                allies.map((player, i) => (
                  <PlayerCard key={player.puuid} player={player} side="ally" index={i} />
                ))
              ) : (
                <div className="py-12 text-center text-white/10 text-xs font-mono">
                  AWAITING ROSTER
                </div>
              )}
            </div>
          </div>

          {/* Enemies */}
          <div className="bg-bg-primary p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-err" />
              <span className="micro-label text-err/60">HOSTILE FORCES</span>
              <span className="micro-label">{enemies.length}</span>
            </div>
            <div>
              {enemies.length > 0 ? (
                enemies.map((player, i) => (
                  <PlayerCard key={player.puuid} player={player} side="enemy" index={i} />
                ))
              ) : (
                <div className="py-12 text-center text-white/10 text-xs font-mono">
                  ENEMIES UNDETECTED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
