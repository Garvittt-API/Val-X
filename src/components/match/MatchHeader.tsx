import { useMatchStore } from "../../store/matchStore";

export default function MatchHeader() {
  const view = useMatchStore((s) => s.view);
  const minutes = Math.floor(view.phaseTime / 60);
  const seconds = view.phaseTime % 60;
  const time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-white/[0.12]">
      <div className="flex items-center gap-6">
        {/* Mode */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon" />
          <span className="display-text text-sm font-medium text-white/70">{view.mode || "UNKNOWN"}</span>
        </div>
        {/* Map */}
        {view.map && (
          <span className="text-[10px] font-mono text-white/30">{view.map}</span>
        )}
      </div>
      <div className="flex items-center gap-6">
        {/* Timer */}
        {view.phaseTime > 0 && (
          <span className="text-sm font-mono font-medium text-neon">{time}</span>
        )}
        {/* Player count */}
        <span className="micro-label">{view.players.length} PLAYERS</span>
      </div>
    </div>
  );
}
