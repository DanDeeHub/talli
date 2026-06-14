"use client";

import { useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./icons";
import {
  Product,
  ColKey,
  columnLabels,
  statusRank,
  statusStyles,
  priceNum,
  toneForIcon,
  fallbackIcon,
} from "./inventory";

type SortState = { key: ColKey; dir: "asc" | "desc" };

export default function InventoryPage({
  products,
  onAddProductClick,
  onRowClick,
}: {
  products: Product[];
  onAddProductClick: () => void;
  onRowClick: (product: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "name", dir: "asc" });

  const sortByColumn = (key: ColKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const sortableTh = (col: ColKey, align: "left" | "right" = "left") => {
    const active = sort.key === col;
    const pad =
      align === "right"
        ? "pl-2 pr-6 text-right"
        : col === "name"
          ? "pl-5 pr-2"
          : "pl-2 pr-2";
    return (
      <th className={`py-3 ${pad}`}>
        <button
          onClick={() => sortByColumn(col)}
          className={`inline-flex cursor-pointer items-center gap-1 font-medium transition-colors hover:text-neutral-600 ${
            align === "right" ? "flex-row-reverse" : ""
          } ${active ? "text-neutral-700" : ""}`}
        >
          {columnLabels[col]}
          <ChevronDownIcon
            className={`h-3.5 w-3.5 transition-transform ${
              active
                ? `text-neutral-500 ${sort.dir === "asc" ? "rotate-180" : ""}`
                : "text-neutral-300"
            }`}
          />
        </button>
      </th>
    );
  };

  const q = query.trim().toLowerCase();
  const visible = products
    .filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q),
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sort.key === "name") cmp = a.name.localeCompare(b.name);
      else if (sort.key === "category")
        cmp = a.category.localeCompare(b.category);
      else if (sort.key === "quantity") cmp = a.stock - b.stock;
      else if (sort.key === "price") cmp = priceNum(a.price) - priceNum(b.price);
      else cmp = statusRank[a.status] - statusRank[b.status];
      return sort.dir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-neutral-200 p-4 sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item name or description"
              className="h-9 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            onClick={onAddProductClick}
            aria-label="Add Product"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-0 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-3"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                {sortableTh("name")}
                {sortableTh("category")}
                {sortableTh("quantity")}
                {sortableTh("price")}
                {sortableTh("status", "right")}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const RowIcon = p.Icon ?? fallbackIcon;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onRowClick(p)}
                    className="cursor-pointer transition-colors hover:bg-primary/5"
                  >
                    <td className="py-4 pl-5 pr-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneForIcon(
                            RowIcon,
                          )}`}
                        >
                          <RowIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-neutral-900">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-neutral-500">{p.category}</td>
                    <td className="px-2 py-4 font-medium text-neutral-900">
                      {p.stock}{" "}
                      <span className="text-xs font-normal text-neutral-400">
                        {p.unit}
                      </span>
                    </td>
                    <td className="px-2 py-4 font-medium text-neutral-900">
                      {p.price}
                    </td>
                    <td className="px-2 py-4 pr-6 text-right">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Showing 1 to {visible.length} of 124 products
          </p>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  n === 1
                    ? "bg-primary text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
