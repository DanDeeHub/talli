"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DashboardIcon,
  InventoryIcon,
  WarehouseIcon,
  SuppliersIcon,
  LogoutIcon,
  MenuOpenIcon,
} from "./icons";

const nav = [
  { label: "Dashboard", Icon: DashboardIcon },
  { label: "Inventory", Icon: InventoryIcon },
  { label: "Warehouse", Icon: WarehouseIcon },
  { label: "Suppliers", Icon: SuppliersIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const itemClass =
    "flex h-10 items-center gap-3 rounded-md px-2.5 text-sm text-white/80 transition-colors hover:bg-primary/60 hover:text-white";

  return (
    <aside
      className={`flex flex-col bg-[#2e2e2e] text-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-5">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            title="Expand"
            className="flex cursor-pointer items-center justify-center rounded"
          >
            <Image
              src="/logo-mark.png"
              alt="Talli logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 max-w-none shrink-0 rounded transition duration-200 hover:brightness-0 hover:invert"
            />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-mark.png"
                alt="Talli logo"
                width={32}
                height={32}
                priority
                className="h-8 w-8 max-w-none shrink-0 rounded brightness-0 invert transition duration-200"
              />
              <span className="text-xl font-semibold tracking-tight">Talli</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse"
              className="flex cursor-pointer items-center justify-center rounded-md p-1 text-white/80 transition-colors hover:bg-primary/60 hover:text-white"
            >
              <MenuOpenIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {nav.map(({ label, Icon }) => (
          <a
            key={label}
            href="#"
            title={collapsed ? label : undefined}
            className={itemClass}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && label}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <a href="#" title={collapsed ? "Logout" : undefined} className={itemClass}>
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {!collapsed && "Logout"}
        </a>
      </div>
    </aside>
  );
}
