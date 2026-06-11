"use client";

import { useEffect, useState } from "react";
import {
  MdOutlineStorefront,
  MdOutlineWarehouse,
  MdOutlineLocalShipping,
} from "react-icons/md";
import { PlusIcon, CloseIcon, SearchIcon } from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

export type ShopStatus = "Active" | "Maintenance";

export type Shop = {
  id: number;
  name: string;
  type: string;
  status: ShopStatus;
  Icon: IconType;
  tone: string;
};

export const initialShops: Shop[] = [
  {
    id: 1,
    name: "Downtown Boutique",
    type: "Primary Retail Location",
    status: "Active",
    Icon: MdOutlineStorefront,
    tone: "bg-[#e4edf1] text-[#4d7d94]",
  },
  {
    id: 2,
    name: "Westside Warehouse",
    type: "Distribution Center",
    status: "Active",
    Icon: MdOutlineWarehouse,
    tone: "bg-[#fdf3e7] text-[#b07d3a]",
  },
  {
    id: 3,
    name: "North Gate Fulfillment",
    type: "Regional Logistics Hub",
    status: "Maintenance",
    Icon: MdOutlineLocalShipping,
    tone: "bg-[#f5e7ee] text-[#a6516f]",
  },
];

export default function ShopSelection({
  shops,
  onSelect,
  onAdd,
}: {
  shops: Shop[];
  onSelect: (shop: Shop) => void;
  onAdd: (shop: Shop) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const visible = shops.filter(
    (s) =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q),
  );

  const create = () => {
    if (!name.trim()) return;
    const shop: Shop = {
      id: Math.max(0, ...shops.map((s) => s.id)) + 1,
      name: name.trim(),
      type: type.trim() || "New Location",
      status: "Active",
      Icon: MdOutlineStorefront,
      tone: "bg-primary/10 text-primary",
    };
    onAdd(shop);
    setName("");
    setType("");
    setOpen(false);
    onSelect(shop);
  };

  return (
    <>
    <div className="mx-auto w-full max-w-3xl">
      {/* Search */}
      <div className="relative mx-auto max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shops"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => onSelect(shop)}
              className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${shop.tone}`}
              >
                <shop.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">
                {shop.name}
              </h3>
              <p className="text-xs text-primary/80">{shop.type}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                Select
                <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}

          {/* Add new shop */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PlusIcon className="h-6 w-6" />
            </span>
            <span className="mt-1 text-base font-semibold text-neutral-900">
              Add New Shop
            </span>
            <span className="text-xs text-primary/80">Expansion &amp; Growth</span>
          </button>
        </div>
      </div>

      {/* Create shop modal */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                Add New Shop
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Shop name <span className="text-[#a6516f]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eastside Cafe"
                  autoFocus
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Location / type
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Primary Retail Location"
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={create}
                disabled={!name.trim()}
                className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
                Create &amp; Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
