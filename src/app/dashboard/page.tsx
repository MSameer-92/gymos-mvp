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
  // Use gym timezone to avoid off-by-one-day issues
  const now = new Date();
  const tz = settings.business.timezone ?? "Asia/Karachi";
  const toTzDateOnly = (d: Date) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);

    const get = (type: string) => parts.find((p) => p.type === type)?.value;
    const year = Number(get("year"));
    const month = Number(get("month"));
    const day = Number(get("day"));

    return new Date(year, month - 1, day);
  };

  const todayStart = toTzDateOnly(now);
  // monthStart in gym timezone
  const monthStart = new Date(todayStart);
  monthStart.setDate(1);

  const today = new Date();
  const inactiveCutoff = new Date(
    now.getTime() - settings.alertRules.inactiveMemberDays * 24 * 60 * 60 * 1000
  );


  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringCutoff = new Date(now.getTime() + settings.alertRules.expiringSoonDays * 24 * 60 * 60 * 1000);

  // Grace window for overdue memberships.
  const overdueGraceDays = settings.alertRules.overduePaymentGraceDays ?? 0;
  const overdueCutoff = new Date(now.getTime() - overdueGraceDays * 24 * 60 * 60 * 1000);

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
    nextExpiringMembership,
    inactiveMembersRaw,
    overdueMembersRaw,
    collectDueCountRaw,
    collectDueAmountRaw,
    memberships,
    recentMembers,
    subscription,
    checkInsThisMonth,
  ] =
    await Promise.all([
      prisma.member.count({ where: { tenantId: user.tenantId } }),
      prisma.member.count({
        where: {
          tenantId: user.tenantId,
          status: "active",
        },
      }),

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
          endDate: {
            gte: todayStart,
            lte: expiringCutoff,
          },
        },
      }),
      prisma.memberMembership.findFirst({
        where: {
          tenantId: user.tenantId,
          endDate: { gt: todayStart },
        },
        orderBy: { endDate: "asc" },
        select: {
          endDate: true,
          member: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.member.count({
        where: {
          tenantId: user.tenantId,
          OR: [
            { status: "inactive" },
            {
              memberships: {
                some: {
                  endDate: { lt: today },
                },
              },
            },
          ],
        },
      }),
      prisma.memberMembership.count({
        where: {
          tenantId: user.tenantId,
          endDate: { lt: overdueCutoff },
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
    const isOverdue = !!latestMembership && latestMembership.endDate < overdueCutoff;
    const isInactive = member.status === "inactive" || (!!latestMembership && latestMembership.endDate < now);
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

  const overduePayments = overdueMembersRaw;
  const inactiveMembers = inactiveMembersRaw;
  const collectDueCount = collectDueCountRaw > 0 ? collectDueCountRaw : overduePayments;
  const collectDueAmount = Number(collectDueAmountRaw._sum.amount ?? 0);
  const coachHoursThisMonth = checkInsThisMonth;
  const expiringSoonNext =
    nextExpiringMembership != null
      ? {
          memberName: nextExpiringMembership.member.name,
          dateLabel: new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            month: "short",
            day: "numeric",
          }).format(nextExpiringMembership.endDate),
        }
      : null;
  const oldestOverdueMembership = memberships
    .filter((membership) => membership.endDate < overdueCutoff)
    .reduce<(typeof memberships)[number] | null>((oldest, membership) => {
      if (!oldest) return membership;
      return membership.endDate < oldest.endDate ? membership : oldest;
    }, null);
  const overdueOldestDays = oldestOverdueMembership
    ? Math.max(
        0,
        Math.floor((now.getTime() - oldestOverdueMembership.endDate.getTime()) / (24 * 60 * 60 * 1000))
      )
    : 0;

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
      label: "Overdue Members",
      value: overduePayments,
      description: `Members whose latest membership has expired by more than ${overdueGraceDays} day(s).`,
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
      expiringSoonNext={expiringSoonNext}
      revenueThisMonth={Number(revenueThisMonth._sum.amount ?? 0)}
      todayAttendance={todayAttendance}
      overduePayments={overduePayments}
      overdueOldestDays={overdueOldestDays}
      inactiveMembers={inactiveMembers}
      lowStockItems={0}
      collectDueCount={collectDueCount}
      collectDueAmount={collectDueAmount}
      coachHoursThisMonth={coachHoursThisMonth}
      recoverableRevenue={recoverableRevenue}
      attentionItems={attentionItems}
    />
  );
}
