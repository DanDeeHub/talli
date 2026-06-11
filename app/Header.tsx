import Image from "next/image";

export default function Header({
  title,
  onMenuClick,
  shopName,
}: {
  title: string;
  onMenuClick: () => void;
  shopName?: string;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          title="Open menu"
          aria-label="Open menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-[#2e2e2e] p-2 shadow-sm transition-opacity hover:opacity-90 md:hidden"
        >
          <Image
            src="/logo-mark.png"
            alt="Talli logo"
            width={28}
            height={28}
            priority
            className="h-6 w-6 max-w-none rounded"
          />
        </button>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {shopName && (
          <>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                Current shop
              </div>
              <div className="max-w-[12rem] truncate text-sm font-medium text-neutral-900">
                {shopName}
              </div>
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
          </>
        )}

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          JD
        </div>
      </div>
    </header>
  );
}
