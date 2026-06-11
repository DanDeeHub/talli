"use client";

import { useEffect, useState } from "react";
import { PlusIcon, CloseIcon, ChevronDownIcon, EditIcon } from "./icons";
import {
  Product,
  Unit,
  productIcons,
  categories,
  units,
  suppliers,
  statusFromQty,
  priceNum,
} from "./inventory";

export default function AddProductModal({
  open,
  onClose,
  onAdd,
  products,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  products: Product[];
}) {
  const [catOpen, setCatOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [supOpen, setSupOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    category: "",
    supplier: "",
    stock: "",
    unit: "kg" as Unit,
    price: "",
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

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

  const supplierOptions = Array.from(
    new Set([
      ...suppliers,
      ...products
        .map((p) => p.supplier)
        .filter((s): s is string => Boolean(s)),
    ]),
  );
  const supQuery = form.supplier.trim().toLowerCase();
  const filteredSuppliers = supplierOptions.filter((s) =>
    s.toLowerCase().includes(supQuery),
  );
  const showCreateSupplier =
    form.supplier.trim() !== "" &&
    !supplierOptions.some((s) => s.toLowerCase() === supQuery);

  const canSave =
    form.name.trim() !== "" &&
    form.category.trim() !== "" &&
    form.supplier.trim() !== "" &&
    form.stock.trim() !== "" &&
    form.price.trim() !== "";

  const reset = () => {
    setForm({
      name: "",
      desc: "",
      category: "",
      supplier: "",
      stock: "",
      unit: "kg",
      price: "",
    });
    setIconIdx(0);
  };

  const submit = () => {
    if (!canSave) return;
    const stock = Math.max(0, Math.round(Number(form.stock) || 0));
    const priceValue = priceNum(form.price);
    onAdd({
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      name: form.name.trim(),
      desc: form.desc.trim(),
      category: form.category.trim(),
      supplier: form.supplier,
      stock,
      unit: form.unit,
      total: stock,
      price: `₱${priceValue.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      status: statusFromQty(stock),
      thumb: productIcons[iconIdx].tone,
      Icon: productIcons[iconIdx].Icon,
    });
    reset();
    onClose();
  };

  const close = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div onClick={close} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIconOpen((v) => !v)}
                onBlur={() => setTimeout(() => setIconOpen(false), 120)}
                title="Choose an icon"
                className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl outline-none ring-offset-1 transition focus:ring-2 focus:ring-primary/40 ${productIcons[iconIdx].tone}`}
              >
                {(() => {
                  const Picked = productIcons[iconIdx].Icon;
                  return <Picked className="h-5 w-5" />;
                })()}
                <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                  <EditIcon className="h-2.5 w-2.5" />
                </span>
              </button>

              {iconOpen && (
                <div className="absolute left-0 top-12 z-10 flex gap-1.5 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
                  {productIcons.map(({ Icon, tone }, i) => (
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
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Add Product
              </h3>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Item name <span className="text-[#a6516f]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Arabica Beans 1kg"
              autoFocus
              className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Description{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="e.g. Direct from Brazil Highlands"
              className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Category <span className="text-[#a6516f]">*</span>
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
                placeholder="e.g. Beverage"
                className="h-10 w-full rounded-lg border border-neutral-200 pl-3 pr-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <ChevronDownIcon
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
              />

              {catOpen && (filteredCategories.length > 0 || showCreateCategory) && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
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

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Supplier <span className="text-[#a6516f]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => {
                  set("supplier", e.target.value);
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
                        set("supplier", s);
                        setSupOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50 ${
                        form.supplier === s
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
                        set("supplier", form.supplier.trim());
                        setSupOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      <PlusIcon className="h-4 w-4 shrink-0" />
                      Create &ldquo;{form.supplier.trim()}&rdquo; supplier
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Quantity <span className="text-[#a6516f]">*</span>
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
                Unit price <span className="text-[#a6516f]">*</span>
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

        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
          <button
            onClick={close}
            className="h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
