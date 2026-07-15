import { useMatchStore } from "../../store/matchStore";
import OverlayPlayer from "./OverlayPlayer";

export default function OverlayWindow() {
  const view = useMatchStore((s) => s.view);

  if (view.state === "NoGame") {
    return (
      <div className="min-w-[400px] bg-bg-primary border border-white/[0.12] p-4 text-center">
        <span className="text-[10px] font-mono text-white/20">NO ACTIVE MATCH</span>
      </div>
    );
  }

  const allies = view.players.filter((p) => p.team === "Ally");
  const enemies = view.players.filter((p) => p.team === "Enemy");

  return (
    <div className="min-w-[500px] bg-bg-primary border border-white/[0.12] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.12]">
        <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/40">{view.mode}</span>
        <span className="text-[9px] font-mono text-white/25">{view.map}</span>
        <span className="text-[10px] font-mono font-medium">
          <span className="text-neon">{view.allyScore}</span>
          <span className="text-white/15 mx-1">—</span>
          <span className="text-err">{view.enemyScore}</span>
        </span>
      </div>

      {/* Teams */}
      <div className="flex">
        <div className="flex-1 py-1">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-neon" />
            <span className="text-[8px] font-semibold tracking-[0.15em] uppercase text-neon/40">ALLIES</span>
          </div>
          {allies.map((p) => (
            <OverlayPlayer key={p.puuid} player={p} />
          ))}
        </div>
        <div className="w-px bg-white/[0.08]" />
        <div className="flex-1 py-1">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-err" />
            <span className="text-[8px] font-semibold tracking-[0.15em] uppercase text-err/40">ENEMIES</span>
          </div>
          {enemies.map((p) => (
            <OverlayPlayer key={p.puuid} player={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
