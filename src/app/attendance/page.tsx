import { AttendanceForm } from "@/components/AttendanceForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Activity } from "lucide-react";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams?: Promise<{ memberId?: string }>;
}) {
  const user = await requireUser();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedMemberId = resolvedSearchParams?.memberId ? Number(resolvedSearchParams.memberId) : undefined;

  const [members, attendance] = await Promise.all([
    prisma.member.findMany({ where: { tenantId: user.tenantId }, orderBy: { name: "asc" } }),
    prisma.attendance.findMany({
      where: { tenantId: user.tenantId, checkInAt: { gte: todayStart } },
      include: { member: true },
      orderBy: { checkInAt: "desc" },
    }),
  ]);

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Attendance</h2>
        <p className="text-gray-300">Mark today’s member check-ins.</p>
      </div>
      <AttendanceForm
        members={members.map((m) => ({ id: m.id, name: m.name, phone: m.phone }))}
        defaultMemberId={selectedMemberId}
      />
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-none">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-300">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Check-in Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {attendance.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium text-white">{row.member.name}</td>
                <td className="px-4 py-3 text-gray-300">{row.member.phone}</td>
                <td className="px-4 py-3 text-gray-300">{row.checkInAt.toLocaleTimeString()}</td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-300">
                  No check-ins today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}
