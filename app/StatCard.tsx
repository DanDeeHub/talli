import { TrendingUpIcon, TrendingDownIcon } from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

type ToneKey = "accent" | "neutral" | "olive" | "rose" | "steel";
type Tone = { iconBox: string; bar: string; barLast: string };

const tones: Record<ToneKey, Tone> = {
  accent: { iconBox: "bg-accent/10 text-accent", bar: "bg-accent/15", barLast: "bg-accent" },
  neutral: {
    iconBox: "bg-neutral-100 text-neutral-700",
    bar: "bg-neutral-200",
    barLast: "bg-neutral-500",
  },
  olive: {
    iconBox: "bg-[#eef2dd] text-[#7d8f3c]",
    bar: "bg-[#edf1da]",
    barLast: "bg-[#a0b360]",
  },
  rose: {
    iconBox: "bg-[#f5e7ee] text-[#a6516f]",
    bar: "bg-[#f3e2ea]",
    barLast: "bg-[#a6516f]",
  },
  steel: {
    iconBox: "bg-[#e4edf1] text-[#4d7d94]",
    bar: "bg-[#e0eaf0]",
    barLast: "bg-[#4d7d94]",
  },
};

export default function StatCard({
  Icon,
  label,
  value,
  change,
  series,
  tone = "accent",
}: {
  Icon: IconType;
  label: string;
  value: string;
  change: number;
  series: number[];
  tone?: ToneKey;
}) {
  const t = tones[tone];
  const up = change >= 0;
  const Trend = up ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = up ? "text-emerald-600" : "text-red-500";

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.iconBox}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {up ? "+" : ""}
          {change}%<Trend className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>

      <div className="mt-5 flex h-12 items-end gap-1.5">
        {series.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-sm ${
              i === series.length - 1 ? t.barLast : t.bar
            }`}
          />
        ))}
      </div>
    </div>
  );
}
