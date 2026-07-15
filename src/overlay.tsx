import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useMatchStore } from "./store/matchStore";
import OverlayWindow from "./components/overlay/OverlayWindow";
import "./styles.css";

function OverlayApp() {
  const setView = useMatchStore((s) => s.setView);

  useEffect(() => {
    const unlisten = (window as any).__TAURI__?.event?.listen?.(
      "match-view",
      (event: any) => {
        setView(event.payload);
      }
    );
    return () => {
      unlisten?.then?.((fn: () => void) => fn());
    };
  }, [setView]);

  return (
    <div data-tauri-drag-region className="min-h-screen bg-transparent">
      <OverlayWindow />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<OverlayApp />);
