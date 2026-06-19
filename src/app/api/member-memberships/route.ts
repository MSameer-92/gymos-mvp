import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { ensureDefaultPlans } from "@/lib/default-plans";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const memberId = Number(body.memberId);
  const planId = Number(body.planId);
  const startDateRaw = String(body.startDate ?? "");
  const endDateRaw = String(body.endDate ?? "");

  if (!memberId || !planId || !startDateRaw || !endDateRaw) {
    return NextResponse.json({ error: "Member, plan, start date, and end date are required" }, { status: 400 });
  }

  await ensureDefaultPlans(user.tenantId);

  const [member, plan] = await Promise.all([
    prisma.member.findFirst({
      where: { id: memberId, tenantId: user.tenantId },
      select: { id: true },
    }),
    prisma.plan.findFirst({
      where: { id: planId, tenantId: user.tenantId },
      select: { id: true },
    }),
  ]);

  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const startDate = new Date(`${startDateRaw}T00:00:00`);
  const endDate = new Date(`${endDateRaw}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const status = endDate <= todayStart ? "expired" : "active";

  await prisma.memberMembership.create({
    data: {
      tenantId: user.tenantId,
      memberId: member.id,
      planId: plan.id,
      startDate,
      endDate,
      status,
    },
  });

  await prisma.member.updateMany({
    where: { id: member.id, tenantId: user.tenantId },
    data: { status },
  });

  revalidatePath(`/members/${member.id}`);
  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/plans");

  return NextResponse.json({ ok: true }, { status: 201 });
}
