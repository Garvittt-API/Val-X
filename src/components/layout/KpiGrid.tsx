import { useMatchStore } from "../../store/matchStore";

interface KpiCellProps {
  index: string;
  label: string;
  value: string;
  status?: "green" | "red" | "orange" | "neutral";
  delay?: string;
}

function KpiCell({ index, label, value, status = "neutral", delay = "0s" }: KpiCellProps) {
  return (
    <div
      className="border-r border-white/[0.12] last:border-r-0 p-3 flex flex-col justify-between h-20 hover:bg-white/[0.02] transition-colors fade-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start">
        <span className="micro-label">{index} — {label}</span>
        <span className="micro-label">{index}</span>
      </div>
      <div className="display-text text-2xl font-thin text-white/90 leading-none tracking-tight truncate">
        {value || "—"}
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            status === "green"
              ? "bg-neon"
              : status === "red"
                ? "bg-err"
                : status === "orange"
                  ? "bg-warn"
                  : "bg-white/20"
          }`}
        />
        <span className="micro-label">
          {status === "green"
            ? "ACTIVE"
            : status === "red"
              ? "ERROR"
              : status === "orange"
                ? "WARNING"
                : "IDLE"}
        </span>
      </div>
    </div>
  );
}

export default function KpiGrid() {
  const view = useMatchStore((s) => s.view);

  const stateLabel =
    view.state === "NoGame"
      ? "IDLE"
      : view.state === "Menu"
        ? "MENU"
        : view.state === "PreGame"
          ? "PREGAME"
          : "LIVE";

  const stateStatus =
    view.state === "CoreGame"
      ? "green"
      : view.state === "PreGame"
        ? "orange"
        : "neutral";

  const isConnected = view.state !== "NoGame";

  return (
    <div className="grid grid-cols-6 border-b border-white/[0.12] bg-bg-primary shrink-0">
      <KpiCell index="01" label="LOBBY_STATE" value={stateLabel} status={stateStatus} delay="0s" />
      <KpiCell index="02" label="CLIENT" value={isConnected ? "ONLINE" : "OFFLINE"} status={isConnected ? "green" : "red"} delay="0.05s" />
      <KpiCell index="03" label="MODE" value={view.mode || "—"} status="neutral" delay="0.1s" />
      <KpiCell index="04" label="PLAYERS" value={view.players.length > 0 ? `${view.players.length}` : "—"} status={view.players.length > 0 ? "green" : "neutral"} delay="0.15s" />
      <KpiCell index="05" label="MAP" value={view.map || "—"} status="neutral" delay="0.2s" />
      <KpiCell index="06" label="SCORE" value={view.allyScore > 0 || view.enemyScore > 0 ? `${view.allyScore} — ${view.enemyScore}` : "—"} status={view.allyScore > 0 ? "green" : "neutral"} delay="0.25s" />
    </div>
  );
}
