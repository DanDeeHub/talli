import Image from "next/image";
import { PersonIcon } from "./icons";
import Activity from "./Activity";

export default function Header({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
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
        <Activity />

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-sm font-medium text-neutral-900">John Doe</div>
            <div className="text-xs text-neutral-500">Cashier</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PersonIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
