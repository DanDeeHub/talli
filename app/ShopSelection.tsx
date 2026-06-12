"use client";

import { useEffect, useState } from "react";
import {
  MdOutlineStorefront,
  MdOutlineWarehouse,
  MdOutlineLocalShipping,
  MdOutlineStore,
} from "react-icons/md";
import {
  PlusIcon,
  CloseIcon,
  SearchIcon,
  EditIcon,
  ChevronDownIcon,
} from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

const shopIcons: { Icon: IconType; tone: string }[] = [
  { Icon: MdOutlineStore, tone: "bg-primary/10 text-primary" },
  { Icon: MdOutlineStorefront, tone: "bg-[#e4edf1] text-[#4d7d94]" },
  { Icon: MdOutlineWarehouse, tone: "bg-[#fdf3e7] text-[#b07d3a]" },
  { Icon: MdOutlineLocalShipping, tone: "bg-neutral-100 text-neutral-700" },
];

export type ShopStatus = "Active" | "Maintenance";

export type Shop = {
  id: number;
  name: string;
  type: string;
  status: ShopStatus;
  Icon: IconType;
  tone: string;
  currency: string;
};

export const initialShops: Shop[] = [
  {
    id: 1,
    name: "Downtown Boutique",
    type: "Primary Retail Location",
    status: "Active",
    Icon: MdOutlineStorefront,
    tone: "bg-[#e4edf1] text-[#4d7d94]",
    currency: "PHP",
  },
  {
    id: 2,
    name: "Westside Warehouse",
    type: "Distribution Center",
    status: "Active",
    Icon: MdOutlineWarehouse,
    tone: "bg-[#fdf3e7] text-[#b07d3a]",
    currency: "PHP",
  },
  {
    id: 3,
    name: "North Gate Fulfillment",
    type: "Regional Logistics Hub",
    status: "Maintenance",
    Icon: MdOutlineLocalShipping,
    tone: "bg-neutral-100 text-neutral-700",
    currency: "PHP",
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
  const [iconOpen, setIconOpen] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);
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
    if (!name.trim() || !type.trim()) return;
    const shop: Shop = {
      id: Math.max(0, ...shops.map((s) => s.id)) + 1,
      name: name.trim(),
      type: type.trim(),
      status: "Active",
      Icon: shopIcons[iconIdx].Icon,
      tone: shopIcons[iconIdx].tone,
      currency: "PHP",
    };
    onAdd(shop);
    setName("");
    setType("");
    setIconIdx(0);
    setOpen(false);
    onSelect(shop);
  };

  return (
    <>
    <div className="mx-auto w-full max-w-3xl">
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => onSelect(shop)}
              className="group flex cursor-pointer flex-col rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
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
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
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

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIconOpen((v) => !v)}
                    onBlur={() => setTimeout(() => setIconOpen(false), 120)}
                    title="Choose an icon"
                    className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl outline-none ring-offset-1 transition focus:ring-2 focus:ring-primary/40 ${shopIcons[iconIdx].tone}`}
                  >
                    {(() => {
                      const Picked = shopIcons[iconIdx].Icon;
                      return <Picked className="h-5 w-5" />;
                    })()}
                    <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                      <EditIcon className="h-2.5 w-2.5" />
                    </span>
                  </button>

                  {iconOpen && (
                    <div className="absolute left-0 top-12 z-10 flex gap-1.5 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
                      {shopIcons.map(({ Icon, tone }, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIconIdx(i);
                            setIconOpen(false);
                          }}
                          aria-label={`Icon ${i + 1}`}
                          aria-pressed={iconIdx === i}
                          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition ${tone} ${
                            iconIdx === i
                              ? "ring-2 ring-primary ring-offset-1"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Add New Shop
                </h3>
              </div>
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
                  Location <span className="text-[#a6516f]">*</span>
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Primary Retail Location"
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Currency
                </label>
                <div
                  aria-disabled="true"
                  title="Only PHP is available for now"
                  className="flex h-10 w-full cursor-not-allowed items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-400"
                >
                  <span>₱ PHP</span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-neutral-300" />
                </div>
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
                disabled={!name.trim() || !type.trim()}
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
