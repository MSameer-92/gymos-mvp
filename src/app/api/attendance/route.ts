import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findMany({
    where: { tenantId: user.tenantId, checkInAt: { gte: todayStart } },
    include: { member: true },
    orderBy: { checkInAt: "desc" },
  });

  return NextResponse.json({ attendance });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const memberId = Number(body.memberId);

  if (!memberId) return NextResponse.json({ error: "Member is required" }, { status: 400 });

  const member = await prisma.member.findFirst({ where: { id: memberId, tenantId: user.tenantId } });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const attendance = await prisma.attendance.create({ data: { tenantId: user.tenantId, memberId } });

  return NextResponse.json({ attendance }, { status: 201 });
}
