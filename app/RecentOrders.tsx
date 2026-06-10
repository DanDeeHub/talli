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

      <div className="mt-4 flow-root">
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
              <tr key={id}>
                <td className="py-3 font-medium text-neutral-900">{id}</td>
                <td className="py-3 text-neutral-500">{supplier}</td>
                <td className="py-3 text-right font-medium text-neutral-900">
                  {amount}
                </td>
                <td className="py-3 text-right">
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
