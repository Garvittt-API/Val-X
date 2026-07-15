import { useMatchStore } from "../../store/matchStore";

const TICKER_ITEMS = [
  "[LIVE_MATCH] Waiting for connection...",
  "[CLIENT_STATUS] Disconnected",
  "[MATCH_OVER] No recent matches",
  "[SYSTEM] ValX v0.1.0 — Industrial Build",
  "[TELEMETRY] Poll interval: 3s",
  "[LOBBY] No active lobby detected",
];

export default function Ticker() {
  const view = useMatchStore((s) => s.view);

  const statusText =
    view.state === "NoGame"
      ? "DISCONNECTED"
      : view.state === "Menu"
        ? "IN MENU"
        : view.state === "PreGame"
          ? "AGENT SELECT"
          : "IN GAME";

  const items = [
    ...TICKER_ITEMS,
    `[CLIENT_STATUS] ${statusText}`,
    `[MODE] ${view.mode || "None"}`,
    `[MAP] ${view.map || "None"}`,
  ];

  const track = items.join("  •  ");

  return (
    <div className="h-6 border-b border-white/[0.12] bg-bg-primary overflow-hidden flex items-center shrink-0">
      <div className="ticker-track whitespace-nowrap">
        <span className="text-[9px] font-mono text-white/20 tracking-wider px-4">
          {track}  •  {track}  •  {track}
        </span>
      </div>
    </div>
  );
}
