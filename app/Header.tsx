import { NotificationsIcon, PersonIcon } from "./icons";

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white pl-16 pr-6 md:px-6">
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          title="Notifications"
          aria-label="Notifications"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <NotificationsIcon className="h-5 w-5" />
        </button>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-sm font-medium text-neutral-900">
              John Doe
            </div>
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
