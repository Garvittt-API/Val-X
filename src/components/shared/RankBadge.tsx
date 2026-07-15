import clsx from "clsx";

interface Props {
  tier: number;
  name: string;
  size?: "sm" | "md" | "lg";
  icon?: string;
}

const RANKS: Record<number, { initials: string; bg: string; color: string }> = {
  0: { initials: "UN", bg: "bg-white/5", color: "text-white/40" },
  3: { initials: "IR", bg: "bg-rank-iron", color: "text-white/90" },
  4: { initials: "IR", bg: "bg-rank-iron", color: "text-white/90" },
  5: { initials: "IR", bg: "bg-rank-iron", color: "text-white/90" },
  6: { initials: "BR", bg: "bg-rank-bronze", color: "text-white/90" },
  7: { initials: "BR", bg: "bg-rank-bronze", color: "text-white/90" },
  8: { initials: "BR", bg: "bg-rank-bronze", color: "text-white/90" },
  9: { initials: "SV", bg: "bg-rank-silver", color: "text-white/90" },
  10: { initials: "SV", bg: "bg-rank-silver", color: "text-white/90" },
  11: { initials: "SV", bg: "bg-rank-silver", color: "text-white/90" },
  12: { initials: "GD", bg: "bg-rank-gold", color: "text-white/90" },
  13: { initials: "GD", bg: "bg-rank-gold", color: "text-white/90" },
  14: { initials: "GD", bg: "bg-rank-gold", color: "text-white/90" },
  15: { initials: "PL", bg: "bg-rank-platinum", color: "text-white/90" },
  16: { initials: "PL", bg: "bg-rank-platinum", color: "text-white/90" },
  17: { initials: "PL", bg: "bg-rank-platinum", color: "text-white/90" },
  18: { initials: "DM", bg: "bg-rank-diamond", color: "text-white/90" },
  19: { initials: "DM", bg: "bg-rank-diamond", color: "text-white/90" },
  20: { initials: "DM", bg: "bg-rank-diamond", color: "text-white/90" },
  21: { initials: "AS", bg: "bg-rank-ascendant", color: "text-white/90" },
  22: { initials: "AS", bg: "bg-rank-ascendant", color: "text-white/90" },
  23: { initials: "AS", bg: "bg-rank-ascendant", color: "text-white/90" },
  24: { initials: "IM", bg: "bg-rank-immortal", color: "text-white/90" },
  25: { initials: "IM", bg: "bg-rank-immortal", color: "text-white/90" },
  26: { initials: "IM", bg: "bg-rank-immortal", color: "text-white/90" },
  27: { initials: "RA", bg: "bg-rank-radiant", color: "text-white/90" },
};

const SIZE_CLASSES = {
  sm: "w-6 h-6 text-[8px]",
  md: "w-8 h-8 text-[9px]",
  lg: "w-11 h-11 text-[11px]",
};

export default function RankBadge({ tier, name, size = "md", icon }: Props) {
  const rank = RANKS[tier] || RANKS[0];

  return (
    <div
      className={clsx(
        "flex items-center justify-center font-bold border border-white/10 overflow-hidden",
        rank.bg,
        rank.color,
        SIZE_CLASSES[size]
      )}
      title={name}
    >
      {icon ? (
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      ) : (
        rank.initials
      )}
    </div>
  );
}
