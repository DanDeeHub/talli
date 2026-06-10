type Message = {
  name: string;
  text: string;
  time: string;
};

const messages: Message[] = [
  { name: "Mara Cruz", text: "PO #1042 is ready for approval.", time: "2m" },
  { name: "Dev Reyes", text: "Restocked 3 low-inventory items.", time: "1h" },
  { name: "Liza Tan", text: "New supplier added to the catalog.", time: "3h" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessageBoard() {
  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Message Board
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {messages.map(({ name, text, time }) => (
          <div key={name} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4edf1] text-xs font-semibold text-[#4d7d94]">
              {initials(name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-neutral-900">
                  {name}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{time}</span>
              </div>
              <p className="truncate text-sm text-neutral-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
