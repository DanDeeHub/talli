"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import Announcements from "./Announcements";
import Billed from "./Billed";
import RecentOrders from "./RecentOrders";
import InventoryAlerts from "./InventoryAlerts";
import InventoryPage from "./InventoryPage";
import AddProductModal from "./AddProductModal";
import Footer from "./Footer";
import ShopSelection, { Shop, initialShops } from "./ShopSelection";
import { Product, initialProducts } from "./inventory";
import { PaymentsIcon, PendingActionsIcon, InventoryIcon } from "./icons";

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [addOpen, setAddOpen] = useState(false);

  if (!shop) {
    return (
      <div className="flex min-h-0 flex-1">
        <Sidebar
          active=""
          onSelect={() => {}}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
          locked
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Header
            title="Select Shop"
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable_both-edges] bg-[#fbf9f8] p-6 sm:p-8">
            <ShopSelection
              shops={shops}
              onSelect={setShop}
              onAdd={(s) => setShops((prev) => [...prev, s])}
            />
            <Footer />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar
        active={active}
        onSelect={setActive}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        onSwitchShop={() => setShop(null)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          title={active}
          onMenuClick={() => setMobileOpen(true)}
          shopName={shop.name}
        />

        <main className="flex flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable_both-edges] bg-[#fbf9f8] p-6 sm:p-8">
          {active === "Dashboard" ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
                <StatCard
                  Icon={PaymentsIcon}
                  label="Total Stock Value"
                  value="₱1,248,384.00"
                  change={12.5}
                  series={[42, 55, 48, 63, 58, 75, 90]}
                  tone="rose"
                />
                <StatCard
                  Icon={PendingActionsIcon}
                  label="Pending Purchase Orders"
                  value="64"
                  series={[55, 48, 62, 45, 70, 80, 72]}
                  tone="neutral"
                />
                <StatCard
                  Icon={InventoryIcon}
                  label="Stocks"
                  value="1,280"
                  series={[35, 42, 38, 55, 60, 72, 88]}
                  tone="olive"
                />
              </div>

              <Announcements />

              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-4">
                <div className="self-stretch lg:col-span-3">
                  <Billed />
                </div>
                <div className="self-stretch lg:col-span-1">
                  <QuickActions onAddProduct={() => setAddOpen(true)} />
                </div>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                <div className="self-stretch">
                  <RecentOrders />
                </div>
                <div className="self-stretch">
                  <InventoryAlerts />
                </div>
              </div>
            </div>
          ) : active === "Inventory" ? (
            <InventoryPage
              products={products}
              onAddProductClick={() => setAddOpen(true)}
            />
          ) : (
            <p className="text-neutral-500">{active} content goes here.</p>
          )}

          <Footer />
        </main>
      </div>

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(p) => setProducts((prev) => [p, ...prev])}
        products={products}
      />
    </div>
  );
}
