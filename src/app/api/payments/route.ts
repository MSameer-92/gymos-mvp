import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { tenantId: user.tenantId },
    include: { member: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ payments });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const memberId = Number(body.memberId);
  const amount = Number(body.amount);
  const paymentMethod = String(body.paymentMethod ?? "cash");
  const paymentStatus = String(body.paymentStatus ?? "paid");

  if (!memberId || !amount) {
    return NextResponse.json({ error: "Member and amount are required" }, { status: 400 });
  }

  const member = await prisma.member.findFirst({ where: { id: memberId, tenantId: user.tenantId } });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const payment = await prisma.payment.create({
    data: { tenantId: user.tenantId, memberId, amount, paymentMethod, paymentStatus },
  });

  return NextResponse.json({ payment }, { status: 201 });
}
