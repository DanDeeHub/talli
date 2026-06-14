"use client";

import { useState } from "react";
import {
  Product,
  Unit,
  statusStyles,
  statusFromQty,
  toneForIcon,
  fallbackIcon,
  priceNum,
  productIcons,
  categories,
  suppliers,
  units,
} from "./inventory";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  EditIcon,
  PlusIcon,
  DeleteIcon,
} from "./icons";

type Activity = {
  by: string;
  tone: string;
  action: string;
  detail: string;
  time: string;
};

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function activityFor(product: Product): Activity[] {
  return [
    {
      by: "John Doe",
      tone: "bg-[#e4edf1] text-[#4d7d94]",
      action: "updated the stock",
      detail: `Quantity set to ${product.stock} ${product.unit}`,
      time: "2 hours ago",
    },
    {
      by: "Maria Santos",
      tone: "bg-primary/10 text-primary",
      action: "changed the price",
      detail: `Unit price set to ${product.price}`,
      time: "Yesterday",
    },
    {
      by: "Carlo Reyes",
      tone: "bg-[#eef2dd] text-[#7d8f3c]",
      action: "restocked the item",
      detail: `Received from ${product.supplier ?? "supplier"}`,
      time: "3 days ago",
    },
    {
      by: "Maria Santos",
      tone: "bg-primary/10 text-primary",
      action: "edited the details",
      detail: `Renamed to “${product.name}”`,
      time: "1 week ago",
    },
    {
      by: "Admin",
      tone: "bg-neutral-100 text-neutral-700",
      action: "created the item",
      detail: `Added to ${product.category}`,
      time: "2 weeks ago",
    },
  ];
}

