import { WarehouseIcon } from "./icons";

type Level = "Out of stock" | "Critical" | "Low";

type Item = {
  name: string;
  sku: string;
  qty: number;
  level: Level;
};

const levelStyles: Record<Level, string> = {
  "Out of stock": "bg-[#f5e7ee] text-[#a6516f]",
  Critical: "bg-primary/10 text-primary",
  Low: "bg-[#fdf3e7] text-[#b07d3a]",
};

const items: Item[] = [
  { name: "Arabica Beans 1kg", sku: "SKU-2201", qty: 0, level: "Out of stock" },
  { name: "Paper Cups 12oz", sku: "SKU-1184", qty: 8, level: "Critical" },
  { name: "Oat Milk 1L", sku: "SKU-3390", qty: 14, level: "Low" },
  { name: "Caramel Syrup", sku: "SKU-2776", qty: 19, level: "Low" },
];

export default function InventoryAlerts() {
  return (
    <div className="h-full w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Inventory Alerts
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {items.map(({ name, sku, qty, level }) => (
          <div key={sku} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <WarehouseIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {name}
              </p>
              <p className="text-xs text-neutral-400">
                {sku} · {qty} left
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${levelStyles[level]}`}
            >
              {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
