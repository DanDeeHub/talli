import { GroceryIcon } from "./icons";
import {
  MdOutlineLocalCafe,
  MdOutlineInventory2,
  MdOutlineCoffeeMaker,
  MdOutlineBakeryDining,
} from "react-icons/md";

export type IconType = React.ComponentType<{ className?: string }>;

export type Status = "Out of stock" | "Low Stock" | "In Stock";

export type Unit = string;

export type ColKey = "name" | "category" | "quantity" | "price" | "status";

export type Product = {
  id: number;
  name: string;
  desc: string;
  category: string;
  supplier?: string;
  stock: number;
  unit: Unit;
  total: number;
  price: string;
  status: Status;
  thumb: string;
  Icon?: IconType;
};

export const statusStyles: Record<Status, string> = {
  "Out of stock": "bg-[#f5e7ee] text-[#a6516f]",
  "Low Stock": "bg-[#e4edf1] text-[#4d7d94]",
  "In Stock": "bg-[#eef2dd] text-[#7d8f3c]",
};

export const productIcons: { Icon: IconType; tone: string }[] = [
  { Icon: MdOutlineLocalCafe, tone: "bg-primary/10 text-primary" },
  { Icon: MdOutlineInventory2, tone: "bg-[#e4edf1] text-[#4d7d94]" },
  { Icon: GroceryIcon, tone: "bg-[#eef2dd] text-[#7d8f3c]" },
  { Icon: MdOutlineCoffeeMaker, tone: "bg-neutral-100 text-neutral-700" },
  { Icon: MdOutlineBakeryDining, tone: "bg-[#f5e7ee] text-[#a6516f]" },
];

export const fallbackIcon = MdOutlineInventory2;

export const toneForIcon = (Icon: IconType) =>
  productIcons.find((p) => p.Icon === Icon)?.tone ??
  "bg-neutral-100 text-neutral-700";

export const columnLabels: Record<ColKey, string> = {
  name: "Item Name",
  category: "Category",
  quantity: "Quantity",
  price: "Unit Price",
  status: "Status",
};

export const statusRank: Record<Status, number> = {
  "Out of stock": 0,
  "Low Stock": 1,
  "In Stock": 2,
};

export const priceNum = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

export const categories = [
  "Beverage",
  "Dairy",
  "Additives",
  "Disposables",
  "Pastry",
  "Tea",
  "Equipment",
  "Packaging",
  "Cleaning",
  "Merchandise",
];

export const units: Unit[] = ["kg", "ml", "pcs"];

export const suppliers = [
  "Acme Supplies",
  "Northwind Traders",
  "Globex Corp",
  "Umbrella Foods",
  "Initech Roasters",
  "Soylent Distributors",
];

export const statusFromQty = (qty: number): Status => {
  if (qty <= 0) return "Out of stock";
  if (qty < 50) return "Low Stock";
  return "In Stock";
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Arabica Beans 1kg",
    Icon: MdOutlineLocalCafe,
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
    Icon: MdOutlineInventory2,
    desc: "Eco-friendly Biodegradable",
    category: "Disposables",
    stock: 8,
    unit: "pcs",
    total: 100,
    price: "₱420.00",
    status: "Low Stock",
    thumb: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    name: "Oat Milk 1L",
    Icon: GroceryIcon,
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
    Icon: GroceryIcon,
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
    Icon: MdOutlineLocalCafe,
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
    Icon: GroceryIcon,
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
    Icon: MdOutlineInventory2,
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
    Icon: GroceryIcon,
    desc: "Fresh full cream",
    category: "Dairy",
    stock: 9,
    unit: "ml",
    total: 100,
    price: "₱110.00",
    status: "Low Stock",
    thumb: "bg-primary/10 text-primary",
  },
  {
    id: 9,
    name: "Napkins Pack 200s",
    Icon: MdOutlineInventory2,
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
    Icon: MdOutlineBakeryDining,
    desc: "Dutch-processed",
    category: "Additives",
    stock: 0,
    unit: "kg",
    total: 200,
    price: "₱520.00",
    status: "Out of stock",
    thumb: "bg-[#f5e7ee] text-[#a6516f]",
  },
  {
    id: 11,
    name: "Linea Micra",
    Icon: MdOutlineCoffeeMaker,
    desc: "Compact espresso machine",
    category: "Equipment",
    stock: 3,
    unit: "pcs",
    total: 5,
    price: "₱165,000.00",
    status: "Low Stock",
    thumb: "bg-neutral-100 text-neutral-700",
  },
];
