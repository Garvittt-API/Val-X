import { useMatchStore } from "../../store/matchStore";
import OverlayPlayer from "./OverlayPlayer";

export default function OverlayWindow() {
  const view = useMatchStore((s) => s.view);
  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  if (view.state === "NoGame") {
    return (
      <div className="glass-strong backdrop-blur-xl rounded-2xl p-4 text-center border border-white/5">
        <span className="text-white/40 text-xs font-mono">No active match</span>
      </div>
    );
  }

  return (
    <div className="glass-strong backdrop-blur-xl rounded-2xl overflow-hidden min-w-[600px] border border-white/5 shadow-depth-xl">
      {/* Header */}
      <div className="px-4 py-2 glass-subtle flex items-center justify-between text-[10px] border-b border-white/5">
        <span className="text-white/60 font-semibold uppercase tracking-wider">{view.mode}</span>
        {view.map && <span className="text-white/40 font-mono">{view.map}</span>}
        {view.allyScore > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-accent-blue font-bold font-mono text-glow-blue">{view.allyScore}</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-accent-red font-bold font-mono text-glow-red">{view.enemyScore}</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="flex">
        {/* Allies */}
        <div className="flex-1 p-3">
          <div className="text-[9px] text-accent-blue/60 uppercase tracking-wider mb-2 px-2 font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            Allies
          </div>
          {allies.map((player) => (
            <OverlayPlayer key={player.puuid} player={player} />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Enemies */}
        <div className="flex-1 p-3">
          <div className="text-[9px] text-accent-red/60 uppercase tracking-wider mb-2 px-2 font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
            Enemies
          </div>
          {enemies.map((player) => (
            <OverlayPlayer key={player.puuid} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
