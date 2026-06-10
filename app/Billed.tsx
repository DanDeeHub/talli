"use client";

import { useState } from "react";

type Point = { label: string; value: number; amount: string };
type Range = "Day" | "Month" | "Year";

const ranges: Range[] = ["Day", "Month", "Year"];

const datasets: Record<
  Range,
  { total: string; subtitle: string; points: Point[] }
> = {
  Day: {
    total: "₱142,384.00",
    subtitle: "Bill trends for the last 7 days",
    points: [
      { label: "Mon", value: 40, amount: "₱16,240" },
      { label: "Tue", value: 58, amount: "₱23,560" },
      { label: "Wed", value: 50, amount: "₱20,310" },
      { label: "Thu", value: 72, amount: "₱29,250" },
      { label: "Fri", value: 66, amount: "₱26,810" },
      { label: "Sat", value: 84, amount: "₱34,120" },
      { label: "Sun", value: 78, amount: "₱31,690" },
    ],
  },
  Month: {
    total: "₱982,540.00",
    subtitle: "Bill trends for the last 30 days",
    points: [
      { label: "Jun 1", value: 52, amount: "₱168,420" },
      { label: "Jun 8", value: 68, amount: "₱220,160" },
      { label: "Jun 15", value: 61, amount: "₱197,540" },
      { label: "Jun 22", value: 84, amount: "₱271,980" },
      { label: "Jun 29", value: 90, amount: "₱291,440" },
    ],
  },
  Year: {
    total: "₱9,418,200.00",
    subtitle: "Bill trends for the last 12 months",
    points: [
      { label: "Jan", value: 48, amount: "₱612,300" },
      { label: "Feb", value: 55, amount: "₱701,400" },
      { label: "Mar", value: 62, amount: "₱790,500" },
      { label: "Apr", value: 58, amount: "₱739,800" },
      { label: "May", value: 71, amount: "₱905,600" },
      { label: "Jun", value: 80, amount: "₱1,020,400" },
      { label: "Jul", value: 76, amount: "₱969,200" },
      { label: "Aug", value: 88, amount: "₱1,122,500" },
    ],
  },
};

export default function Billed() {
  const [range, setRange] = useState<Range>("Month");
  const { total, subtitle, points: data } = datasets[range];

  const W = 320;
  const H = 120;
  const max = 100;
  const padY = 8; // keep the curve off the top/bottom edges
  const pts = data.map(({ value }, i) => ({
    fx: data.length === 1 ? 0.5 : i / (data.length - 1),
    fy: 1 - (value / max) * ((H - padY * 2) / H) - padY / H,
  }));
  const line = pts.map(({ fx, fy }) => `${fx * W},${fy * H}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
            Bill Performance
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
            {total}
          </p>
        </div>

        <div className="flex rounded-lg bg-neutral-100 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                range === r
                  ? "bg-white text-primary shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-end">
        <div className="relative h-32 w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="h-full w-full text-primary"
            aria-hidden="true"
          >
            <polygon points={area} fill="currentColor" opacity={0.1} />
            <polyline
              points={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {pts.map(({ fx, fy }, i) => (
            <div
              key={i}
              style={{ left: `${fx * 100}%`, top: `${fy * 100}%` }}
              className="group absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-primary shadow-sm transition-transform group-hover:scale-125" />
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-center opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                <span className="block text-xs font-semibold text-white">
                  {data[i].amount}
                </span>
                <span className="block text-[10px] text-white/60">
                  {data[i].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between">
          {data.map(({ label }) => (
            <span key={label} className="text-xs text-neutral-400">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
