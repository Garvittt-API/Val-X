import { Minus, Square, X } from "lucide-react";

export default function TitleBar() {
  const minimize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().minimize();
    } catch {}
  };

  const toggleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const win = getCurrentWindow();
      if (await win.isMaximized()) {
        await win.unmaximize();
      } else {
        await win.maximize();
      }
    } catch {}
  };

  const close = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch {}
  };

  return (
    <div
      data-tauri-drag-region
      className="h-11 flex items-center justify-between px-5 glass-strong select-none border-b border-white/5 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-transparent to-accent-purple/5 pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10" data-tauri-drag-region>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue/30 to-accent-cyan/20 flex items-center justify-center shadow-glow-blue border border-accent-blue/20">
          <span className="text-accent-blue text-sm font-bold">V</span>
        </div>
        <span className="text-sm font-semibold text-white/90 tracking-wide">ValX</span>
      </div>

      <div className="flex items-center gap-1 relative z-10">
        <button
          onClick={minimize}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-200 group"
        >
          <Minus size={14} className="text-white/50 group-hover:text-white/80 transition-colors" />
        </button>
        <button
          onClick={toggleMaximize}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-200 group"
        >
          <Square size={11} className="text-white/50 group-hover:text-white/80 transition-colors" />
        </button>
        <button
          onClick={close}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-500/20 rounded-lg transition-all duration-200 group"
        >
          <X size={14} className="text-white/50 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
