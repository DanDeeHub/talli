"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon,
  CloseIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  ReceiptLongIcon,
} from "./icons";
import { Product, suppliers, priceNum } from "./inventory";
import {
  PurchaseOrder,
  POStatus,
  POLineItem,
  poIconTone,
  formatPeso,
  formatDate,
  todayISO,
  nextPoNumber,
} from "./purchaseOrders";

type LineDraft = {
  productId: number | null;
  name: string;
  qty: string;
  unit: string;
  unitPrice: string;
};

const emptyLine = (): LineDraft => ({
  productId: null,
  name: "",
  qty: "",
  unit: "",
  unitPrice: "",
});

const money2 = (n: number) =>
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const currentUser = "John Doe";

export default function PurchaseOrderModal({
  open,
  onClose,
  onCreate,
  onSave,
  onDelete,
  order,
  orders,
  products,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (order: PurchaseOrder) => void;
  onSave?: (order: PurchaseOrder) => void;
  onDelete?: (id: number) => void;
  order?: PurchaseOrder | null;
  orders: PurchaseOrder[];
  products: Product[];
}) {
  const isEdit = Boolean(order);
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState<POStatus>("Pending");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [supOpen, setSupOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [openLine, setOpenLine] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (order) {
      setSupplier(order.supplier);
      setStatus(order.status);
      setLines(
        order.items.map((l) => ({
          productId: l.productId,
          name: l.name,
          qty: String(l.qty),
          unit: l.unit,
          unitPrice: money2(l.unitPrice),
        })),
      );
    } else {
      setSupplier("");
      setStatus("Pending");
      setLines([emptyLine()]);
    }
  }, [open, order]);

  const supplierOptions = Array.from(
    new Set([...suppliers, ...orders.map((o) => o.supplier)]),
  );
  const supQuery = supplier.trim().toLowerCase();
  const filteredSuppliers = supplierOptions.filter((s) =>
    s.toLowerCase().includes(supQuery),
  );
  const showCreateSupplier =
    supplier.trim() !== "" &&
    !supplierOptions.some((s) => s.toLowerCase() === supQuery);

  const updateLine = (idx: number, patch: Partial<LineDraft>) =>
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const pickProduct = (idx: number, p: Product) =>
    updateLine(idx, {
      productId: p.id,
      name: p.name,
      unit: p.unit,
      unitPrice: money2(priceNum(p.price)),
    });

  const addLine = () => setLines((ls) => [...ls, emptyLine()]);
  const removeLine = (idx: number) =>
    setLines((ls) => (ls.length > 1 ? ls.filter((_, i) => i !== idx) : ls));

  const validLines = lines.filter(
    (l) => l.productId != null && Number(l.qty) > 0,
  );
  const total = lines.reduce(
    (sum, l) => sum + (Number(l.qty) || 0) * (priceNum(l.unitPrice) || 0),
    0,
  );
  const canSave = supplier.trim() !== "" && validLines.length > 0;

  const submit = () => {
    if (!canSave) return;
    const items: POLineItem[] = validLines.map((l) => ({
      productId: l.productId as number,
      name: l.name,
      qty:
        l.unit === "pcs"
          ? Math.max(0, Math.round(Number(l.qty) || 0))
          : Math.max(0, Number(l.qty) || 0),
      unit: l.unit,
      unitPrice: Math.max(0, priceNum(l.unitPrice) || 0),
    }));
    if (isEdit && order) {
      onSave?.({ ...order, supplier: supplier.trim(), status, items });
    } else {
      onCreate({
        id: Math.max(0, ...orders.map((o) => o.id)) + 1,
        poNumber: nextPoNumber(orders),
        supplier: supplier.trim(),
        createdBy: currentUser,
        status,
        orderedDate: todayISO(),
        items,
      });
    }
    onClose();
  };

  const remove = () => {
    if (order) onDelete?.(order.id);
    onClose();
  };

  if (!open) return null;

  const productQuery = (idx: number) => lines[idx].name.trim().toLowerCase();
  const filteredProducts = (idx: number) =>
    products.filter((p) => p.name.toLowerCase().includes(productQuery(idx)));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${poIconTone[status]}`}
            >
              <ReceiptLongIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {isEdit ? "Edit Purchase Order" : "New Purchase Order"}
              </h3>
              <p className="text-xs text-neutral-400">
                {isEdit
                  ? `${order?.poNumber} · ${order?.createdBy}`
                  : nextPoNumber(orders)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Supplier <span className="text-[#a6516f]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                  setSupOpen(true);
                }}
                onFocus={() => setSupOpen(true)}
                onBlur={() => setTimeout(() => setSupOpen(false), 120)}
                placeholder="e.g. Acme Supplies"
                className="h-10 w-full rounded-lg border border-neutral-200 pl-3 pr-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <ChevronDownIcon
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                  supOpen ? "rotate-180" : ""
                }`}
              />
              {supOpen && (filteredSuppliers.length > 0 || showCreateSupplier) && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                  {filteredSuppliers.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSupplier(s);
                        setSupOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                        supplier === s
                          ? "font-medium text-primary"
                          : "text-neutral-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  {showCreateSupplier && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSupplier(supplier.trim());
                        setSupOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      <PlusIcon className="h-4 w-4 shrink-0" />
                      Create &ldquo;{supplier.trim()}&rdquo; supplier
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isEdit && (
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen((v) => !v)}
                    onBlur={() => setTimeout(() => setStatusOpen(false), 120)}
                    className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "Paid" ? "bg-[#7d8f3c]" : "bg-[#a6516f]"
                        }`}
                      />
                      {status}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                        statusOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {statusOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                      {(["Pending", "Paid"] as POStatus[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setStatus(s);
                            setStatusOpen(false);
                          }}
                          className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                            status === s
                              ? "font-medium text-primary"
                              : "text-neutral-700"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              s === "Paid" ? "bg-[#7d8f3c]" : "bg-[#a6516f]"
                            }`}
                          />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                PO created
              </label>
              <div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
                {formatDate(isEdit && order ? order.orderedDate : todayISO())}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-500">
              Items <span className="text-[#a6516f]">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <div className="relative min-w-0 sm:flex-1">
                    <input
                      type="text"
                      value={line.name}
                      onChange={(e) => {
                        updateLine(idx, {
                          name: e.target.value,
                          productId: null,
                        });
                        setOpenLine(idx);
                      }}
                      onFocus={() => setOpenLine(idx)}
                      onBlur={() => setTimeout(() => setOpenLine(null), 120)}
                      placeholder="Select a product"
                      className="h-10 w-full rounded-lg border border-neutral-200 pl-3 pr-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <ChevronDownIcon
                      className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                        openLine === idx ? "rotate-180" : ""
                      }`}
                    />
                    {openLine === idx && (
                      <div className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                        {filteredProducts(idx).length > 0 ? (
                          filteredProducts(idx).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                pickProduct(idx, p);
                                setOpenLine(null);
                              }}
                              className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                            >
                              <span className="truncate">{p.name}</span>
                              <span className="shrink-0 text-xs text-neutral-400">
                                {p.price}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-neutral-400">
                            No matching item in inventory
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step={line.unit === "pcs" ? "1" : "any"}
                      value={line.qty}
                      onChange={(e) => updateLine(idx, { qty: e.target.value })}
                      placeholder="Qty"
                      className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-200 px-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 sm:w-16 sm:flex-none"
                    />
                    <span className="w-7 shrink-0 text-center text-xs text-neutral-400">
                      {line.unit}
                    </span>
                    <div className="relative min-w-0 flex-1 sm:w-28 sm:flex-none">
                      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                        ₱
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(idx, { unitPrice: e.target.value })
                        }
                        onBlur={() =>
                          updateLine(idx, {
                            unitPrice:
                              line.unitPrice.trim() === ""
                                ? ""
                                : money2(priceNum(line.unitPrice)),
                          })
                        }
                        placeholder="0.00"
                        className="h-10 w-full rounded-lg border border-neutral-200 pl-6 pr-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      disabled={lines.length === 1}
                      aria-label="Remove item"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-[#f5e7ee] hover:text-[#a6516f] disabled:cursor-not-allowed disabled:opacity-30 enabled:cursor-pointer"
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLine}
              className="mt-2 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/70"
            >
              <PlusIcon className="h-4 w-4" />
              Add item
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-lg font-semibold text-neutral-900">
              {formatPeso(total)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
          <div>
            {isEdit && (
              <button
                onClick={remove}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#a6516f] transition-colors hover:bg-[#f5e7ee]"
              >
                <DeleteIcon className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSave}
              className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
            >
              {isEdit ? (
                <EditIcon className="h-4 w-4" />
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
              {isEdit ? "Save changes" : "Create order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
