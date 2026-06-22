import { unstable_noStore as noStore } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGymSettings } from "@/lib/gym-settings";
import { RemindersClient } from "./RemindersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReminderCategory = "expiring" | "expired" | "inactive" | "payment";

function buildMessage(template: string, memberName: string) {
  return template.replaceAll("[Member Name]", memberName);
}

export default async function RemindersPage() {
  noStore();
  const user = await requireUser();
  const settings = await getGymSettings(user.tenantId);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const inactiveCutoff = new Date(Date.now() - settings.alertRules.inactiveMemberDays * 24 * 60 * 60 * 1000);
  const expiringCutoff = new Date(Date.now() + settings.alertRules.expiringSoonDays * 24 * 60 * 60 * 1000);

  const members = await prisma.member.findMany({
    where: { tenantId: user.tenantId },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      memberships: {
        orderBy: { endDate: "desc" },
        take: 1,
        select: {
          endDate: true,
          startDate: true,
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
          paymentStatus: true,
          amount: true,
          paidAt: true,
        },
      },
    },
  });

  const reminderRows = members.flatMap((member) => {
    const currentMembership = member.memberships[0] ?? null;
    const hasRecentAttendance = member.attendance.length > 0;
    const duePayment = member.payments[0] ?? null;

    const rows: Array<{
      id: string;
      memberId: number;
      memberName: string;
      phone: string;
      email: string | null;
      category: ReminderCategory;
      reason: string;
      suggestedMessage: string;
    }> = [];

    if (currentMembership && currentMembership.endDate >= todayStart && currentMembership.endDate <= expiringCutoff) {
      rows.push({
        id: `${member.id}-expiring`,
        memberId: member.id,
        memberName: member.name,
        phone: member.phone,
        email: member.email,
        category: "expiring",
        reason: `Expiring in ${Math.ceil((currentMembership.endDate.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000))} days`,
        suggestedMessage: buildMessage(settings.reminderTemplates.expiringSoon, member.name),
      });
    }

    if (currentMembership && currentMembership.endDate < todayStart) {
      rows.push({
        id: `${member.id}-expired`,
        memberId: member.id,
        memberName: member.name,
        phone: member.phone,
        email: member.email,
        category: "expired",
        reason: `Membership expired on ${currentMembership.endDate.toLocaleDateString()}`,
        suggestedMessage: buildMessage(settings.reminderTemplates.expiredMembership, member.name),
      });
    }

    if (!hasRecentAttendance) {
      rows.push({
        id: `${member.id}-inactive`,
        memberId: member.id,
        memberName: member.name,
        phone: member.phone,
        email: member.email,
        category: "inactive",
        reason: `No check-in in the last ${settings.alertRules.inactiveMemberDays} days`,
        suggestedMessage: buildMessage(settings.reminderTemplates.inactiveMember, member.name),
      });
    }

    if (duePayment) {
      rows.push({
        id: `${member.id}-payment`,
        memberId: member.id,
        memberName: member.name,
        phone: member.phone,
        email: member.email,
        category: "payment",
        reason: `Payment ${duePayment.paymentStatus}`,
        suggestedMessage: buildMessage(settings.reminderTemplates.paymentReminder, member.name),
      });
    }

    return rows;
  });

  const birthdaySupport = false;

  const stats = {
    total: reminderRows.length,
    expiring: reminderRows.filter((row) => row.category === "expiring").length,
    expired: reminderRows.filter((row) => row.category === "expired").length,
    inactive: reminderRows.filter((row) => row.category === "inactive").length,
    payment: reminderRows.filter((row) => row.category === "payment").length,
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Reminders</h1>
          <p className="mt-2 text-gray-300">Automation Center for manual follow-up and reminder prep.</p>
        </div>
      </div>

      <RemindersClient
        reminders={reminderRows}
        stats={stats}
        birthdaySupport={birthdaySupport}
      />
    </div>
  );
}
