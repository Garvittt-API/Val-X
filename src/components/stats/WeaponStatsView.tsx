import { useMatchStore } from "../../store/matchStore";

interface WeaponData {
  name: string;
  kills: number;
  headshots: number;
  hs: number;
  games: number;
}

const WEAPON_TYPES = ["All", "Rifle", "SMG", "Sniper", "Pistol", "Shotgun", "LMG", "Melee"];

export default function WeaponStatsView() {
  const view = useMatchStore((s) => s.view);
  const history = view.history.filter((h) => h.hasStats);

  // Aggregate weapon stats from scoreboards
  const weaponMap = new Map<string, WeaponData>();
  for (const match of history) {
    for (const player of match.scoreboard) {
      if (player.isSelf) continue;
      // We don't have per-weapon data from scoreboards, so we show aggregate
    }
  }

  // Show aggregate combat stats instead
  const totalKills = history.reduce((s, h) => s + h.kills, 0);
  const totalDeaths = history.reduce((s, h) => s + h.deaths, 0);
  const totalAssists = history.reduce((s, h) => s + h.assists, 0);
  const totalHs = history.reduce((s, h) => s + h.hs, 0);
  const totalDamage = history.reduce((s, h) => s + h.totalDamage, 0);
  const totalRounds = history.reduce((s, h) => s + h.selfRounds + h.enemyRounds, 0);
  const avgHs = history.length > 0 ? Math.round(totalHs / history.length) : 0;
  const avgDamage = totalRounds > 0 ? Math.round(totalDamage / totalRounds) : 0;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">WEAPON_STATS</span>
        <span className="micro-label">COMBAT_OVERVIEW</span>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-6 gap-px bg-white/[0.08] fade-up">
        <StatCell label="TOTAL KILLS" value={`${totalKills}`} />
        <StatCell label="TOTAL DEATHS" value={`${totalDeaths}`} />
        <StatCell label="TOTAL ASSISTS" value={`${totalAssists}`} />
        <StatCell label="AVG HS%" value={`${avgHs}%`} highlight />
        <StatCell label="AVG DPR" value={`${avgDamage}`} />
        <StatCell label="TOTAL ROUNDS" value={`${totalRounds}`} />
      </div>

      {/* Combat breakdown */}
      <div className="fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="micro-label mb-3">COMBAT_BREAKDOWN</div>
        <div className="bg-bg-elevated border border-white/[0.12] p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="micro-label mb-1">K/D RATIO</div>
              <div className="display-text text-2xl font-light text-white/80">
                {totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : "—"}
              </div>
            </div>
            <div>
              <div className="micro-label mb-1">KAST</div>
              <div className="display-text text-2xl font-light text-white/80">
                {history.length > 0 ? Math.round(history.reduce((s, h) => s + h.kast, 0) / history.length) : 0}%
              </div>
            </div>
            <div>
              <div className="micro-label mb-1">AVG ACS</div>
              <div className="display-text text-2xl font-light text-white/80">
                {history.length > 0 ? Math.round(history.reduce((s, h) => s + h.acs, 0) / history.length) : 0}
              </div>
            </div>
            <div>
              <div className="micro-label mb-1">AVG ADR</div>
              <div className="display-text text-2xl font-light text-white/80">
                {history.length > 0 ? Math.round(history.reduce((s, h) => s + h.adr, 0) / history.length) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat highlights */}
      <div className="fade-up" style={{ animationDelay: "0.15s" }}>
        <div className="micro-label mb-3">COMBAT_HIGHLIGHTS</div>
        <div className="grid grid-cols-4 gap-px bg-white/[0.08]">
          <HighlightCell label="ACES" value={history.reduce((s, h) => s + h.aces, 0)} icon="5K" />
          <HighlightCell label="CLUTCHES" value={history.reduce((s, h) => s + h.clutches, 0)} icon="1vX" />
          <HighlightCell label="FIRST BLOODS" value={history.reduce((s, h) => s + h.firstBloods, 0)} icon="FB" />
          <HighlightCell label="PLANTS" value={history.reduce((s, h) => s + h.plants, 0)} icon="B" />
        </div>
      </div>

      {/* Attack vs Defense */}
      <div className="fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="micro-label mb-3">SIDE_ANALYSIS</div>
        <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
          <div className="bg-bg-primary p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-neon" />
              <span className="micro-label text-neon/60">ATTACK</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="micro-label mb-0.5">ROUNDS</div>
                <div className="text-sm font-mono text-white/60">
                  {history.reduce((s, h) => s + h.attackRounds, 0)}
                </div>
              </div>
              <div>
                <div className="micro-label mb-0.5">WON</div>
                <div className="text-sm font-mono text-neon">
                  {history.reduce((s, h) => s + h.attackWon, 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-bg-primary p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-err" />
              <span className="micro-label text-err/60">DEFENSE</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="micro-label mb-0.5">ROUNDS</div>
                <div className="text-sm font-mono text-white/60">
                  {history.reduce((s, h) => s + h.defenseRounds, 0)}
                </div>
              </div>
              <div>
                <div className="micro-label mb-0.5">WON</div>
                <div className="text-sm font-mono text-err">
                  {history.reduce((s, h) => s + h.defenseWon, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-primary p-3">
      <div className="micro-label mb-0.5">{label}</div>
      <div className={`text-sm font-mono font-medium ${highlight ? "text-neon" : "text-white/60"}`}>{value}</div>
    </div>
  );
}

function HighlightCell({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-bg-primary p-4 text-center">
      <div className="text-[10px] font-mono text-white/20 mb-2">{icon}</div>
      <div className="display-text text-2xl font-light text-white/80">{value}</div>
      <div className="micro-label mt-1">{label}</div>
    </div>
  );
}