export default function ProductDetail({
  product,
  onBack,
  onSave,
  onDelete,
}: {
  product: Product;
  onBack: () => void;
  onSave: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const RowIcon = product.Icon ?? fallbackIcon;
  const totalValue = priceNum(product.price) * product.stock;
  const activity = activityFor(product);

  const [editing, setEditing] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [supOpen, setSupOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
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

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const startEdit = () => {
    setForm({
      name: product.name,
      desc: product.desc,
      category: product.category,
      supplier: product.supplier ?? "",
      stock: String(product.stock),
      unit: product.unit,
      price: String(priceNum(product.price)),
    });
    const idx = productIcons.findIndex((p) => p.Icon === product.Icon);
    setIconIdx(idx >= 0 ? idx : 0);
    setEditing(true);
  };

  const catOptions = Array.from(new Set([...categories, product.category]));
  const catQuery = form.category.trim().toLowerCase();
  const filteredCategories = catOptions.filter((c) =>
    c.toLowerCase().includes(catQuery),
  );
  const showCreateCategory =
    form.category.trim() !== "" &&
    !catOptions.some((c) => c.toLowerCase() === catQuery);

  const supOptions = Array.from(
    new Set([...suppliers, ...(product.supplier ? [product.supplier] : [])]),
  );
  const supQuery = form.supplier.trim().toLowerCase();
  const filteredSuppliers = supOptions.filter((s) =>
    s.toLowerCase().includes(supQuery),
  );
  const showCreateSupplier =
    form.supplier.trim() !== "" &&
    !supOptions.some((s) => s.toLowerCase() === supQuery);

  const canSave =
    form.name.trim() !== "" &&
    form.category.trim() !== "" &&
    form.supplier.trim() !== "" &&
    form.stock.trim() !== "" &&
    form.price.trim() !== "";

  const editStock =
    form.unit === "pcs"
      ? Math.max(0, Math.round(Number(form.stock) || 0))
      : Math.max(0, Number(form.stock) || 0);
  const editStatus = statusFromQty(editStock);

  const save = () => {
    if (!canSave) return;
    const priceValue = priceNum(form.price);
    onSave({
      ...product,
      name: form.name.trim(),
      desc: form.desc.trim(),
      category: form.category.trim(),
      supplier: form.supplier,
      stock: editStock,
      unit: form.unit,
      price: `₱${priceValue.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      status: editStatus,
      thumb: productIcons[iconIdx].tone,
      Icon: productIcons[iconIdx].Icon,
    });
    setEditing(false);
  };

  const details: { label: string; value: string; suffix?: string }[] = [
    { label: "Category", value: product.category },
    { label: "Supplier", value: product.supplier ?? "—" },
    { label: "Quantity", value: `${product.stock} ${product.unit}` },
    { label: "Unit price", value: product.price, suffix: `per ${product.unit}` },
    {
      label: "Total value",
      value: `₱${totalValue.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-9 items-center justify-between">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to inventory
        </button>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        {!editing ? (
          <>
            <div className="flex items-start gap-4">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${toneForIcon(
                  RowIcon,
                )}`}
              >
                <RowIcon className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-xl font-semibold text-neutral-900">
                  {product.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {product.desc}
                </p>
              </div>
              <span
                className={`mt-1 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[product.status]}`}
              >
                {product.status}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    {d.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">
                    {d.value}
                    {d.suffix && (
                      <span className="font-normal text-neutral-400">
                        {" "}
                        {d.suffix}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIconOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setIconOpen(false), 120)}
                  title="Choose an icon"
                  className={`relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-2xl outline-none ring-offset-2 transition focus:ring-2 focus:ring-primary/40 ${productIcons[iconIdx].tone}`}
                >
                  {(() => {
                    const Picked = productIcons[iconIdx].Icon;
                    return <Picked className="h-8 w-8" />;
                  })()}
                  <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                    <EditIcon className="h-3 w-3" />
                  </span>
                </button>

                {iconOpen && (
                  <div className="absolute left-0 top-[4.5rem] z-10 flex gap-1.5 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
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

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Item name"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-lg font-semibold text-neutral-900 outline-none transition-colors placeholder:font-normal placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <span
                className={`mt-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[editStatus]}`}
              >
                {editStatus}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Category <span className="text-[#a6516f]">*</span>
                </p>
                <div className="relative mt-1">
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
                    className={`${inputClass} pr-9`}
                  />
                  <ChevronDownIcon
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                      catOpen ? "rotate-180" : ""
                    }`}
                  />
                  {catOpen &&
                    (filteredCategories.length > 0 || showCreateCategory) && (
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
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Supplier <span className="text-[#a6516f]">*</span>
                </p>
                <div className="relative mt-1">
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
                    className={`${inputClass} pr-9`}
                  />
                  <ChevronDownIcon
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
                      supOpen ? "rotate-180" : ""
                    }`}
                  />
                  {supOpen &&
                    (filteredSuppliers.length > 0 || showCreateSupplier) && (
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
                            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
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

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Quantity <span className="text-[#a6516f]">*</span>
                </p>
                <div className="mt-1 flex">
                  <input
                    type="number"
                    min={0}
                    step={form.unit === "pcs" ? "1" : "any"}
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
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Unit price <span className="text-[#a6516f]">*</span>
                </p>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    ₱
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="0.00"
                    className="h-10 w-full rounded-lg border border-neutral-200 pl-7 pr-16 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    per {form.unit}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Total value
                </p>
                <p className="mt-1 flex h-10 items-center text-sm font-medium text-neutral-900">
                  ₱
                  {(priceNum(form.price) * editStock).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => onDelete(product.id)}
                className="order-last flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#a6516f] transition-colors hover:bg-[#f5e7ee] sm:order-none sm:w-auto"
              >
                <DeleteIcon className="h-4 w-4" />
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="h-9 flex-1 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!canSave}
                  className="flex h-9 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer sm:flex-none"
                >
                  <EditIcon className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
          Activity History
        </h3>
        {(() => {
          const visible = showAllActivity ? activity : activity.slice(0, 3);
          return (
            <ul
              className={`mt-5 ${
                showAllActivity
                  ? "max-h-80 overflow-y-auto [scrollbar-gutter:stable]"
                  : ""
              }`}
            >
              {visible.map((a, i) => (
                <li
                  key={i}
                  className={`relative ${
                    i !== visible.length - 1 ? "pb-7" : ""
                  }`}
                >
                  {i !== visible.length - 1 && (
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
                          <span className="font-semibold">{a.by}</span>{" "}
                          {a.action}
                        </p>
                        <span className="shrink-0 text-xs text-neutral-400">
                          {a.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {a.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          );
        })()}

        {activity.length > 3 && (
          <button
            onClick={() => setShowAllActivity((v) => !v)}
            className="mt-5 w-full cursor-pointer rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            {showAllActivity
              ? "Show less"
              : `Show all (${activity.length})`}
          </button>
        )}
      </div>
    </div>
  );
}
