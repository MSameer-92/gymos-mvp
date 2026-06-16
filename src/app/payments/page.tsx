import { PaymentForm } from "@/components/PaymentForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreditCard, TrendingUp } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variants: {
    [key: string]: { bg: string; text: string; label: string };
  } = {
    paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
    failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
  };

  const variant = variants[status] || variants.pending;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variant.bg} ${variant.text}`}>
      {variant.label}
    </span>
  );
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ memberId?: string }>;
}) {
  const user = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedMemberId = resolvedSearchParams?.memberId ? Number(resolvedSearchParams.memberId) : undefined;
  const [members, payments] = await Promise.all([
    prisma.member.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { name: "asc" },
    }),
    prisma.payment.findMany({
      where: { tenantId: user.tenantId },
      include: { member: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Payments</h1>
        <p className="mt-2 text-gray-300">
          Manage and track member payments.
        </p>
      </div>

      {/* Revenue Card */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-white">
              PKR {Number(totalRevenue).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-gray-300">
              From {payments.filter((p) => p.paymentStatus === "paid").length} paid payments
            </p>
          </div>
          <div className="rounded-lg bg-purple-500/20 p-4">
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Add Payment Form */}
      <PaymentForm
        members={members.map((m) => ({ id: m.id, name: m.name, phone: m.phone }))}
        defaultMemberId={selectedMemberId}
      />

      {/* Payments Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-none overflow-hidden">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-white">No payments yet</h3>
            <p className="mt-1 text-gray-300">Record your first payment using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 bg-gray-950">
                <tr>
                  <th className="px-6 py-4 font-semibold text-white">Member</th>
                  <th className="px-6 py-4 font-semibold text-white">Amount</th>
                  <th className="px-6 py-4 font-semibold text-white">Method</th>
                  <th className="px-6 py-4 font-semibold text-white">Status</th>
                  <th className="px-6 py-4 font-semibold text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {payment.member.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      PKR {Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300 capitalize">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {payment.paidAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

}
