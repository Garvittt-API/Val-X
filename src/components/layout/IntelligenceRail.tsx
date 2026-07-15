import { useMatchStore } from "../../store/matchStore";

export default function IntelligenceRail() {
  const view = useMatchStore((s) => s.view);
  const me = view.me;

  return (
    <aside className="w-[320px] border-l border-white/[0.12] bg-bg-primary overflow-y-auto shrink-0">
      {/* Selected Player Profile */}
      <div className="p-4 border-b border-white/[0.12]">
        <div className="micro-label mb-3">SELECTED_PLAYER</div>
        {me ? (
          <div>
            {/* Player card art */}
            {me.playerCard && (
              <div className="mb-3 h-20 bg-bg-surface border border-white/[0.08] overflow-hidden">
                <img src={me.playerCard} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="display-text text-lg font-light text-white/90 mb-1">
              {me.name || "UNKNOWN"}
            </div>
            <div className="micro-label mb-3">{me.rankName || "UNRANKED"}</div>
            <div className="grid grid-cols-2 gap-3">
              <DataCell label="RANK" value={me.rankName} />
              <DataCell label="RR" value={`${me.rr}`} />
              <DataCell label="WIN_RATE" value={`${me.winRate}%`} />
              <DataCell label="GAMES" value={`${me.games}`} />
              <DataCell label="WINS" value={`${me.wins}`} />
              <DataCell label="LEVEL" value={`${me.accountLevel}`} />
              {me.streak !== 0 && (
                <DataCell label="STREAK" value={me.streak > 0 ? `+${me.streak}W` : `${me.streak}L`} />
              )}
              {me.rrTrend !== 0 && (
                <DataCell label="RR_TREND" value={me.rrTrend >= 0 ? `+${me.rrTrend}` : `${me.rrTrend}`} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-white/25 text-[11px] font-mono py-10 text-center">
            <div className="text-white/10 text-lg mb-2">—</div>
            NO PLAYER DATA
          </div>
        )}
      </div>

      {/* Activity Status */}
      {view.activity && view.activity !== "Idle" && (
        <div className="p-4 border-b border-white/[0.12]">
          <div className="micro-label mb-2">ACTIVITY</div>
          <div className="text-xs font-mono text-white/50">{view.activity}</div>
          {view.mapImage && (
            <div className="mt-2 h-16 bg-bg-surface border border-white/[0.08] overflow-hidden">
              <img src={view.mapImage} alt={view.map} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Match Logs */}
      <div className="p-4 border-b border-white/[0.12]">
        <div className="micro-label mb-3">MATCH_LOGS</div>
        {view.history.length > 0 ? (
          <div className="space-y-0">
            {view.history.slice(0, 8).map((match, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0"
              >
                <div className="w-px h-8 shrink-0" style={{
                  background: match.won ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                  boxShadow: match.won
                    ? "0 0 8px rgba(43,255,87,0.4)"
                    : "0 0 8px rgba(239,68,68,0.4)",
                }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium text-white/60 truncate">
                    {match.map || "Unknown"}
                  </div>
                  <div className="text-[9px] font-mono text-white/25">
                    {match.kills}/{match.deaths}/{match.assists} • {match.acs} ACS
                  </div>
                </div>
                <div className={`text-[10px] font-mono font-medium ${
                  match.won ? "text-neon" : "text-err"
                }`}>
                  {match.rrChange >= 0 ? "+" : ""}{match.rrChange}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/25 text-[11px] font-mono py-10 text-center">
            <div className="text-white/10 text-lg mb-2">—</div>
            NO MATCH DATA
          </div>
        )}
      </div>

      {/* Telemetry */}
      <div className="p-4">
        <div className="micro-label mb-3">TELEMETRY</div>
        <div className="space-y-2">
          <TelemetryCard label="CONNECTION" value="LOCKFILE" status="green" />
          <TelemetryCard label="WEBSOCKET" value="STANDBY" status="orange" />
          <TelemetryCard label="ENCOUNTERS" value={`${view.players.length} TRACKED`} status="neutral" />
          <TelemetryCard label="OVERLAY" value="DISABLED" status="red" />
        </div>
      </div>
    </aside>
  );
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface border border-white/[0.12] p-2">
      <div className="micro-label mb-0.5">{label}</div>
      <div className="text-xs font-mono text-white/70">{value || "—"}</div>
    </div>
  );
}

function TelemetryCard({ label, value, status }: { label: string; value: string; status: "green" | "red" | "orange" | "neutral" }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-bg-surface border border-white/[0.12] hover:border-white/[0.15] transition-colors">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${
          status === "green" ? "bg-neon" : status === "red" ? "bg-err" : status === "orange" ? "bg-warn" : "bg-white/20"
        }`} />
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-white/50">{value}</span>
    </div>
  );
}
