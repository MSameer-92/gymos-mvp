import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getGymSettings } from "@/lib/gym-settings";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Badge({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "emerald" | "amber" | "red" | "slate" | "cyan" }) {
  const tones = {
    purple: "bg-purple-500/15 text-purple-200",
    emerald: "bg-emerald-500/15 text-emerald-200",
    amber: "bg-amber-500/15 text-amber-200",
    red: "bg-red-500/15 text-red-200",
    slate: "bg-slate-500/15 text-slate-200",
    cyan: "bg-cyan-500/15 text-cyan-200",
  } as const;

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export default async function ReportsPage() {
  noStore();
  const user = await requireUser();
  const settings = await getGymSettings(user.tenantId);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const inactiveCutoff = new Date(Date.now() - settings.alertRules.inactiveMemberDays * 24 * 60 * 60 * 1000);
  const expiringCutoff = new Date(Date.now() + settings.alertRules.expiringSoonDays * 24 * 60 * 60 * 1000);

  const [
    allMembers,
    revenuePayments,
    paidPaymentCount,
    activeMemberCount,
    attendanceTodayCount,
    attendanceMonthCount,
  ] = await Promise.all([
    prisma.member.findMany({
      where: { tenantId: user.tenantId },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        memberships: {
          orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
          take: 1,
          select: {
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
        attendance: {
          where: { checkInAt: { gte: inactiveCutoff } },
          select: { id: true },
          take: 1,
        },
        payments: {
          where: { paymentStatus: { in: ["pending", "unpaid", "partial"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            paymentStatus: true,
            amount: true,
            paidAt: true,
          },
        },
      },
    }),
    prisma.payment.findMany({
      where: { tenantId: user.tenantId, paidAt: { gte: monthStart } },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.count({
      where: { tenantId: user.tenantId, paymentStatus: "paid" },
    }),
    prisma.member.count({
      where: { tenantId: user.tenantId, status: "active" },
    }),
    prisma.attendance.count({
      where: { tenantId: user.tenantId, checkInAt: { gte: todayStart } },
    }),
    prisma.attendance.count({
      where: { tenantId: user.tenantId, checkInAt: { gte: monthStart } },
    }),
  ]);

  const memberData = allMembers.map((member) => {
    const currentMembership = member.memberships[0] ?? null;
    const isInactive = member.attendance.length === 0;
    const isExpiringSoon =
      !!currentMembership &&
      currentMembership.endDate >= todayStart &&
      currentMembership.endDate <= expiringCutoff;
    const isExpired = !!currentMembership && currentMembership.endDate < todayStart;
    const hasPendingPayment = member.payments.length > 0;

    return {
      ...member,
      currentMembership,
      isInactive,
      isExpiringSoon,
      isExpired,
      hasPendingPayment,
    };
  });

  const totalRevenueThisMonth = revenuePayments
    .filter((payment) => payment.paymentStatus === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const expiredMembers = memberData.filter((member) => member.isExpired);
  const expiringSoonMembers = memberData.filter((member) => member.isExpiringSoon);
  const inactiveMembers = memberData.filter((member) => member.isInactive);
  const overdueMembers = memberData.filter((member) => member.hasPendingPayment);

  const followUpMap = new Map<
    number,
    {
      id: number;
      name: string;
      phone: string;
      reasons: Set<string>;
      suggestedAction: string;
    }
  >();

  const upsertQueue = (member: { id: number; name: string; phone: string }, reason: string, suggestedAction: string) => {
    const existing = followUpMap.get(member.id);
    if (existing) {
      existing.reasons.add(reason);
      if (existing.suggestedAction === "Review member" || suggestedAction === "Collect dues") {
        existing.suggestedAction = suggestedAction;
      }
      return;
    }

    followUpMap.set(member.id, {
      id: member.id,
      name: member.name,
      phone: member.phone,
      reasons: new Set([reason]),
      suggestedAction,
    });
  };

  expiringSoonMembers.forEach((member) =>
    upsertQueue(
      member,
      `Expiring in ${Math.ceil((member.currentMembership!.endDate.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000))} days`,
      "Renew membership",
    ),
  );

  expiredMembers.forEach((member) =>
    upsertQueue(member, `Membership expired on ${member.currentMembership!.endDate.toLocaleDateString()}`, "Renew membership"),
  );

  inactiveMembers.forEach((member) => upsertQueue(member, "No check-in in the last 14 days", "Send attendance reminder"));

  overdueMembers.forEach((member) => upsertQueue(member, "Pending / unpaid payment", "Collect dues"));

  const followUpQueue = Array.from(followUpMap.values()).map((item) => ({
    ...item,
    reasons: Array.from(item.reasons).join(", "),
  }));

  const revenueRows = revenuePayments.map((payment) => ({
    id: payment.id,
    memberName: payment.member.name,
    amount: `PKR ${Number(payment.amount).toLocaleString()}`,
    paymentMethod: payment.paymentMethod,
    status: payment.paymentStatus,
    date: payment.paidAt.toLocaleDateString(),
  }));

  const expiringRows = expiringSoonMembers.map((member) => ({
    memberName: member.name,
    phone: member.phone,
    planName: member.currentMembership?.plan.name ?? "-",
    endDate: member.currentMembership?.endDate.toLocaleDateString() ?? "-",
    remainingDays: member.currentMembership
      ? `${Math.max(0, Math.ceil((member.currentMembership.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))} days`
      : "-",
  }));

  const expiredRows = expiredMembers.map((member) => ({
    memberName: member.name,
    phone: member.phone,
    lastPlan: member.currentMembership?.plan.name ?? "-",
    expiredDate: member.currentMembership?.endDate.toLocaleDateString() ?? "-",
  }));

  const attendanceRows = await prisma.attendance.findMany({
    where: { tenantId: user.tenantId, checkInAt: { gte: monthStart } },
    include: {
      member: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { checkInAt: "desc" },
    take: 20,
  }).then((rows) =>
    rows.map((row) => ({
      memberName: row.member.name,
      phone: row.member.phone,
      checkInTime: row.checkInAt.toLocaleString(),
    })),
  );

  const queueRows = followUpQueue.map((row) => ({
    memberName: row.name,
    phone: row.phone,
    reason: row.reasons,
    suggestedAction: row.suggestedAction,
  }));

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Reports</h1>
          <p className="mt-2 text-gray-300">Real-time owner reports for your gym workspace.</p>
        </div>
        <ReportsClient
          revenueRows={revenueRows}
          expiringRows={expiringRows}
          expiredRows={expiredRows}
          attendanceRows={attendanceRows}
          queueRows={queueRows}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Total Revenue This Month</p>
          <p className="mt-2 text-3xl font-black text-white">PKR {totalRevenueThisMonth.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Total Paid Payments</p>
          <p className="mt-2 text-3xl font-black text-white">{paidPaymentCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Active Members</p>
          <p className="mt-2 text-3xl font-black text-white">{activeMemberCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Expired Members</p>
          <p className="mt-2 text-3xl font-black text-white">{expiredMembers.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Expiring Soon</p>
          <p className="mt-2 text-3xl font-black text-white">{expiringSoonMembers.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Attendance Today</p>
          <p className="mt-2 text-3xl font-black text-white">{attendanceTodayCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Attendance This Month</p>
          <p className="mt-2 text-3xl font-black text-white">{attendanceMonthCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Inactive Members</p>
          <p className="mt-2 text-3xl font-black text-white">{inactiveMembers.length}</p>
        </div>
      </div>

      <SectionCard title="Revenue Report" description="Payments recorded for the current month.">
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-300">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {revenueRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/60">
                  <td className="px-4 py-3 font-medium text-white">{row.memberName}</td>
                  <td className="px-4 py-3 text-gray-300">{row.amount}</td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{row.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.status === "paid" ? "emerald" : row.status === "pending" ? "amber" : "red"}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{row.date}</td>
                </tr>
              ))}
              {revenueRows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-300" colSpan={5}>
                    No revenue records for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Member Status Report" description="Current membership state across active, expiring, and expired members.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">Active</p>
              <p className="mt-2 text-2xl font-black text-white">{activeMemberCount}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">Expired</p>
              <p className="mt-2 text-2xl font-black text-white">{expiredMembers.length}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">Expiring Soon</p>
              <p className="mt-2 text-2xl font-black text-white">{expiringSoonMembers.length}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">No Check-in {settings.alertRules.inactiveMemberDays}d</p>
              <p className="mt-2 text-2xl font-black text-white">{inactiveMembers.length}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Attendance Report" description="Recent check-ins from the current month.">
          <div className="overflow-hidden rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Check-in Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {attendanceRows.map((row) => (
                  <tr key={`${row.memberName}-${row.checkInTime}`} className="hover:bg-gray-800/60">
                    <td className="px-4 py-3 font-medium text-white">{row.memberName}</td>
                    <td className="px-4 py-3 text-gray-300">{row.phone}</td>
                    <td className="px-4 py-3 text-gray-300">{row.checkInTime}</td>
                  </tr>
                ))}
                {attendanceRows.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-300" colSpan={3}>
                      No attendance records for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Membership Expiry Report" description="Members whose plans expire soon or have already expired.">
          <div className="space-y-4">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Expiring Soon</h3>
                <Badge tone="amber">{expiringSoonMembers.length}</Badge>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-950 text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">End Date</th>
                      <th className="px-4 py-3">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {expiringRows.map((row) => (
                      <tr key={`${row.memberName}-${row.endDate}`} className="hover:bg-gray-800/60">
                        <td className="px-4 py-3 font-medium text-white">{row.memberName}</td>
                        <td className="px-4 py-3 text-gray-300">{row.phone}</td>
                        <td className="px-4 py-3 text-gray-300">{row.planName}</td>
                        <td className="px-4 py-3 text-gray-300">{row.endDate}</td>
                        <td className="px-4 py-3 text-gray-300">{row.remainingDays}</td>
                      </tr>
                    ))}
                    {expiringRows.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-gray-300" colSpan={5}>
                          No members expiring in the next 7 days.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Expired / Overdue</h3>
                <Badge tone="red">{expiredMembers.length}</Badge>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-950 text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Last Plan</th>
                      <th className="px-4 py-3">Expired Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {expiredRows.map((row) => (
                      <tr key={`${row.memberName}-${row.expiredDate}`} className="hover:bg-gray-800/60">
                        <td className="px-4 py-3 font-medium text-white">{row.memberName}</td>
                        <td className="px-4 py-3 text-gray-300">{row.phone}</td>
                        <td className="px-4 py-3 text-gray-300">{row.lastPlan}</td>
                        <td className="px-4 py-3 text-gray-300">{row.expiredDate}</td>
                      </tr>
                    ))}
                    {expiredRows.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-gray-300" colSpan={4}>
                          No expired memberships found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Payment Collection Report" description="Unpaid or pending payment records that may need follow-up.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">Pending / Unpaid Members</p>
              <p className="mt-2 text-2xl font-black text-white">{overdueMembers.length}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <p className="text-xs text-gray-500">Paid Payments Count</p>
              <p className="mt-2 text-2xl font-black text-white">{paidPaymentCount}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Daily Follow-up Queue"
        description="Members needing action today based on expiry, attendance, or pending dues."
      >
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-300">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Suggested Action</th>
                <th className="px-4 py-3">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {followUpQueue.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/60">
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-3 text-gray-300">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-300">{row.reasons}</td>
                  <td className="px-4 py-3 text-gray-300">{row.suggestedAction}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/members/${row.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-semibold text-purple-300 transition-colors hover:border-purple-500 hover:bg-gray-800 hover:text-purple-200"
                    >
                      Manage
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {followUpQueue.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-300" colSpan={5}>
                    No follow-up actions are needed right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
