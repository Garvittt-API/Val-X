import { useThemeStore } from "../../store/themeStore";

export default function ThemesView() {
  const { currentTheme, themes, setTheme } = useThemeStore();

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">THEME_CONFIG</span>
        <span className="micro-label">ACCENT_COLOR</span>
      </div>

      <div className="grid grid-cols-3 gap-px bg-white/[0.08] fade-up" style={{ animationDelay: "0.05s" }}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`p-4 text-left transition-colors ${
              currentTheme.id === theme.id
                ? "bg-bg-elevated"
                : "bg-bg-primary hover:bg-bg-elevated"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4"
                style={{ background: theme.accent, boxShadow: `0 0 12px ${theme.accent}60` }}
              />
              <span className="text-xs font-semibold text-white/70">{theme.name}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1"
                  style={{
                    background: theme.accent,
                    opacity: 0.15 + (i * 0.1),
                  }}
                />
              ))}
            </div>
            <div className="mt-2 text-[9px] font-mono text-white/25">{theme.accent}</div>
            {currentTheme.id === theme.id && (
              <div className="mt-2 micro-label" style={{ color: theme.accent }}>ACTIVE</div>
            )}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="mt-6 fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="micro-label mb-3">PREVIEW</div>
        <div className="bg-bg-elevated border border-white/[0.12] p-4">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: currentTheme.accent, boxShadow: `0 0 12px ${currentTheme.accent}60` }}
            />
            <span className="text-sm font-medium text-white/70">{currentTheme.name}</span>
          </div>
          <div className="flex gap-3">
            <div className="px-3 py-1.5 text-xs font-medium" style={{ background: `${currentTheme.accent}20`, color: currentTheme.accent, border: `1px solid ${currentTheme.accent}30` }}>
              Primary
            </div>
            <div className="px-3 py-1.5 text-xs font-mono text-white/50 border border-white/[0.12]">
              Mono Text
            </div>
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40 border border-white/[0.12]">
              Micro Label
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
