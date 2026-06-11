"use client";

import { useEffect, useState } from "react";
import {
  SearchIcon,
  InventoryIcon,
  PlusIcon,
  DeleteIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "./icons";

type Status = "Out of stock" | "Critical" | "Low Stock" | "In Stock";

const statusStyles: Record<Status, string> = {
  "Out of stock": "bg-[#f5e7ee] text-[#a6516f]",
  Critical: "bg-primary/10 text-primary",
  "Low Stock": "bg-[#e4edf1] text-[#4d7d94]",
  "In Stock": "bg-[#eef2dd] text-[#7d8f3c]",
};

type Unit = string;

type Product = {
  id: number;
  name: string;
  desc: string;
  category: string;
  stock: number;
  unit: Unit;
  total: number;
  price: string;
  status: Status;
  thumb: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Arabica Beans 1kg",
    desc: "Direct from Brazil Highlands",
    category: "Beverage",
    stock: 0,
    unit: "kg",
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
    unit: "pcs",
    total: 100,
    price: "₱420.00",
    status: "Critical",
    thumb: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    name: "Oat Milk 1L",
    desc: "Dairy-free Alternative",
    category: "Dairy",
    stock: 42,
    unit: "ml",
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
    unit: "ml",
    total: 200,
    price: "₱350.00",
    status: "In Stock",
    thumb: "bg-[#eef2dd] text-[#7d8f3c]",
  },
  {
    id: 5,
    name: "Robusta Beans 1kg",
    desc: "Bold Vietnamese roast",
    category: "Beverage",
    stock: 340,
    unit: "kg",
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
    unit: "ml",
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
    unit: "pcs",
    total: 120,
    price: "₱95.00",
    status: "In Stock",
    thumb: "bg-[#eef2dd] text-[#7d8f3c]",
  },
  {
    id: 8,
    name: "Whole Milk 1L",
    desc: "Fresh full cream",
    category: "Dairy",
    stock: 9,
    unit: "ml",
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
    unit: "pcs",
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
    unit: "kg",
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

const categories = ["Beverage", "Dairy", "Additives", "Disposables"];

const units: Unit[] = ["kg", "ml", "pcs"];

const categoryThumb: Record<string, string> = {
  "Beverage": "bg-[#fdf3e7] text-[#b07d3a]",
  "Dairy": "bg-[#e4edf1] text-[#4d7d94]",
  Additives: "bg-[#eef2dd] text-[#7d8f3c]",
  Disposables: "bg-primary/10 text-primary",
};

const tonePalette = [
  "bg-[#fdf3e7] text-[#b07d3a]",
  "bg-[#e4edf1] text-[#4d7d94]",
  "bg-[#eef2dd] text-[#7d8f3c]",
  "bg-primary/10 text-primary",
  "bg-[#f5e7ee] text-[#a6516f]",
];

// Known categories keep their tone; anything user-created gets a stable
// color picked from the palette by name.
const thumbForCategory = (category: string) => {
  if (categoryThumb[category]) return categoryThumb[category];
  const key = category.trim();
  if (!key) return "bg-primary/10 text-primary";
  let h = 0;
  for (let i = 0; i < key.length; i++) h += key.charCodeAt(i);
  return tonePalette[h % tonePalette.length];
};

const statusFromQty = (qty: number): Status => {
  if (qty <= 0) return "Out of stock";
  if (qty < 10) return "Critical";
  if (qty < 50) return "Low Stock";
  return "In Stock";
};

type SortState = { key: ColKey; dir: "asc" | "desc" };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "name", dir: "asc" });

  // Add Product modal
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    category: "",
    stock: "",
    unit: "kg" as Unit,
    price: "",
  });

  const categoryOptions = Array.from(
    new Set([...categories, ...products.map((p) => p.category)]),
  );
  const catQuery = form.category.trim().toLowerCase();
  const filteredCategories = categoryOptions.filter((c) =>
    c.toLowerCase().includes(catQuery),
  );
  const showCreateCategory =
    form.category.trim() !== "" &&
    !categoryOptions.some((c) => c.toLowerCase() === catQuery);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSave =
    form.name.trim() !== "" &&
    form.category.trim() !== "" &&
    form.price.trim() !== "";

  const addProduct = () => {
    if (!canSave) return;
    const stock = Math.max(0, Math.round(Number(form.stock) || 0));
    const priceValue = priceNum(form.price);
    setProducts((prev) => [
      {
        id: Math.max(0, ...prev.map((p) => p.id)) + 1,
        name: form.name.trim(),
        desc: form.desc.trim(),
        category: form.category.trim(),
        stock,
        unit: form.unit,
        total: stock,
        price: `₱${priceValue.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        status: statusFromQty(stock),
        thumb: thumbForCategory(form.category),
      },
      ...prev,
    ]);
    setForm({
      name: "",
      desc: "",
      category: "",
      stock: "",
      unit: "kg",
      price: "",
    });
    setOpen(false);
  };

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
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
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

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${thumbForCategory(
                    form.category,
                  )}`}
                >
                  <InventoryIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Add Product
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Add a new item to your inventory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Item name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Please enter item name"
                  autoFocus
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Description
                </label>
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Please enter item description"
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => {
                      set("category", e.target.value);
                      setCatOpen(true);
                    }}
                    onFocus={() => setCatOpen(true)}
                    onBlur={() => setTimeout(() => setCatOpen(false), 120)}
                    placeholder="Please choose or create a category"
                    className="h-10 w-full rounded-lg border border-neutral-200 pl-3 pr-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <ChevronDownIcon
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                      catOpen ? "rotate-180" : ""
                    }`}
                  />

                  {catOpen && (filteredCategories.length > 0 || showCreateCategory) && (
                    <div className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                      {filteredCategories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            set("category", c);
                            setCatOpen(false);
                          }}
                          className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          {c}
                        </button>
                      ))}

                      {showCreateCategory && (
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            set("category", form.category.trim());
                            setCatOpen(false);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                        >
                          <PlusIcon className="h-4 w-4 shrink-0" />
                          Create &ldquo;{form.category.trim()}&rdquo; category
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Quantity
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min={0}
                      value={form.stock}
                      onChange={(e) => set("stock", e.target.value)}
                      placeholder="0"
                      className="h-10 min-w-0 flex-1 rounded-l-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setUnitOpen((v) => !v)}
                        onBlur={() => setTimeout(() => setUnitOpen(false), 120)}
                        className="flex h-10 w-20 cursor-pointer items-center justify-between gap-1 rounded-r-lg border border-l-0 border-neutral-200 bg-neutral-50 px-2 text-sm text-neutral-700 outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      >
                        {form.unit}
                        <ChevronDownIcon
                          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                            unitOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {unitOpen && (
                        <div className="absolute right-0 z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                          {units.map((u) => (
                            <button
                              key={u}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                set("unit", u);
                                setUnitOpen(false);
                              }}
                              className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                                form.unit === u
                                  ? "font-medium text-primary"
                                  : "text-neutral-700"
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Unit price
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                      ₱
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      placeholder="0.00"
                      className="h-10 w-full rounded-lg border border-neutral-200 pl-7 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                Status is set automatically from the quantity you enter.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
              <button
                onClick={() => setOpen(false)}
                className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
                disabled={!canSave}
                className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
