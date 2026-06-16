import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalMembers, activeMembers, totalPayments, todayAttendance, expiringSoon] = await Promise.all([
    prisma.member.count({ where: { tenantId: user.tenantId } }),
    prisma.member.count({ where: { tenantId: user.tenantId, status: "active" } }),
    prisma.payment.aggregate({ where: { tenantId: user.tenantId, paymentStatus: "paid" }, _sum: { amount: true } }),
    prisma.attendance.count({ where: { tenantId: user.tenantId, checkInAt: { gte: todayStart } } }),
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
  ]);

  return NextResponse.json({
    totalMembers,
    activeMembers,
    expiringSoon,
    totalPayments: Number(totalPayments._sum.amount ?? 0),
    todayAttendance,
  });
}
