import { useMatchStore } from "../../store/matchStore";

export default function TrendsView() {
  const view = useMatchStore((s) => s.view);
  const history = view.history.filter((h) => h.hasStats).slice(0, 20);

  if (history.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4 fade-up">
          <span className="display-text text-2xl font-light text-white/80">TRENDS</span>
        </div>
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">DATA</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO TREND DATA</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Play matches to see performance trends</div>
        </div>
      </div>
    );
  }

  // Compute stats
  const avgKills = Math.round(history.reduce((s, h) => s + h.kills, 0) / history.length);
  const avgDeaths = Math.round(history.reduce((s, h) => s + h.deaths, 0) / history.length);
  const avgAssists = Math.round(history.reduce((s, h) => s + h.assists, 0) / history.length);
  const avgAcs = Math.round(history.reduce((s, h) => s + h.acs, 0) / history.length);
  const avgHs = Math.round(history.reduce((s, h) => s + h.hs, 0) / history.length);
  const avgAdr = Math.round(history.reduce((s, h) => s + h.adr, 0) / history.length);
  const avgKast = Math.round(history.reduce((s, h) => s + h.kast, 0) / history.length);
  const wins = history.filter((h) => h.won).length;
  const winRate = Math.round((wins / history.length) * 100);
  const totalRr = history.reduce((s, h) => s + h.rrChange, 0);

  // Find max values for scaling bars
  const maxAcs = Math.max(...history.map((h) => h.acs), 1);
  const maxKills = Math.max(...history.map((h) => h.kills), 1);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">TRENDS</span>
        <span className="micro-label">LAST {history.length} MATCHES</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-7 gap-px bg-white/[0.08] fade-up" style={{ animationDelay: "0.05s" }}>
        <SummaryCell label="AVG K/D/A" value={`${avgKills}/${avgDeaths}/${avgAssists}`} />
        <SummaryCell label="AVG ACS" value={`${avgAcs}`} />
        <SummaryCell label="AVG HS%" value={`${avgHs}%`} highlight />
        <SummaryCell label="AVG ADR" value={`${avgAdr}`} />
        <SummaryCell label="AVG KAST" value={`${avgKast}%`} />
        <SummaryCell label="WIN RATE" value={`${winRate}%`} highlight={winRate >= 50} />
        <SummaryCell label="RR TREND" value={totalRr >= 0 ? `+${totalRr}` : `${totalRr}`} highlight={totalRr >= 0} />
      </div>

      {/* Match timeline */}
      <div className="fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="micro-label mb-3">MATCH_TIMELINE</div>
        <div className="bg-bg-elevated border border-white/[0.12] p-4">
          <div className="flex items-end gap-1 h-32">
            {history.slice().reverse().map((match, i) => {
              const height = (match.acs / maxAcs) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  title={`${match.map}: ${match.kills}/${match.deaths}/${match.assists} ACS ${match.acs}`}
                >
                  <div
                    className="w-full transition-all hover:opacity-100 opacity-70"
                    style={{
                      height: `${height}%`,
                      minHeight: "4px",
                      background: match.won ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[8px] font-mono text-white/20">OLDEST</span>
            <span className="text-[8px] font-mono text-white/20">NEWEST</span>
          </div>
        </div>
      </div>

      {/* RR Change chart */}
      <div className="fade-up" style={{ animationDelay: "0.15s" }}>
        <div className="micro-label mb-3">RR_CHANGE</div>
        <div className="bg-bg-elevated border border-white/[0.12] p-4">
          <div className="flex items-center gap-1 h-24">
            {history.slice().reverse().map((match, i) => {
              const maxRr = Math.max(...history.map((h) => Math.abs(h.rrChange)), 1);
              const height = (Math.abs(match.rrChange) / maxRr) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                  title={`${match.rrChange >= 0 ? "+" : ""}${match.rrChange} RR`}
                >
                  <div
                    className="w-full"
                    style={{
                      height: `${height}%`,
                      minHeight: "2px",
                      background: match.rrChange >= 0 ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                      opacity: 0.7,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[8px] font-mono text-white/20">OLDEST</span>
            <span className="text-[8px] font-mono text-white/20">NEWEST</span>
          </div>
        </div>
      </div>

      {/* Win/Loss distribution */}
      <div className="fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="micro-label mb-3">WIN_LOSS_DISTRIBUTION</div>
        <div className="flex gap-px bg-white/[0.08] h-8">
          {history.slice().reverse().map((match, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                background: match.won ? "var(--theme-accent, #2BFF57)" : "#EF4444",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-neon/50">{wins}W</span>
          <span className="text-[9px] font-mono text-err/50">{history.length - wins}L</span>
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-primary p-3">
      <div className="micro-label mb-0.5">{label}</div>
      <div className={`text-xs font-mono font-medium ${highlight ? "text-neon" : "text-white/60"}`}>
        {value}
      </div>
    </div>
  );
}
