"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { RocketIcon } from "./icons";

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

        <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-secondary p-8 text-center">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Straightforward tools you can trust
          </h1>
          <p className="max-w-md text-lg text-neutral-600">
            Everything your business needs, nothing it doesn&apos;t.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition-colors hover:opacity-90">
              <RocketIcon className="h-5 w-5" />
              Get Started
            </button>
            <button className="rounded-md border border-neutral-300 px-6 py-3 font-medium text-primary transition-colors hover:bg-neutral-100">
              Learn More
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
