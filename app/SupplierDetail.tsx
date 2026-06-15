"use client";

import {
  Product,
  statusStyles,
  toneForIcon,
  fallbackIcon,
  priceNum,
} from "./inventory";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type Activity = {
  by: string;
  tone: string;
  action: string;
  detail: string;
  time: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarTones = [
  "bg-primary/10 text-primary",
  "bg-[#e4edf1] text-[#4d7d94]",
  "bg-[#eef2dd] text-[#7d8f3c]",
  "bg-[#fdf3e7] text-[#b07d3a]",
  "bg-[#f5e7ee] text-[#a6516f]",
  "bg-neutral-100 text-neutral-700",
];

const toneForName = (name: string) => {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return avatarTones[sum % avatarTones.length];
};

const peso = (n: number) =>
  `₱${n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function activityFor(supplier: string, items: Product[]): Activity[] {
  const newest = items[0]?.name ?? "an item";
  return [
    {
      by: "Carlo Reyes",
      tone: "bg-[#eef2dd] text-[#7d8f3c]",
      action: "received a delivery",
      detail: `${items.length} item${items.length === 1 ? "" : "s"} restocked from ${supplier}`,
      time: "2 days ago",
    },
    {
      by: "Maria Santos",
      tone: "bg-primary/10 text-primary",
      action: "linked an item",
      detail: `“${newest}” assigned to this supplier`,
      time: "1 week ago",
    },
    {
      by: "John Doe",
      tone: "bg-[#e4edf1] text-[#4d7d94]",
      action: "updated contact details",
      detail: "Edited the supplier profile",
      time: "3 weeks ago",
    },
    {
      by: "Admin",
      tone: "bg-neutral-100 text-neutral-700",
      action: "added the supplier",
      detail: `${supplier} created`,
      time: "2 months ago",
    },
  ];
}

export default function SupplierDetail({
  supplier,
  products,
  onBack,
  onItemClick,
}: {
  supplier: string;
  products: Product[];
  onBack: () => void;
  onItemClick: (product: Product) => void;
}) {
  const items = products.filter((p) => p.supplier === supplier);
  const totalValue = items.reduce(
    (sum, p) => sum + priceNum(p.price) * p.stock,
    0,
  );
  const categories = Array.from(new Set(items.map((p) => p.category)));
  const activity = activityFor(supplier, items);

  const stats: { label: string; value: string }[] = [
    { label: "Items supplied", value: String(items.length) },
    { label: "Total stock value", value: peso(totalValue) },
    {
      label: "Categories",
      value: categories.length ? String(categories.length) : "—",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-9 items-center">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold ${toneForName(
              supplier,
            )}`}
          >
            {initials(supplier)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-xl font-semibold text-neutral-900">
              {supplier}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">Supplier</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {s.label}
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
          Items from this supplier
        </h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No items are linked to this supplier yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {items.map((p) => {
              const RowIcon = p.Icon ?? fallbackIcon;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onItemClick(p)}
                    className="group flex w-full cursor-pointer items-center gap-3 py-3 text-left transition-colors hover:bg-primary/5"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneForIcon(
                        RowIcon,
                      )}`}
                    >
                      <RowIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-neutral-400">
                        {p.stock} {p.unit} · {p.price}
                      </p>
                    </div>
                    <span
                      className={`hidden shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
          Activity History
        </h3>
        <ul className="mt-5">
          {activity.map((a, i) => (
            <li
              key={i}
              className={`relative ${i !== activity.length - 1 ? "pb-7" : ""}`}
            >
              {i !== activity.length - 1 && (
                <span className="absolute bottom-1 left-5 top-11 w-px -translate-x-1/2 bg-neutral-200" />
              )}
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${a.tone}`}
                >
                  {initials(a.by)}
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-neutral-900">
                      <span className="font-semibold">{a.by}</span> {a.action}
                    </p>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {a.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">{a.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
