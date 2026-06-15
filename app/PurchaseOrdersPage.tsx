"use client";

import { useEffect, useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptLongIcon,
} from "./icons";
import {
  PurchaseOrder,
  POColKey,
  POStatus,
  poStatuses,
  poColumnLabels,
  poStatusStyles,
  poStatusRank,
  poIconTone,
  poTotal,
  formatPeso,
  formatDate,
} from "./purchaseOrders";

type SortState = { key: POColKey; dir: "asc" | "desc" };

export default function PurchaseOrdersPage({
  orders,
  onNewOrderClick,
  onRowClick,
}: {
  orders: PurchaseOrder[];
  onNewOrderClick: () => void;
  onRowClick: (order: PurchaseOrder) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<POStatus | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: "po", dir: "desc" });

  const sortByColumn = (key: POColKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const sortableTh = (col: POColKey, align: "left" | "right" = "left") => {
    const active = sort.key === col;
    const pad =
      align === "right"
        ? "pl-2 pr-6 text-right"
        : col === "po"
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
          {poColumnLabels[col]}
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
  const visible = orders
    .filter((o) => statusFilter === "All" || o.status === statusFilter)
    .filter(
      (o) =>
        !q ||
        o.poNumber.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q),
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sort.key === "po") cmp = a.poNumber.localeCompare(b.poNumber);
      else if (sort.key === "supplier")
        cmp = a.supplier.localeCompare(b.supplier);
      else if (sort.key === "items") cmp = a.items.length - b.items.length;
      else if (sort.key === "total") cmp = poTotal(a) - poTotal(b);
      else cmp = poStatusRank[a.status] - poStatusRank[b.status];
      return sort.dir === "asc" ? cmp : -cmp;
    });

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [query, statusFilter, sort]);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const firstRow = visible.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(current * PAGE_SIZE, visible.length);

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
              placeholder="Search PO number or supplier"
              className="h-9 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                onBlur={() => setTimeout(() => setFilterOpen(false), 120)}
                className="flex h-9 cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {statusFilter === "All" ? "All status" : statusFilter}
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {filterOpen && (
                <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                  {(["All", ...poStatuses] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setStatusFilter(s);
                        setFilterOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                        statusFilter === s
                          ? "font-medium text-primary"
                          : "text-neutral-700"
                      }`}
                    >
                      {s === "All" ? "All status" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onNewOrderClick}
              aria-label="New Order"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-0 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-3"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                {sortableTh("po")}
                {sortableTh("supplier")}
                {sortableTh("items")}
                {sortableTh("total")}
                {sortableTh("status", "right")}
              </tr>
            </thead>
            <tbody>
              {paged.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => onRowClick(o)}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                >
                  <td className="py-4 pl-5 pr-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${poIconTone[o.status]}`}
                      >
                        <ReceiptLongIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">
                          {o.poNumber}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {formatDate(o.orderedDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-neutral-500">
                    <span className="block max-w-[12rem] truncate">
                      {o.supplier}
                    </span>
                  </td>
                  <td className="px-2 py-4 font-medium text-neutral-900">
                    {o.items.length}{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      {o.items.length === 1 ? "item" : "items"}
                    </span>
                  </td>
                  <td className="px-2 py-4 font-medium text-neutral-900">
                    {formatPeso(poTotal(o))}
                  </td>
                  <td className="px-2 py-4 pr-6 text-right">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${poStatusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">
              No purchase orders match your search.
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Showing {firstRow} to {lastRow} of {visible.length} orders
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(current - 1)}
              disabled={current === 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  n === current
                    ? "bg-primary text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(current + 1)}
              disabled={current === totalPages}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
