import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useMatchStore } from "../../store/matchStore";

interface LoadoutData {
  playerCard: string;
  playerTitle: string;
  weaponSkin: string;
  weaponChroma: string;
  weaponLevel: string;
  buddy: string;
  sprays: string[];
}

export default function LoadoutView() {
  const me = useMatchStore((s) => s.view.me);
  const [loadout, setLoadout] = useState<LoadoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoadout() {
      try {
        const data = await invoke<LoadoutData | null>("get_loadout");
        setLoadout(data);
      } catch {
        // Loadout not available
      } finally {
        setLoading(false);
      }
    }
    fetchLoadout();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 fade-up">
        <span className="display-text text-2xl font-light text-white/80">LOADOUT</span>
        <span className="micro-label">CURRENT_EQUIPMENT</span>
      </div>

      {loading ? (
        <div className="py-20 text-center fade-up">
          <div className="text-[10px] font-mono text-white/20 animate-pulse">LOADING LOADOUT...</div>
        </div>
      ) : !loadout ? (
        <div className="py-24 text-center fade-up">
          <div className="display-text text-4xl font-thin text-white/[0.12] mb-6">GEAR</div>
          <div className="w-12 h-px bg-white/[0.08] mx-auto mb-4" />
          <div className="micro-label mb-2">NO LOADOUT DATA</div>
          <div className="text-[11px] text-white/20 font-mono mt-2">Launch VALORANT to view your equipped skins and items</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Player Card */}
          <div className="fade-up">
            <div className="micro-label mb-3">PLAYER_CARD</div>
            <div className="bg-bg-elevated border border-white/[0.12] p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-32 bg-bg-surface border border-white/[0.12] flex items-center justify-center">
                  {loadout.playerCard ? (
                    <img src={loadout.playerCard} alt="Player Card" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/10 text-xs">NO CARD</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/70">Active Player Card</div>
                  <div className="text-[10px] font-mono text-white/25 mt-1">{loadout.playerCard || "Default"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Weapon Skin */}
          <div className="fade-up" style={{ animationDelay: "0.05s" }}>
            <div className="micro-label mb-3">WEAPON_SKIN</div>
            <div className="bg-bg-elevated border border-white/[0.12] p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-bg-surface border border-white/[0.12] flex items-center justify-center">
                  {loadout.weaponSkin ? (
                    <img src={loadout.weaponSkin} alt="Weapon Skin" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-white/10 text-xs">DEFAULT</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/70">Equipped Skin</div>
                  <div className="text-[10px] font-mono text-white/25 mt-1">{loadout.weaponSkin || "Default Skin"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buddy */}
          <div className="fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="micro-label mb-3">BUDDY</div>
            <div className="bg-bg-elevated border border-white/[0.12] p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-surface border border-white/[0.12] flex items-center justify-center rounded-full">
                  {loadout.buddy ? (
                    <img src={loadout.buddy} alt="Buddy" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-white/10 text-xs">—</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/70">Weapon Buddy</div>
                  <div className="text-[10px] font-mono text-white/25 mt-1">{loadout.buddy || "None"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sprays */}
          <div className="fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="micro-label mb-3">SPRAYS</div>
            <div className="grid grid-cols-5 gap-px bg-white/[0.08]">
              {loadout.sprays.length > 0 ? (
                loadout.sprays.slice(0, 5).map((spray, i) => (
                  <div key={i} className="bg-bg-elevated p-3 flex items-center justify-center h-20">
                    {spray ? (
                      <img src={spray} alt={`Spray ${i + 1}`} className="max-h-full object-contain" />
                    ) : (
                      <span className="text-white/10 text-xs">—</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-bg-elevated p-3 col-span-5 text-center py-8">
                  <span className="text-white/10 text-xs font-mono">NO SPRAYS EQUIPPED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
