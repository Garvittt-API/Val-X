import clsx from "clsx";

interface Props {
  tier: number;
  name: string;
  size?: "sm" | "md" | "lg";
}

const rankColors: Record<number, { bg: string; glow: string }> = {
  0: { bg: "bg-gray-600", glow: "" },
  3: { bg: "bg-rank-iron", glow: "shadow-[0_0_12px_rgba(104,112,122,0.3)]" },
  4: { bg: "bg-rank-iron", glow: "shadow-[0_0_12px_rgba(104,112,122,0.3)]" },
  5: { bg: "bg-rank-iron", glow: "shadow-[0_0_12px_rgba(104,112,122,0.3)]" },
  6: { bg: "bg-rank-bronze", glow: "shadow-[0_0_12px_rgba(205,127,78,0.3)]" },
  7: { bg: "bg-rank-bronze", glow: "shadow-[0_0_12px_rgba(205,127,78,0.3)]" },
  8: { bg: "bg-rank-bronze", glow: "shadow-[0_0_12px_rgba(205,127,78,0.3)]" },
  9: { bg: "bg-rank-silver", glow: "shadow-[0_0_12px_rgba(140,155,176,0.3)]" },
  10: { bg: "bg-rank-silver", glow: "shadow-[0_0_12px_rgba(140,155,176,0.3)]" },
  11: { bg: "bg-rank-silver", glow: "shadow-[0_0_12px_rgba(140,155,176,0.3)]" },
  12: { bg: "bg-rank-gold", glow: "shadow-[0_0_12px_rgba(201,167,56,0.3)]" },
  13: { bg: "bg-rank-gold", glow: "shadow-[0_0_12px_rgba(201,167,56,0.3)]" },
  14: { bg: "bg-rank-gold", glow: "shadow-[0_0_12px_rgba(201,167,56,0.3)]" },
  15: { bg: "bg-rank-platinum", glow: "shadow-[0_0_12px_rgba(0,184,169,0.3)]" },
  16: { bg: "bg-rank-platinum", glow: "shadow-[0_0_12px_rgba(0,184,169,0.3)]" },
  17: { bg: "bg-rank-platinum", glow: "shadow-[0_0_12px_rgba(0,184,169,0.3)]" },
  18: { bg: "bg-rank-diamond", glow: "shadow-[0_0_16px_rgba(74,107,255,0.4)]" },
  19: { bg: "bg-rank-diamond", glow: "shadow-[0_0_16px_rgba(74,107,255,0.4)]" },
  20: { bg: "bg-rank-diamond", glow: "shadow-[0_0_16px_rgba(74,107,255,0.4)]" },
  21: { bg: "bg-rank-ascendant", glow: "shadow-[0_0_16px_rgba(0,200,83,0.4)]" },
  22: { bg: "bg-rank-ascendant", glow: "shadow-[0_0_16px_rgba(0,200,83,0.4)]" },
  23: { bg: "bg-rank-ascendant", glow: "shadow-[0_0_16px_rgba(0,200,83,0.4)]" },
  24: { bg: "bg-rank-immortal", glow: "shadow-[0_0_18px_rgba(255,70,85,0.5)]" },
  25: { bg: "bg-rank-immortal", glow: "shadow-[0_0_18px_rgba(255,70,85,0.5)]" },
  26: { bg: "bg-rank-immortal", glow: "shadow-[0_0_18px_rgba(255,70,85,0.5)]" },
  27: { bg: "bg-rank-radiant", glow: "shadow-[0_0_20px_rgba(255,189,68,0.5)]" },
};

const sizeClasses = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-sm",
};

export default function RankBadge({ tier, name, size = "md" }: Props) {
  const rank = rankColors[tier] || { bg: "bg-gray-600", glow: "" };
  const initials = name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2);

  return (
    <div
      className={clsx(
        "rounded-xl flex items-center justify-center font-bold text-white/90 border border-white/10 transition-all duration-300",
        rank.bg,
        rank.glow,
        sizeClasses[size]
      )}
      title={name}
    >
      {initials || "?"}
    </div>
  );
}
