import { unstable_noStore as noStore } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGymSettings } from "@/lib/gym-settings";
import { PremiumDashboardClient } from "./PremiumDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();
  const user = await requireUser();
  const settings = await getGymSettings(user.tenantId);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const inactiveCutoff = new Date(Date.now() - settings.alertRules.inactiveMemberDays * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const expiringCutoff = new Date(Date.now() + settings.alertRules.expiringSoonDays * 24 * 60 * 60 * 1000);
  const collectDueWhere = {
    tenantId: user.tenantId,
    paymentStatus: {
      not: "paid",
    },
  } as const;

  const [
    totalMembers,
    activeMembers,
    revenueThisMonth,
    todayAttendance,
    expiringSoon,
    collectDueCountRaw,
    collectDueAmountRaw,
    memberships,
    recentMembers,
    subscription,
    checkInsThisMonth,
  ] =
    await Promise.all([
      prisma.member.count({ where: { tenantId: user.tenantId } }),
      prisma.member.count({ where: { tenantId: user.tenantId, status: "active" } }),
      prisma.payment.aggregate({
        where: {
          tenantId: user.tenantId,
          paymentStatus: "paid",
          paidAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.attendance.count({
        where: { tenantId: user.tenantId, checkInAt: { gte: todayStart } },
      }),
      prisma.memberMembership.count({
        where: {
          tenantId: user.tenantId,
          status: "active",
          endDate: {
            gte: new Date(),
            lte: expiringCutoff,
          },
        },
      }),
      prisma.payment.count({
        where: collectDueWhere,
      }),
      prisma.payment.aggregate({
        where: collectDueWhere,
        _sum: { amount: true },
      }),
      prisma.memberMembership.findMany({
        where: { tenantId: user.tenantId },
        select: {
          memberId: true,
          endDate: true,
          createdAt: true,
          plan: {
            select: {
              price: true,
            },
          },
        },
        orderBy: [
          { memberId: "asc" },
          { endDate: "desc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.member.findMany({
        where: { tenantId: user.tenantId },
        select: {
          id: true,
          name: true,
          status: true,
          attendance: {
            where: { checkInAt: { gte: inactiveCutoff } },
            select: { id: true },
            take: 1,
          },
          memberships: {
            orderBy: { endDate: "desc" },
            take: 1,
            select: {
              endDate: true,
              status: true,
              plan: {
                select: {
                  price: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.subscription.findFirst({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.attendance.count({
        where: { tenantId: user.tenantId, checkInAt: { gte: monthStart } },
      }),
    ]);

  const latestMembershipByMember = new Map<
    number,
    (typeof memberships)[number] | null
  >();
  for (const membership of memberships) {
    if (!latestMembershipByMember.has(membership.memberId)) {
      latestMembershipByMember.set(membership.memberId, membership);
    }
  }

  const activeWindow = recentMembers.map((member) => {
    const latestMembership = latestMembershipByMember.get(member.id) ?? member.memberships[0] ?? null;
    const hasRecentAttendance = member.attendance.length > 0;
    const isExpiringSoon =
      !!latestMembership && latestMembership.endDate >= todayStart && latestMembership.endDate <= expiringCutoff;
    const isOverdue = !!latestMembership && latestMembership.endDate < todayStart;
    const isInactive = !hasRecentAttendance;
    const isRecoverable =
      !!latestMembership &&
      latestMembership.endDate <= thirtyDaysFromNow &&
      latestMembership.plan?.price != null;

    return {
      ...member,
      latestMembership,
      hasRecentAttendance,
      isExpiringSoon,
      isOverdue,
      isInactive,
      isRecoverable,
    };
  });

  const overduePayments = activeWindow.filter((member) => member.isOverdue).length;
  const inactiveMembers = activeWindow.filter((member) => member.isInactive).length;
  const lowStockItems = expiringSoon;
  const collectDueCount = collectDueCountRaw > 0 ? collectDueCountRaw : overduePayments;
  const collectDueAmount = Number(collectDueAmountRaw._sum.amount ?? 0);
  const coachHoursThisMonth = checkInsThisMonth;

  const recoverableRevenue = activeWindow.reduce((sum, member) => {
    if (!member.isRecoverable || !member.latestMembership?.plan?.price) return sum;
    return sum + Number(member.latestMembership.plan.price);
  }, 0);

  const attentionItems = [
    {
      label: "Expiring Soon",
      value: expiringSoon,
      description: `Members whose plans end within ${settings.alertRules.expiringSoonDays} days.`,
      action: "Review members",
      href: "/members",
    },
    {
      label: "Overdue Payments",
      value: overduePayments,
      description: "Members whose latest membership has expired.",
      action: "Review overdue",
      href: "/reports",
    },
    {
      label: "Inactive Members",
      value: inactiveMembers,
      description: `Members with no check-in in the last ${settings.alertRules.inactiveMemberDays} days.`,
      action: "View activity",
      href: "/attendance",
    },
    {
      label: "Low Stock Items",
      value: lowStockItems,
      description: "Inventory warnings are not modeled yet in this MVP.",
      action: "Open inventory",
      href: "/inventory",
    },
    {
      label: "Collect Due",
      value: collectDueCount,
      description: "Pending member dues.",
      action: "Collect dues",
      href: "/payments",
    },
  ];

  return (
    <PremiumDashboardClient
      userTenantName={user.tenant.name}
      userName={user.name ?? user.email ?? "Muhammad Sameer"}
      subscription={subscription ? { status: (subscription as any).status, planName: (subscription as any).planName } : null}
      totalMembers={totalMembers}
      activeMembers={activeMembers}
      expiringSoon={expiringSoon}
      revenueThisMonth={Number(revenueThisMonth._sum.amount ?? 0)}
      todayAttendance={todayAttendance}
      overduePayments={overduePayments}
      inactiveMembers={inactiveMembers}
      lowStockItems={lowStockItems}
      collectDueCount={collectDueCount}
      collectDueAmount={collectDueAmount}
      coachHoursThisMonth={coachHoursThisMonth}
      recoverableRevenue={recoverableRevenue}
      attentionItems={attentionItems}
    />
  );
}
