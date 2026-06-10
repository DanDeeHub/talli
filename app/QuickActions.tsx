import { ReceiptIcon, AddBoxIcon, PersonAddIcon } from "./icons";

type IconType = React.ComponentType<{ className?: string }>;

type Action = {
  Icon: IconType;
  title: string;
  subtitle: string;
};

const actions: Action[] = [
  { Icon: ReceiptIcon, title: "New Invoice", subtitle: "Bill your clients" },
  { Icon: AddBoxIcon, title: "Add Product", subtitle: "Update catalog" },
  { Icon: PersonAddIcon, title: "Invite Member", subtitle: "Scale your team" },
];

export default function QuickActions() {
  return (
    <div className="h-full w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Quick Actions
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {actions.map(({ Icon, title, subtitle }) => (
          <button
            key={title}
            type="button"
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-neutral-900">
                {title}
              </span>
              <span className="block text-sm text-primary/80">{subtitle}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
