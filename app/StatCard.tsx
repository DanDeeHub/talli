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
  change?: number;
  series?: number[];
  tone?: ToneKey;
}) {
  const t = tones[tone];
  const hasChange = typeof change === "number";
  const up = (change ?? 0) >= 0;
  const Trend = up ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = up ? "text-emerald-600" : "text-red-500";

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.iconBox}`}>
          <Icon className="h-6 w-6" />
        </div>
        {hasChange && (
          <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            {up ? "+" : ""}
            {change}%<Trend className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className="mt-4 flex min-h-8 items-start text-xs font-medium uppercase leading-4 tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>

      {series && (
      <div className="mt-auto flex h-12 items-end gap-1.5 pt-5">
        {series.map((h, i) => (
          <div
            key={i}
            className="group relative flex h-full flex-1 items-end"
          >
            <div
              style={{ height: `${h}%` }}
              className={`w-full cursor-pointer rounded-sm transition-opacity group-hover:opacity-70 ${
                i === series.length - 1 ? t.barLast : t.bar
              }`}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              {h}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
