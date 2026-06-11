import { InventoryIcon } from "./icons";

type Level = "Out of stock" | "Critical" | "Low Stock";

type Unit = "kg" | "ml" | "pcs";

type Item = {
  name: string;
  desc: string;
  qty: number;
  unit: Unit;
  level: Level;
  thumb: string;
};

const levelStyles: Record<Level, string> = {
  "Out of stock": "bg-[#f5e7ee] text-[#a6516f]",
  Critical: "bg-primary/10 text-primary",
  "Low Stock": "bg-[#e4edf1] text-[#4d7d94]",
};

const items: Item[] = [
  { name: "Arabica Beans 1kg", desc: "Direct from Brazil Highlands", qty: 0, unit: "kg", level: "Out of stock", thumb: "bg-[#f5e7ee] text-[#a6516f]" },
  { name: "Paper Cups 12oz", desc: "Eco-friendly Biodegradable", qty: 8, unit: "pcs", level: "Critical", thumb: "bg-primary/10 text-primary" },
  { name: "Oat Milk 1L", desc: "Dairy-free Alternative", qty: 14, unit: "ml", level: "Low Stock", thumb: "bg-[#fdf3e7] text-[#b07d3a]" },
  { name: "Caramel Syrup", desc: "Signature Sweetener", qty: 19, unit: "ml", level: "Low Stock", thumb: "bg-[#eef2dd] text-[#7d8f3c]" },
];

export default function InventoryAlerts() {
  return (
    <div className="h-full w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Inventory Alerts
      </h2>

      {/* Mobile: stacked cards */}
      <div className="mt-4 flex flex-col gap-2 sm:hidden">
        {items.map(({ name, desc, qty, unit, level, thumb }) => (
          <div
            key={name}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-primary/5"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${thumb}`}
            >
              <InventoryIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {name}
              </p>
              <p className="truncate text-xs text-neutral-400">{desc}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs font-medium text-neutral-500">
                {qty} {unit}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelStyles[level]}`}
              >
                {level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* sm and up: table */}
      <div className="mt-4 hidden flow-root sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="pb-2 pl-2 font-medium">Item Name</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 pr-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ name, desc, qty, unit, level, thumb }) => (
              <tr
                key={name}
                className="cursor-pointer transition-colors hover:bg-primary/5"
              >
                <td className="rounded-l-lg py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${thumb}`}
                    >
                      <InventoryIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="max-w-[10rem] truncate font-semibold text-neutral-900">
                        {name}
                      </p>
                      <p className="max-w-[10rem] truncate text-xs text-neutral-400">
                        {desc}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 font-medium text-neutral-900">
                  {qty}{" "}
                  <span className="text-xs font-normal text-neutral-400">
                    {unit}
                  </span>
                </td>
                <td className="rounded-r-lg py-3 pr-2 text-right">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${levelStyles[level]}`}
                  >
                    {level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
