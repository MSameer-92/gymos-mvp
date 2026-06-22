import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const selectedMemberId = Number(body?.selectedMemberId);

  if (!Number.isFinite(selectedMemberId)) {
    return NextResponse.json({ error: "selectedMemberId is required" }, { status: 400 });
  }

  const member = await prisma.member.findFirst({
    where: { id: selectedMemberId, tenantId: user.tenantId },
  });

  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  // Required mutation shape
  const updated = await prisma.member.update({
    where: { id: member.id },
    data: { status: "Inactive" },
  });

  return NextResponse.json({ member: updated });
}

