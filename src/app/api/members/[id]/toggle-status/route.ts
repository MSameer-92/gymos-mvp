import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const memberId = Number(id);

  if (!Number.isFinite(memberId)) {
    return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
  }

  const member = await prisma.member.findFirst({
    where: { id: memberId, tenantId: user.tenantId },
  });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const nextStatus = member.status === "active" ? "inactive" : "active";

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: { status: nextStatus },
  });

  return NextResponse.json(updated);
}

