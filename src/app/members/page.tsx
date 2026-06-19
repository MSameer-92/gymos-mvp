import { MemberForm } from "@/components/MemberForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variants: {
    [key: string]: { bg: string; text: string; label: string };
  } = {
    active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    inactive: { bg: "bg-slate-100", text: "text-slate-700", label: "Inactive" },
    expired: { bg: "bg-red-100", text: "text-red-700", label: "Expired" },
  };

  const variant = variants[status] || variants.inactive;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variant.bg} ${variant.text}`}>
      {variant.label}
    </span>
  );
}

export default async function MembersPage() {
  const user = await requireUser();
  const members = await prisma.member.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Members</h1>
        <p className="mt-2 text-gray-300">
          Manage your gym members and their information.
        </p>
      </div>

      <div className="space-y-8">
        {/* Add Member Form */}
        <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30">
          <MemberForm />
        </div>

        {/* Members Table */}
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-white">No members yet</h3>
              <p className="mt-1 text-gray-300">
                Add your first member using the form above.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-gray-800 bg-gray-950">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-white">Name</th>
                    <th className="px-6 py-4 font-semibold text-white">Phone</th>
                    <th className="px-6 py-4 font-semibold text-white">Email</th>
                    <th className="px-6 py-4 font-semibold text-white">Gender</th>
                    <th className="px-6 py-4 font-semibold text-white">Status</th>
                    <th className="px-6 py-4 font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{member.phone}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {member.email ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-300 capitalize">
                        {member.gender ?? "-"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/members/${member.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-semibold text-purple-300 transition-colors hover:border-purple-500 hover:bg-gray-800 hover:text-purple-200"
                        >
                          View / Manage
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
