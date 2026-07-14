import { useMatchStore } from "../../store/matchStore";
import RankBadge from "../shared/RankBadge";
import { Wifi, WifiOff, Users, Trophy, Clock } from "lucide-react";

export default function Dashboard() {
  const view = useMatchStore((s) => s.view);
  const me = view.me;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">{view.activity}</p>
        </div>
        <div className="flex items-center gap-2">
          {view.state !== "NoGame" ? (
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-green-500/20 shadow-glow-green">
              <Wifi size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-red-500/20">
              <WifiOff size={14} className="text-red-400/60" />
              <span className="text-red-400/60 text-xs font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <StatusCard
          icon={<Trophy size={18} />}
          label="Game State"
          value={view.state === "NoGame" ? "Idle" : view.mode || "Menu"}
          color="blue"
        />
        <StatusCard
          icon={<Users size={18} />}
          label="Players"
          value={view.players.length > 0 ? `${view.players.length} in match` : "None"}
          color="cyan"
        />
        <StatusCard
          icon={<Clock size={18} />}
          label="Mode"
          value={view.mode || "Not in queue"}
          color="purple"
        />
      </div>

      {/* Self Profile */}
      {me && (
        <div className="card-3d-inner p-6 neon-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Your Profile</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <RankBadge tier={me.rankTier} name={me.rankName} size="lg" />
              <div className="absolute -inset-2 bg-accent-blue/10 rounded-2xl blur-xl pointer-events-none" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-white">{me.name || "Unknown"}</div>
              <div className="text-white/40 text-sm">Level {me.accountLevel}</div>
              <div className="flex gap-6 mt-3">
                <Stat label="RR" value={me.rr.toString()} highlight />
                <Stat label="Win Rate" value={`${me.winRate}%`} />
                <Stat label="Wins" value={me.wins.toString()} />
                <Stat label="Games" value={me.games.toString()} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/30 text-xs mb-2 uppercase tracking-wider">Peak</div>
              <RankBadge tier={me.peakRankTier} name={me.peakRankName} size="md" />
            </div>
          </div>
        </div>
      )}

      {/* Game Status */}
      {view.state !== "NoGame" && (
        <div className="card-3d-inner p-6 neon-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Current Match</h2>
          {view.map && (
            <div className="flex items-center gap-4 mb-5">
              <div className="px-3 py-1.5 glass rounded-lg border border-white/5">
                <span className="text-white/50 text-xs">Map</span>
                <div className="text-white font-medium">{view.map}</div>
              </div>
              {view.allyScore > 0 && (
                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-accent-blue font-bold text-2xl text-glow-blue">{view.allyScore}</span>
                  <div className="w-px h-8 bg-white/10" />
                  <span className="text-accent-red font-bold text-2xl text-glow-red">{view.enemyScore}</span>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent-blue shadow-glow-blue" />
                <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Allies</span>
              </div>
              <div className="space-y-2">
                {view.players
                  .filter((p) => p.team === "Ally")
                  .map((p) => (
                    <div key={p.puuid} className="flex items-center gap-3 py-2 px-3 glass rounded-lg">
                      <RankBadge tier={p.rankTier} name={p.rankName} size="sm" />
                      <span className="text-white text-sm">{p.name || "Hidden"}</span>
                      <span className="text-white/30 text-xs ml-auto">{p.agent}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent-red shadow-glow-red" />
                <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Enemies</span>
              </div>
              <div className="space-y-2">
                {view.players
                  .filter((p) => p.team === "Enemy")
                  .map((p) => (
                    <div key={p.puuid} className="flex items-center gap-3 py-2 px-3 glass rounded-lg">
                      <RankBadge tier={p.rankTier} name={p.rankName} size="sm" />
                      <span className="text-white text-sm">{p.name || "Hidden"}</span>
                      <span className="text-white/30 text-xs ml-auto">{p.agent}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Game State */}
      {view.state === "NoGame" && !me && (
        <div className="card-3d-inner p-16 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 mb-6 shadow-glow-blue">
            <span className="text-3xl font-bold text-accent-blue/60">V</span>
          </div>
          <h2 className="text-xl font-semibold text-white/60 mb-2">Waiting for VALORANT</h2>
          <p className="text-white/30 text-sm max-w-xs mx-auto">
            Launch VALORANT and start a match to see live data
          </p>
        </div>
      )}
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, { bg: string; border: string; glow: string; icon: string }> = {
    blue: {
      bg: "from-blue-500/8 to-blue-600/3",
      border: "border-blue-500/15",
      glow: "shadow-glow-blue",
      icon: "text-blue-400",
    },
    cyan: {
      bg: "from-cyan-500/8 to-cyan-600/3",
      border: "border-cyan-500/15",
      glow: "shadow-glow-cyan",
      icon: "text-cyan-400",
    },
    purple: {
      bg: "from-purple-500/8 to-purple-600/3",
      border: "border-purple-500/15",
      glow: "shadow-glow-purple",
      icon: "text-purple-400",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <div
      className={`bg-gradient-to-br ${c.bg} glass rounded-xl p-5 border ${c.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-depth-md group`}
    >
      <div className={`flex items-center gap-2 mb-3 ${c.icon} opacity-70`}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-white font-semibold text-lg">{value}</div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "stat-highlight rounded-lg px-3 py-1.5 -mx-3 -my-1.5" : ""}>
      <div className="text-white/30 text-[10px] uppercase tracking-wider">{label}</div>
      <div className={`font-semibold ${highlight ? "text-accent-blue text-glow-blue" : "text-white"}`}>{value}</div>
    </div>
  );
}
