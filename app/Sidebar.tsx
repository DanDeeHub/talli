"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DashboardIcon,
  InventoryIcon,
  ReceiptLongIcon,
  LogoutIcon,
  CloseIcon,
} from "./icons";
import {
  MdOutlineStorefront,
  MdOutlineCoffeeMaker,
  MdOutlineSoupKitchen,
} from "react-icons/md";

type IconType = React.ComponentType<{ className?: string }>;

const nav: { label: string; Icon: IconType }[] = [
  { label: "Dashboard", Icon: DashboardIcon },
  { label: "Inventory", Icon: InventoryIcon },
  { label: "Purchase Orders", Icon: ReceiptLongIcon },
  { label: "Bar", Icon: MdOutlineCoffeeMaker },
  { label: "Kitchen", Icon: MdOutlineSoupKitchen },
];

const itemBase =
  "flex h-10 w-full items-center gap-3 overflow-hidden rounded-md px-2.5 text-sm transition-colors";

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
  disabled,
}: {
  Icon: IconType;
  label: string;
  expanded: boolean;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={expanded ? undefined : label}
      className={`${itemBase} ${
        disabled
          ? "cursor-not-allowed text-white/30"
          : `cursor-pointer hover:bg-primary/60 hover:text-white ${
              active ? "bg-primary/60 text-white" : "text-white/80"
            }`
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && (
        <span className="min-w-0 flex-1 truncate whitespace-nowrap text-left">
          {label}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onMobileOpenChange,
  onSwitchShop,
  onLogout,
  locked,
}: {
  active: string;
  onSelect: (label: string) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  onSwitchShop?: () => void;
  onLogout?: () => void;
  locked?: boolean;
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
          {!locked &&
            nav.map((item) => (
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

        {!locked && (
          <div className="px-3 pt-4">
            <SidebarItem
              Icon={MdOutlineStorefront}
              label="Switch Shop"
              expanded={expanded}
              onClick={() => {
                onSwitchShop?.();
                onMobileOpenChange(false);
              }}
            />
          </div>
        )}

        <div className="mt-3 border-t border-white/10 px-3 py-4">
          <SidebarItem
            Icon={LogoutIcon}
            label="Logout"
            expanded={expanded}
            onClick={() => {
              onLogout?.();
              onMobileOpenChange(false);
            }}
          />
        </div>
      </aside>
    </>
  );
}
