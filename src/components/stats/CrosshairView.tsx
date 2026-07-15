import { useState } from "react";

const POPULAR_CROSSHAIRS = [
  { name: "TenZ", code: "0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0e;0;1b;0", agent: "Jett" },
  { name: "Aspas", code: "0;P;c;5;h;0;f;0;0l;3;0o;2;0a;1;0e;0;1b;0", agent: "Raze" },
  { name: "yay", code: "0;P;c;1;h;0;f;0;0l;4;0o;2;0a;1;0e;0;1b;0", agent: "Chamber" },
  { name: "Demon1", code: "0;P;c;8;h;0;f;0;0l;4;0o;2;0a;1;0e;0;1b;0", agent: "Jett" },
  { name: "Chronicle", code: "0;P;c;1;h;0;f;0;0l;3;0o;1;0a;1;0e;0;1b;0", agent: "Sova" },
  { name: "MiniBoo", code: "0;P;c;5;h;0;f;0;0l;2;0o;2;0a;1;0e;0;1b;0", agent: "Yoru" },
];

export default function CrosshairView() {
  const [copied, setCopied] = useState<string | null>(null);
  const [customCode, setCustomCode] = useState("");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">CROSSHAIRS</span>
        <span className="micro-label">POPULAR_CONFIGS</span>
      </div>

      {/* Custom code input */}
      <div className="fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="micro-label mb-2">IMPORT_CROSSHAIR</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Paste crosshair code here..."
            className="flex-1 bg-bg-elevated border border-white/[0.12] px-4 py-2 text-xs font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon/30"
          />
          <button
            onClick={() => handleCopy(customCode)}
            disabled={!customCode}
            className="px-4 py-2 bg-neon/20 text-neon text-[10px] font-bold tracking-wider uppercase border border-neon/30 hover:bg-neon/30 disabled:opacity-40"
          >
            COPY
          </button>
        </div>
      </div>

      {/* Popular crosshairs */}
      <div className="fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="micro-label mb-3">PRO_CROSSHAIRS</div>
        <div className="grid grid-cols-3 gap-px bg-white/[0.08]">
          {POPULAR_CROSSHAIRS.map((ch, i) => (
            <div
              key={i}
              className="bg-bg-primary p-4 hover:bg-bg-elevated transition-colors cursor-pointer"
              onClick={() => handleCopy(ch.code)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">{ch.name}</span>
                <span className="text-[9px] font-mono text-white/25">{ch.agent}</span>
              </div>

              {/* Crosshair preview (simple CSS) */}
              <div className="w-16 h-16 mx-auto mb-3 relative bg-black/30 border border-white/[0.08]">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/60" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-white/60" />
                <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full" />
              </div>

              <div className="text-[9px] font-mono text-white/20 truncate">{ch.code}</div>
              {copied === ch.code && (
                <div className="text-[9px] font-mono text-neon mt-1">COPIED!</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
