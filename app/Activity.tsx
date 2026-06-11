"use client";

import { useEffect, useRef, useState } from "react";
import {
  HistoryIcon,
  InventoryIcon,
  PaymentsIcon,
  PendingActionsIcon,
  PersonAddIcon,
  CloseIcon,
} from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

type Activity = {
  id: number;
  Icon: IconType;
  tone: string;
  title: string;
  text: string;
  time: string;
};

const log: Activity[] = [
  {
    id: 1,
    Icon: PaymentsIcon,
    tone: "bg-[#eef2dd] text-[#7d8f3c]",
    title: "Payment received",
    text: "Invoice #1042 was paid in full.",
    time: "2:14 PM",
  },
  {
    id: 2,
    Icon: InventoryIcon,
    tone: "bg-[#f5e7ee] text-[#a6516f]",
    title: "Low stock",
    text: "Arabica Beans 1kg marked out of stock.",
    time: "11:30 AM",
  },
  {
    id: 3,
    Icon: PendingActionsIcon,
    tone: "bg-[#e4edf1] text-[#4d7d94]",
    title: "New purchase order",
    text: "PO-1041 placed with Northwind Traders.",
    time: "Yesterday",
  },
  {
    id: 4,
    Icon: PersonAddIcon,
    tone: "bg-primary/10 text-primary",
    title: "Team member joined",
    text: "Liza Tan accepted your invite.",
    time: "Yesterday",
  },
  {
    id: 5,
    Icon: InventoryIcon,
    tone: "bg-[#fdf3e7] text-[#b07d3a]",
    title: "Restock complete",
    text: "Oat Milk 1L restocked (14 units).",
    time: "2 days ago",
  },
];

export default function Activity() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrawerOpen(false);
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const renderRow = (a: Activity) => (
    <button
      key={a.id}
      type="button"
      className="flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-neutral-50"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${a.tone}`}
      >
        <a.Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-neutral-900">
            {a.title}
          </span>
          <span className="shrink-0 text-[11px] text-neutral-400">
            {a.time}
          </span>
        </div>
        <p className="truncate text-xs text-neutral-500">{a.text}</p>
      </div>
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Activity"
        aria-label="Activity"
        aria-expanded={open}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
          open ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        <HistoryIcon className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed inset-x-3 top-[4.5rem] z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/[0.02] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 sm:origin-top-right">
          <div className="border-b border-neutral-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-neutral-900">Activity</h3>
          </div>

          <div className="max-h-80 overflow-y-auto p-1.5">
            {log.slice(0, 4).map(renderRow)}
          </div>

          <div className="border-t border-neutral-200 p-1.5">
            <button
              onClick={() => {
                setOpen(false);
                setDrawerOpen(true);
              }}
              className="block w-full cursor-pointer rounded-xl py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              View all activity
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-[60] ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-label="Activity"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
            <h2 className="text-lg font-semibold text-neutral-900">
              Activity History
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {log.map(renderRow)}
          </div>
        </div>
      </div>
    </div>
  );
}
