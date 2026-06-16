import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const member = await prisma.member.findFirst({
    where: { id: Number(id), tenantId: user.tenantId },
  });

  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const member = await prisma.member.findFirst({ where: { id: Number(id), tenantId: user.tenantId } });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      name: String(body.name ?? member.name),
      phone: String(body.phone ?? member.phone),
      email: body.email ? String(body.email) : member.email,
      gender: body.gender ? String(body.gender) : member.gender,
      status: body.status ? String(body.status) : member.status,
    },
  });

  return NextResponse.json({ member: updated });
}
