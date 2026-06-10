"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import MessageBoard from "./MessageBoard";
import Billed from "./Billed";
import RecentOrders from "./RecentOrders";
import InventoryAlerts from "./InventoryAlerts";
import { PaymentsIcon, PendingActionsIcon, InventoryIcon } from "./icons";

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-1">
      <Sidebar
        active={active}
        onSelect={setActive}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={active} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-[#fbf9f8] p-6 sm:p-8">
          {active === "Dashboard" ? (
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                Icon={PaymentsIcon}
                label="Total Value"
                value="₱142,384.00"
                change={12.5}
                series={[42, 55, 48, 63, 58, 75, 90]}
                tone="rose"
              />
              <StatCard
                Icon={PendingActionsIcon}
                label="Pending Purchase Orders"
                value="64"
                change={-2.1}
                series={[55, 48, 62, 45, 70, 80, 72]}
                tone="neutral"
              />
              <StatCard
                Icon={InventoryIcon}
                label="Stocks"
                value="1,280"
                change={8.3}
                series={[35, 42, 38, 55, 60, 72, 88]}
                tone="olive"
              />
              <MessageBoard />

              <div className="self-stretch sm:col-span-2 lg:col-span-3">
                <Billed />
              </div>
              <div className="self-stretch sm:col-span-2 lg:col-span-1">
                <QuickActions />
              </div>

              <div className="self-stretch sm:col-span-2 lg:col-span-2">
                <RecentOrders />
              </div>
              <div className="self-stretch sm:col-span-2 lg:col-span-2">
                <InventoryAlerts />
              </div>
            </div>
          ) : (
            <p className="text-neutral-500">{active} content goes here.</p>
          )}
        </main>
      </div>
    </div>
  );
}
