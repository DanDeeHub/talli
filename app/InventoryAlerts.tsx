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

      {/* Mobile: stacked cards */}
      <div className="mt-4 flex flex-col gap-2 sm:hidden">
        {items.map(({ name, sku, qty, level }) => (
          <div
            key={sku}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-primary/5"
          >
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

      {/* sm and up: table */}
      <div className="mt-4 hidden flow-root sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">SKU</th>
              <th className="pb-2 text-right font-medium">Stock</th>
              <th className="pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map(({ name, sku, qty, level }) => (
              <tr
                key={sku}
                className="cursor-pointer transition-colors hover:bg-primary/5"
              >
                <td className="rounded-l-lg py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <WarehouseIcon className="h-4 w-4" />
                    </span>
                    <span className="block max-w-[10rem] truncate font-medium text-neutral-900">
                      {name}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-neutral-500">{sku}</td>
                <td className="py-3 text-right font-medium text-neutral-900">
                  {qty}
                </td>
                <td className="rounded-r-lg py-3 pr-2 text-right">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${levelStyles[level]}`}
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
