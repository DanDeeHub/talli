export type POStatus = "Pending" | "Paid";

export type POColKey = "po" | "supplier" | "items" | "total" | "status";

export type POLineItem = {
  productId: number;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
};

export type PurchaseOrder = {
  id: number;
  poNumber: string;
  supplier: string;
  createdBy: string;
  status: POStatus;
  orderedDate: string; // ISO yyyy-mm-dd — when the PO was created
  items: POLineItem[];
};

export const poStatuses: POStatus[] = ["Pending", "Paid"];

export const poStatusStyles: Record<POStatus, string> = {
  Pending: "bg-[#f5e7ee] text-[#a6516f]",
  Paid: "bg-[#eef2dd] text-[#7d8f3c]",
};

export const poIconTone: Record<POStatus, string> = {
  Pending: "bg-[#f5e7ee] text-[#a6516f]",
  Paid: "bg-[#eef2dd] text-[#7d8f3c]",
};

export const poStatusRank: Record<POStatus, number> = {
  Pending: 0,
  Paid: 1,
};

export const poColumnLabels: Record<POColKey, string> = {
  po: "Purchase Order",
  supplier: "Supplier",
  items: "Items",
  total: "Total",
  status: "Status",
};

export const poTotal = (po: PurchaseOrder) =>
  po.items.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

export const formatPeso = (n: number) =>
  `₱${n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

export const nextPoNumber = (orders: PurchaseOrder[]) => {
  const max = orders.reduce((m, o) => {
    const n = Number(o.poNumber.replace(/[^0-9]/g, ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 1041);
  return `PO-${max + 1}`;
};

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: "PO-1042",
    supplier: "Initech Roasters",
    createdBy: "Maria Santos",
    status: "Pending",
    orderedDate: "2026-06-12",
    items: [
      { productId: 1, name: "Arabica Beans 1kg", qty: 20, unit: "kg", unitPrice: 1450 },
      { productId: 5, name: "Robusta Beans 1kg", qty: 15, unit: "kg", unitPrice: 1180 },
    ],
  },
  {
    id: 2,
    poNumber: "PO-1041",
    supplier: "Globex Corp",
    createdBy: "Carlo Reyes",
    status: "Paid",
    orderedDate: "2026-06-05",
    items: [
      { productId: 2, name: "Paper Cups 12oz", qty: 80, unit: "pcs", unitPrice: 420 },
      { productId: 7, name: "Espresso Cups 4oz", qty: 40, unit: "pcs", unitPrice: 95 },
    ],
  },
  {
    id: 3,
    poNumber: "PO-1040",
    supplier: "Soylent Distributors",
    createdBy: "Maria Santos",
    status: "Pending",
    orderedDate: "2026-06-11",
    items: [
      { productId: 4, name: "Caramel Syrup", qty: 24, unit: "ml", unitPrice: 350 },
      { productId: 6, name: "Vanilla Syrup", qty: 24, unit: "ml", unitPrice: 340 },
      { productId: 10, name: "Cocoa Powder 500g", qty: 12, unit: "kg", unitPrice: 520 },
    ],
  },
  {
    id: 4,
    poNumber: "PO-1039",
    supplier: "Umbrella Foods",
    createdBy: "John Doe",
    status: "Pending",
    orderedDate: "2026-06-14",
    items: [
      { productId: 3, name: "Oat Milk 1L", qty: 60, unit: "ml", unitPrice: 185 },
      { productId: 8, name: "Whole Milk 1L", qty: 60, unit: "ml", unitPrice: 110 },
    ],
  },
  {
    id: 5,
    poNumber: "PO-1038",
    supplier: "Northwind Traders",
    createdBy: "Carlo Reyes",
    status: "Paid",
    orderedDate: "2026-05-28",
    items: [
      { productId: 9, name: "Napkins Pack 200s", qty: 100, unit: "pcs", unitPrice: 85 },
    ],
  },
  {
    id: 6,
    poNumber: "PO-1037",
    supplier: "Acme Supplies",
    createdBy: "Admin",
    status: "Paid",
    orderedDate: "2026-05-20",
    items: [
      { productId: 11, name: "Linea Micra", qty: 2, unit: "pcs", unitPrice: 165000 },
    ],
  },
  {
    id: 7,
    poNumber: "PO-1036",
    supplier: "Initech Roasters",
    createdBy: "Maria Santos",
    status: "Paid",
    orderedDate: "2026-05-16",
    items: [
      { productId: 1, name: "Arabica Beans 1kg", qty: 10, unit: "kg", unitPrice: 1450 },
    ],
  },
  {
    id: 8,
    poNumber: "PO-1035",
    supplier: "Globex Corp",
    createdBy: "John Doe",
    status: "Pending",
    orderedDate: "2026-05-14",
    items: [
      { productId: 2, name: "Paper Cups 12oz", qty: 60, unit: "pcs", unitPrice: 420 },
    ],
  },
  {
    id: 9,
    poNumber: "PO-1034",
    supplier: "Umbrella Foods",
    createdBy: "Carlo Reyes",
    status: "Paid",
    orderedDate: "2026-05-10",
    items: [
      { productId: 3, name: "Oat Milk 1L", qty: 40, unit: "ml", unitPrice: 185 },
      { productId: 8, name: "Whole Milk 1L", qty: 40, unit: "ml", unitPrice: 110 },
    ],
  },
  {
    id: 10,
    poNumber: "PO-1033",
    supplier: "Soylent Distributors",
    createdBy: "Maria Santos",
    status: "Pending",
    orderedDate: "2026-05-08",
    items: [
      { productId: 10, name: "Cocoa Powder 500g", qty: 8, unit: "kg", unitPrice: 520 },
    ],
  },
  {
    id: 11,
    poNumber: "PO-1032",
    supplier: "Northwind Traders",
    createdBy: "John Doe",
    status: "Paid",
    orderedDate: "2026-05-04",
    items: [
      { productId: 9, name: "Napkins Pack 200s", qty: 80, unit: "pcs", unitPrice: 85 },
    ],
  },
  {
    id: 12,
    poNumber: "PO-1031",
    supplier: "Initech Roasters",
    createdBy: "Carlo Reyes",
    status: "Pending",
    orderedDate: "2026-05-02",
    items: [
      { productId: 5, name: "Robusta Beans 1kg", qty: 12, unit: "kg", unitPrice: 1180 },
    ],
  },
  {
    id: 13,
    poNumber: "PO-1030",
    supplier: "Globex Corp",
    createdBy: "Admin",
    status: "Paid",
    orderedDate: "2026-04-27",
    items: [
      { productId: 7, name: "Espresso Cups 4oz", qty: 50, unit: "pcs", unitPrice: 95 },
    ],
  },
  {
    id: 14,
    poNumber: "PO-1029",
    supplier: "Soylent Distributors",
    createdBy: "Maria Santos",
    status: "Paid",
    orderedDate: "2026-04-22",
    items: [
      { productId: 4, name: "Caramel Syrup", qty: 18, unit: "ml", unitPrice: 350 },
      { productId: 6, name: "Vanilla Syrup", qty: 18, unit: "ml", unitPrice: 340 },
    ],
  },
];
