import Image from "next/image";

export const metadata = {
  title: "Talli — Coming Soon",
  description: "Billing and inventory web app for retail shops.",
};

export default function Landing() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#f4efed] px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="blob-a pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="blob-b pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4d7d94]/15 blur-3xl [animation-delay:-6s]"
      />
      <div
        aria-hidden="true"
        className="blob-b pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#a0b360]/15 blur-3xl [animation-delay:-12s]"
      />
      <div
        aria-hidden="true"
        className="blob-a pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#a6516f]/15 blur-3xl [animation-delay:-9s]"
      />
      <div
        aria-hidden="true"
        className="blob-a pointer-events-none absolute left-[calc(50%-5rem)] top-1/3 h-40 w-40 rounded-full bg-primary/10 blur-3xl [animation-delay:-3s]"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt="Talli logo"
            width={48}
            height={48}
            priority
            className="h-10 w-10 rounded sm:h-12 sm:w-12"
          />
          <span className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Talli
          </span>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary sm:mt-8 sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Work in progress
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:mt-6 sm:text-4xl md:text-5xl">
          Something good is brewing.
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500 sm:mt-4 sm:text-base">
          Talli is a billing and inventory web app built for small retail shops. We&apos;re putting on the finishing touches. Check back
          soon.
        </p>
      </div>

      <footer className="absolute inset-x-0 bottom-4 text-center text-xs text-neutral-400">
        © 2026 Soul Coffee. All rights reserved.
      </footer>
    </main>
  );
}