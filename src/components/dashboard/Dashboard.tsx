import { useMatchStore } from "../../store/matchStore";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import RankBadge from "../shared/RankBadge";

export default function Dashboard() {
  const view = useMatchStore((s) => s.view);
  const me = view.me;

  return (
    <div className="p-4 space-y-4">
      {/* Self Profile Section */}
      {me && (
        <div className="fade-up">
          <div className="micro-label mb-3">PLAYER_INTEL</div>
          <div className="bg-bg-elevated border border-white/[0.12] p-4">
            <div className="flex items-center gap-5">
              <RankBadge tier={me.rankTier} name={me.rankName} size="lg" icon={me.rankIcon} />
              <div>
                <div className="display-text text-lg font-light text-white/90">{me.name || "UNKNOWN"}</div>
                <div className="micro-label mt-0.5">LEVEL {me.accountLevel}</div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <RankBadge tier={me.peakRankTier} name={me.peakRankName} size="md" icon={me.peakRankIcon} />
                <div className="text-right">
                  <div className="micro-label">PEAK</div>
                  <div className="text-[10px] font-mono text-white/40">{me.peakRankName}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-px bg-white/[0.08] mt-4">
              <ProfileStat label="RR" value={`${me.rr}`} />
              <ProfileStat label="WIN_RATE" value={`${me.winRate}%`} highlight />
              <ProfileStat label="WINS" value={`${me.wins}`} />
              <ProfileStat label="GAMES" value={`${me.games}`} />
            </div>
          </div>
        </div>
      )}

      {/* Current Match Summary */}
      {view.state !== "NoGame" && view.players.length > 0 && (
        <div className="fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="micro-label mb-3">MATCH_SUMMARY</div>
          <div className="bg-bg-elevated border border-white/[0.12]">
            <div className="flex items-center justify-between py-3 px-4 border-b border-white/[0.12]">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                <span className="display-text text-sm text-white/70">{view.mode}</span>
              </div>
              <span className="text-[10px] font-mono text-white/30">{view.map}</span>
              {(view.allyScore > 0 || view.enemyScore > 0) && (
                <span className="font-mono text-sm">
                  <span className="text-neon">{view.allyScore}</span>
                  <span className="text-white/20 mx-1">—</span>
                  <span className="text-err">{view.enemyScore}</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
              <div className="bg-bg-elevated p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                  <span className="micro-label text-neon/60">ALLIES</span>
                </div>
                {view.players
                  .filter((p) => p.team === "Ally")
                  .map((p) => (
                    <div key={p.puuid} className="flex items-center gap-2 py-1.5 text-[10px]">
                      <RankBadge tier={p.rankTier} name={p.rankName} size="sm" icon={p.rankIcon} />
                      <span className="text-white/60 truncate flex-1">{p.name || "Hidden"}</span>
                      <span className="font-mono text-white/25">{p.agent}</span>
                    </div>
                  ))}
              </div>
              <div className="bg-bg-elevated p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-err" />
                  <span className="micro-label text-err/60">ENEMIES</span>
                </div>
                {view.players
                  .filter((p) => p.team === "Enemy")
                  .map((p) => (
                    <div key={p.puuid} className="flex items-center gap-2 py-1.5 text-[10px]">
                      <RankBadge tier={p.rankTier} name={p.rankName} size="sm" icon={p.rankIcon} />
                      <span className="text-white/60 truncate flex-1">{p.name || "Hidden"}</span>
                      <span className="font-mono text-white/25">{p.agent}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Game State */}
      {view.state === "NoGame" && !me && (
        <div className="fade-up flex items-center justify-center py-20">
          <div className="text-center">
            <div className="display-text text-6xl font-thin text-white/[0.06] mb-4">VALX</div>
            <div className="micro-label">AWAITING CLIENT CONNECTION</div>
          </div>
        </div>
      )}

      {/* Recent Performance */}
      {me && view.history.length > 0 && (
        <div className="fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="micro-label mb-3">RECENT_PERFORMANCE</div>
          <div className="grid grid-cols-5 gap-px bg-white/[0.08]">
            <PerfStat label="STREAK" value={me.streak > 0 ? `+${me.streak}W` : me.streak < 0 ? `${me.streak}L` : "0"} />
            <PerfStat label="RECENT_W" value={`${me.recentWins}`} />
            <PerfStat label="RECENT_L" value={`${me.recentLosses}`} />
            <PerfStat label="RR_TREND" value={me.rrTrend >= 0 ? `+${me.rrTrend}` : `${me.rrTrend}`} />
            <PerfStat label="LEADERBOARD" value={me.leaderboard > 0 ? `#${me.leaderboard}` : "—"} />
          </div>
        </div>
      )}

      {/* Overlay Toggle */}
      <div className="fade-up" style={{ animationDelay: "0.25s" }}>
        <div className="micro-label mb-3">OVERLAY</div>
        <OverlayToggle />
      </div>
    </div>
  );
}

function ProfileStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-elevated p-3">
      <div className="micro-label mb-0.5">{label}</div>
      <div className={`text-sm font-mono font-medium ${highlight ? "text-neon" : "text-white/70"}`}>
        {value}
      </div>
    </div>
  );
}

function PerfStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-elevated p-3">
      <div className="micro-label mb-0.5">{label}</div>
      <div className="text-xs font-mono text-white/60">{value}</div>
    </div>
  );
}

function OverlayToggle() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const toggle = async () => {
    try {
      const result = await invoke<boolean>("toggle_overlay");
      setOverlayOpen(result);
    } catch (e) {
      console.error("Failed to toggle overlay:", e);
    }
  };

  return (
    <div className="bg-bg-elevated border border-white/[0.12] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${overlayOpen ? "bg-neon" : "bg-white/20"}`} />
        <span className="text-sm text-white/70">In-Game Overlay</span>
        <span className="text-[10px] font-mono text-white/25">Always-on-top transparent window</span>
      </div>
      <button
        onClick={toggle}
        className={`px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${
          overlayOpen
            ? "bg-err/20 text-err border border-err/30 hover:bg-err/30"
            : "bg-neon/20 text-neon border border-neon/30 hover:bg-neon/30"
        }`}
      >
        {overlayOpen ? "CLOSE" : "OPEN"}
      </button>
    </div>
  );
}
