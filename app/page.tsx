import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div className="flex flex-1">
      <Sidebar />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-secondary p-8 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-primary">
          Straightforward tools you can trust
        </h1>
        <p className="max-w-md text-lg text-neutral-600">
          Everything your business needs, nothing it doesn&apos;t.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition-colors hover:opacity-90">
            <span className="material-symbols-outlined text-[20px] leading-none">
              rocket_launch
            </span>
            Get Started
          </button>
          <button className="rounded-md border border-neutral-300 px-6 py-3 font-medium text-primary transition-colors hover:bg-neutral-100">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
