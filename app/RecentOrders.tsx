type Status = "Delivered" | "Processing" | "Pending";

type Order = {
  id: string;
  supplier: string;
  amount: string;
  status: Status;
};

const statusStyles: Record<Status, string> = {
  Delivered: "bg-[#eef2dd] text-[#7d8f3c]",
  Processing: "bg-[#e4edf1] text-[#4d7d94]",
  Pending: "bg-[#f5e7ee] text-[#a6516f]",
};

const orders: Order[] = [
  { id: "PO-1042", supplier: "Acme Supplies", amount: "₱24,500", status: "Delivered" },
  { id: "PO-1041", supplier: "Northwind Traders", amount: "₱12,180", status: "Processing" },
  { id: "PO-1040", supplier: "Globex Corp", amount: "₱8,940", status: "Pending" },
  { id: "PO-1039", supplier: "Umbrella Foods", amount: "₱31,720", status: "Delivered" },
];

export default function RecentOrders() {
  return (
    <div className="h-full w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Recent Orders
      </h2>

      <div className="mt-4 flex flex-col gap-2 sm:hidden">
        {orders.map(({ id, supplier, amount, status }) => (
          <div
            key={id}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-primary/5"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-neutral-900">{id}</p>
              <p className="truncate text-xs text-neutral-500">{supplier}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-medium text-neutral-900">{amount}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
              >
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 hidden flow-root sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="pb-2 font-medium">Order</th>
              <th className="pb-2 font-medium">Supplier</th>
              <th className="pb-2 text-right font-medium">Amount</th>
              <th className="pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map(({ id, supplier, amount, status }) => (
              <tr
                key={id}
                className="cursor-pointer transition-colors hover:bg-primary/5"
              >
                <td className="rounded-l-lg py-3 pl-2 font-medium text-neutral-900">
                  {id}
                </td>
                <td className="py-3 text-neutral-500">
                  <span className="block max-w-[10rem] truncate">
                    {supplier}
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-neutral-900">
                  {amount}
                </td>
                <td className="rounded-r-lg py-3 pr-2 text-right">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
