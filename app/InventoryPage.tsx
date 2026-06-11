"use client";

import { useState } from "react";
import StatCard from "./StatCard";
import {
  PaymentsIcon,
  SearchIcon,
  InventoryIcon,
  WarehouseIcon,
  TrendingDownIcon,
  PlusIcon,
  DeleteIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./icons";

type Status = "Out of stock" | "Critical" | "Low Stock" | "In Stock";

const statusStyles: Record<Status, string> = {
  "Out of stock": "bg-[#f5e7ee] text-[#a6516f]",
  Critical: "bg-primary/10 text-primary",
  "Low Stock": "bg-[#e4edf1] text-[#4d7d94]",
  "In Stock": "bg-[#eef2dd] text-[#7d8f3c]",
};

type Product = {
  id: number;
  name: string;
  desc: string;
  category: string;
  stock: number;
  total: number;
  price: string;
  status: Status;
  thumb: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Arabica Beans 1kg",
    desc: "Direct from Brazil Highlands",
    category: "Beverage/Raw",
    stock: 0,
    total: 500,
    price: "₱1,450.00",
    status: "Out of stock",
    thumb: "bg-[#f5e7ee] text-[#a6516f]",
  },
  {
    id: 2,
    name: "Paper Cups 12oz",
    desc: "Eco-friendly Biodegradable",
    category: "Disposables",
    stock: 8,
    total: 100,
    price: "₱420.00",
    status: "Critical",
    thumb: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    name: "Oat Milk 1L",
    desc: "Dairy-free Alternative",
    category: "Dairy/Alt",
    stock: 42,
    total: 120,
    price: "₱185.00",
    status: "Low Stock",
    thumb: "bg-[#e4edf1] text-[#4d7d94]",
  },
  {
    id: 4,
    name: "Caramel Syrup",
    desc: "Signature Sweetener",
    category: "Additives",
    stock: 192,
    total: 200,
    price: "₱350.00",
    status: "In Stock",
    thumb: "bg-[#eef2dd] text-[#7d8f3c]",
  },
  {
    id: 5,
    name: "Robusta Beans 1kg",
    desc: "Bold Vietnamese roast",
    category: "Beverage/Raw",
    stock: 340,
    total: 500,
    price: "₱1,180.00",
    status: "In Stock",
    thumb: "bg-[#fdf3e7] text-[#b07d3a]",
  },
  {
    id: 6,
    name: "Vanilla Syrup",
    desc: "Madagascar Vanilla",
    category: "Additives",
    stock: 36,
    total: 150,
    price: "₱340.00",
    status: "Low Stock",
    thumb: "bg-[#e4edf1] text-[#4d7d94]",
  },
  {
    id: 7,
    name: "Espresso Cups 4oz",
    desc: "Ceramic, dishwasher safe",
    category: "Disposables",
    stock: 96,
    total: 120,
    price: "₱95.00",
    status: "In Stock",
    thumb: "bg-[#eef2dd] text-[#7d8f3c]",
  },
  {
    id: 8,
    name: "Whole Milk 1L",
    desc: "Fresh full cream",
    category: "Dairy/Alt",
    stock: 9,
    total: 100,
    price: "₱110.00",
    status: "Critical",
    thumb: "bg-primary/10 text-primary",
  },
  {
    id: 9,
    name: "Napkins Pack 200s",
    desc: "Recycled 2-ply",
    category: "Disposables",
    stock: 410,
    total: 500,
    price: "₱85.00",
    status: "In Stock",
    thumb: "bg-[#eef2dd] text-[#7d8f3c]",
  },
  {
    id: 10,
    name: "Cocoa Powder 500g",
    desc: "Dutch-processed",
    category: "Additives",
    stock: 0,
    total: 200,
    price: "₱520.00",
    status: "Out of stock",
    thumb: "bg-[#f5e7ee] text-[#a6516f]",
  },
];

type ColKey = "name" | "category" | "quantity" | "price" | "status";

const columnLabels: Record<ColKey, string> = {
  name: "Item Name",
  category: "Category",
  quantity: "Quantity",
  price: "Unit Price",
  status: "Status",
};

const statusRank: Record<Status, number> = {
  "Out of stock": 0,
  Critical: 1,
  "Low Stock": 2,
  "In Stock": 3,
};

const priceNum = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

type SortState = { key: ColKey; dir: "asc" | "desc" };

export default function InventoryPage() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
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
    return (
      <th className={`px-2 py-3 ${align === "right" ? "pr-6 text-right" : ""}`}>
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
    else if (sort.key === "category") cmp = a.category.localeCompare(b.category);
    else if (sort.key === "quantity") cmp = a.stock - b.stock;
    else if (sort.key === "price") cmp = priceNum(a.price) - priceNum(b.price);
    else cmp = statusRank[a.status] - statusRank[b.status];
    return sort.dir === "asc" ? cmp : -cmp;
  });
  const allSelected =
    visible.length > 0 && visible.every((p) => selected.has(p.id));

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) visible.forEach((p) => next.delete(p.id));
      else visible.forEach((p) => next.add(p.id));
      return next;
    });

  const toggleOne = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          Icon={PaymentsIcon}
          label="Total Stock Value"
          value="₱1,248,384.00"
          change={12.5}
          series={[48, 52, 60, 58, 72, 80, 95]}
          tone="rose"
        />

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e7ee] text-[#a6516f]">
              <WarehouseIcon className="h-6 w-6" />
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-red-500">
              -3.2%
              <TrendingDownIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Out of Stock Items
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            14
          </p>
          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-[#a6516f]">
            <span className="h-2 w-2 rounded-full bg-[#a6516f]" />
            Requires immediate attention
          </p>
        </div>

        <StatCard
          Icon={InventoryIcon}
          label="Stocks"
          value="1,280"
          series={[35, 42, 38, 55, 60, 72, 88]}
          tone="olive"
        />
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Search + actions */}
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item name or description"
              className="h-9 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={selected.size === 0}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#a6516f]/30 bg-white px-3 text-sm font-medium text-[#a6516f] transition-colors hover:bg-[#f5e7ee] disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-white disabled:text-neutral-300 disabled:hover:bg-white enabled:cursor-pointer"
            >
              <DeleteIcon className="h-4 w-4" />
              Delete
              {selected.size > 0 && ` (${selected.size})`}
            </button>
            <button className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <PlusIcon className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                </th>
                {sortableTh("name")}
                {sortableTh("category")}
                {sortableTh("quantity")}
                {sortableTh("price")}
                {sortableTh("status", "right")}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const isSel = selected.has(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-primary/5 ${
                      isSel ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    <td className="px-4 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleOne(p.id)}
                        aria-label={`Select ${p.name}`}
                        className="h-4 w-4 cursor-pointer accent-primary"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${p.thumb}`}
                        >
                          <InventoryIcon className="h-5 w-5" />
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
                        units
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

        {/* Footer / pagination */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
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
