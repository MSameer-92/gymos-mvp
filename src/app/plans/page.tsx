import { PlanForm } from "@/components/PlanForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variants: {
    [key: string]: { bg: string; text: string; label: string };
  } = {
    active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    inactive: { bg: "bg-slate-100", text: "text-slate-700", label: "Inactive" },
  };

  const variant = variants[status] || variants.active;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variant.bg} ${variant.text}`}>
      {variant.label}
    </span>
  );
}

export default async function PlansPage() {
  const user = await requireUser();
  const plans = await prisma.membershipPlan.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Membership Plans</h1>
        <p className="mt-2 text-gray-300">
          Create and manage your gym membership plans.
        </p>
      </div>

      {/* Add Plan Form */}
      <PlanForm />

      {/* Plans Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-none overflow-hidden">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <Package className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-white">No plans yet</h3>
            <p className="mt-1 text-gray-300">Create your first membership plan above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 bg-gray-950">
                <tr>
                  <th className="px-6 py-4 font-semibold text-white">Plan Name</th>
                  <th className="px-6 py-4 font-semibold text-white">Duration</th>
                  <th className="px-6 py-4 font-semibold text-white">Price</th>
                  <th className="px-6 py-4 font-semibold text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {plan.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {plan.durationDays} days
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      PKR {Number(plan.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={plan.status} />
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
