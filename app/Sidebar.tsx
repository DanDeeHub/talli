"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DashboardIcon,
  InventoryIcon,
  WarehouseIcon,
  SuppliersIcon,
  LogoutIcon,
  CloseIcon,
} from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

const nav: { label: string; Icon: IconType }[] = [
  { label: "Dashboard", Icon: DashboardIcon },
  { label: "Inventory", Icon: InventoryIcon },
  { label: "Warehouse", Icon: WarehouseIcon },
  { label: "Suppliers", Icon: SuppliersIcon },
];

const itemClass =
  "flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm transition-colors hover:bg-primary/60 hover:text-white";

function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Talli logo"
      width={32}
      height={32}
      priority
      className={`max-w-none shrink-0 rounded ${className ?? ""}`}
    />
  );
}

function SidebarItem({
  Icon,
  label,
  expanded,
  active,
  onClick,
}: {
  Icon: IconType;
  label: string;
  expanded: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={expanded ? undefined : label}
      className={`${itemClass} ${
        active ? "bg-primary/60 text-white" : "text-white/80"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && label}
    </button>
  );
}

export default function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onMobileOpenChange,
}: {
  active: string;
  onSelect: (label: string) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(true); // desktop rail state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      setIsMobile(mql.matches);
      if (!mql.matches) onMobileOpenChange(false); // reset drawer when leaving mobile
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [onMobileOpenChange]);

  // Full layout (labels visible): always on mobile, or when expanded on desktop.
  const expanded = isMobile || !collapsed;

  const asideClass = `flex flex-col bg-[#2e2e2e] text-white transition-all duration-200 ${
    isMobile
      ? `fixed inset-y-0 left-0 z-50 w-64 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`
      : collapsed
        ? "w-16"
        : "w-52"
  }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => onMobileOpenChange(false)}
          className="fixed inset-0 z-40 bg-black/50"
          aria-hidden="true"
        />
      )}

      <aside className={asideClass}>
        <div className="flex h-16 items-center justify-between gap-3 border-b border-white/10 px-4">
          {expanded ? (
            <>
              <div className="flex items-center gap-3">
                <LogoMark className="h-8 w-8 brightness-0 invert" />
                <span className="text-xl font-semibold tracking-tight">
                  Talli
                </span>
              </div>
              <button
                onClick={() =>
                  isMobile ? onMobileOpenChange(false) : setCollapsed(true)
                }
                title={isMobile ? "Close menu" : "Collapse"}
                aria-label={isMobile ? "Close menu" : "Collapse"}
                className="flex cursor-pointer items-center justify-center rounded-md p-1 text-white/80 transition-colors hover:bg-primary/60 hover:text-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand"
              aria-label="Expand"
              className="flex cursor-pointer items-center justify-center rounded"
            >
              <LogoMark className="h-8 w-8 transition duration-200 hover:brightness-0 hover:invert" />
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {nav.map((item) => (
            <SidebarItem
              key={item.label}
              {...item}
              expanded={expanded}
              active={item.label === active}
              onClick={() => {
                onSelect(item.label);
                onMobileOpenChange(false);
              }}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <SidebarItem Icon={LogoutIcon} label="Logout" expanded={expanded} />
        </div>
      </aside>
    </>
  );
}
