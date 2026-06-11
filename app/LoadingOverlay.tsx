"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen({
  fading = false,
  onFaded,
}: {
  fading?: boolean;
  onFaded?: () => void;
}) {
  return (
    <div
      onTransitionEnd={onFaded}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-white to-[#f4efed] transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={fading}
      role="status"
      aria-live="polite"
    >
      <div className="relative grid h-28 w-28 place-items-center">
        <span className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/15 blur-xl" />
        <span className="absolute inset-0 rounded-full border-2 border-primary/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary [animation-duration:1s]" />
        <Image
          src="/logo-mark.png"
          alt="Talli"
          width={56}
          height={56}
          priority
          className="h-14 w-14 animate-spin rounded [animation-direction:reverse] [animation-duration:1.8s]"
        />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function LoadingOverlay() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const MIN_MS = 600;
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => setDone(true), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (hidden) return null;

  return (
    <LoadingScreen fading={done} onFaded={() => done && setHidden(true)} />
  );
}