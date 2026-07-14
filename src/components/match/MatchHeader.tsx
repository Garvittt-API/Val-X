import { useMatchStore } from "../../store/matchStore";

export default function MatchHeader() {
  const view = useMatchStore((s) => s.view);

  return (
    <div className="glass-strong rounded-2xl p-4 border border-white/5 neon-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 glass rounded-xl border border-accent-blue/20 shadow-glow-blue">
            <span className="text-accent-blue text-sm font-semibold">
              {view.mode || "Unknown Mode"}
            </span>
          </div>
          {view.map && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/50" />
              <span className="text-white/50 text-sm">{view.map}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {view.phaseTime > 0 && (
            <div className="px-4 py-2 glass rounded-xl border border-accent-gold/20">
              <span className="text-accent-gold text-sm font-mono font-semibold text-glow-gold">
                {Math.floor(view.phaseTime / 60)}:{(view.phaseTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
          <div className="text-white/30 text-xs font-mono">
            {view.players.length} players
          </div>
        </div>
      </div>
    </div>
  );
}
