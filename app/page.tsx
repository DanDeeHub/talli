"use client";

import { useState, useEffect } from "react";
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
import AuthScreen from "./AuthScreen";
import { LoadingScreen } from "./LoadingOverlay";
import { Product, initialProducts } from "./inventory";
import { PaymentsIcon, PendingActionsIcon, InventoryIcon } from "./icons";

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [addOpen, setAddOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const [fading, setFading] = useState(true);
  const [contentFading, setContentFading] = useState(false);
  const [authed, setAuthed] = useState(false);

  const logout = () => {
    setAuthed(false);
    setShop(null);
    setActive("Dashboard");
  };

  const transitionTo = (next: Shop | null) => {
    setEntering(true);
    setFading(true);
    setTimeout(() => setFading(false), 20);
    setTimeout(() => setShop(next), 700);
    setTimeout(() => setFading(true), 1000);
    setTimeout(() => setEntering(false), 1500);
    window.history.pushState(
      { ...window.history.state, shopId: next?.id ?? null, active },
      "",
    );
  };

  const navigate = (label: string) => {
    if (label === active) return;
    window.history.pushState(
      { ...window.history.state, shopId: shop?.id ?? null, active: label },
      "",
    );
    setContentFading(true);
    setTimeout(() => {
      setActive(label);
      setContentFading(false);
    }, 200);
  };

  useEffect(() => {
    if (localStorage.getItem("talli.authed") === "1") setAuthed(true);
    const savedShopId = localStorage.getItem("talli.shopId");
    let restored: Shop | null = null;
    if (savedShopId) {
      restored = initialShops.find((s) => s.id === Number(savedShopId)) ?? null;
      if (restored) setShop(restored);
    }
    const savedActive = localStorage.getItem("talli.active") ?? "Dashboard";
    setActive(savedActive);
    window.history.replaceState(
      {
        ...window.history.state,
        shopId: restored?.id ?? null,
        active: savedActive,
      },
      "",
    );

    const onPop = (e: PopStateEvent) => {
      const st = e.state as { shopId: number | null; active: string } | null;
      if (!st || typeof st.active !== "string") return;
      setContentFading(true);
      setTimeout(() => {
        setShop(
          st.shopId
            ? initialShops.find((x) => x.id === st.shopId) ?? null
            : null,
        );
        setActive(st.active);
        setContentFading(false);
      }, 200);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (authed) localStorage.setItem("talli.authed", "1");
    else localStorage.removeItem("talli.authed");
  }, [authed]);

  useEffect(() => {
    if (shop) localStorage.setItem("talli.shopId", String(shop.id));
    else localStorage.removeItem("talli.shopId");
  }, [shop]);

  useEffect(() => {
    localStorage.setItem("talli.active", active);
  }, [active]);

  if (!authed) {
    return (
      <AuthScreen
        onAuth={() => {
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <>
      {!shop ? (
        <div className="flex min-h-0 flex-1">
          <Sidebar
            active=""
            onSelect={() => {}}
            mobileOpen={mobileOpen}
            onMobileOpenChange={setMobileOpen}
            onLogout={logout}
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
                onSelect={transitionTo}
                onAdd={(s) => setShops((prev) => [...prev, s])}
              />
              <Footer />
            </main>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
      <Sidebar
        active={active}
        onSelect={navigate}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        onSwitchShop={() => transitionTo(null)}
        onLogout={logout}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          title={active}
          onMenuClick={() => setMobileOpen(true)}
          shopName={shop.name}
        />

        <main className="flex flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable_both-edges] bg-[#fbf9f8] p-6 sm:p-8">
          <div
            className={`transition-opacity duration-200 ${
              contentFading ? "opacity-0" : "opacity-100"
            }`}
          >
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
          </div>

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
      )}

      {entering && <LoadingScreen fading={fading} />}
    </>
  );
}
