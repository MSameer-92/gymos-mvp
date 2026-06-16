import { unstable_noStore as noStore } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PremiumDashboardClient } from "./PremiumDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();
  const user = await requireUser();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalMembers,
    activeMembers,
    revenueThisMonth,
    todayAttendance,
    expiringSoon,
    recentMembers,
    subscription,
    inactiveMemberCount,
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
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.member.findMany({
        where: { tenantId: user.tenantId },
        select: {
          id: true,
          name: true,
          status: true,
          attendance: {
            where: { checkInAt: { gte: fourteenDaysAgo } },
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
      prisma.member.count({
        where: { tenantId: user.tenantId, status: "inactive" },
      }),
      prisma.attendance.count({
        where: { tenantId: user.tenantId, checkInAt: { gte: monthStart } },
      }),
    ]);

  const activeWindow = recentMembers.map((member) => {
    const latestMembership = member.memberships[0] ?? null;
    const hasRecentAttendance = member.attendance.length > 0;
    const isExpiringSoon =
      !!latestMembership && latestMembership.endDate >= todayStart && latestMembership.endDate <= sevenDaysFromNow;
    const isOverdue =
      !!latestMembership && latestMembership.endDate < todayStart;
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
  const inactiveMembers = inactiveMemberCount;
  const lowStockItems = expiringSoon;
  const coachHoursThisMonth = checkInsThisMonth;

  const recoverableRevenue = activeWindow.reduce((sum, member) => {
    if (!member.isRecoverable || !member.latestMembership?.plan?.price) return sum;
    return sum + Number(member.latestMembership.plan.price);
  }, 0);

  const attentionItems = [
    {
      label: "Expiring Soon",
      value: expiringSoon,
      description: "Members whose plans end within 7 days.",
      action: "Review members",
      href: "/members",
    },
    {
      label: "Overdue Payments",
      value: overduePayments,
      description: "Members whose latest membership has expired.",
      action: "Collect dues",
      href: "/payments",
    },
    {
      label: "Inactive Members",
      value: inactiveMembers,
      description: "Members with no check-in in the last 14 days.",
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
      coachHoursThisMonth={coachHoursThisMonth}
      recoverableRevenue={recoverableRevenue}
      attentionItems={attentionItems}
    />
  );
}
