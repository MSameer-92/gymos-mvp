import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const members = await prisma.member.findMany({
    where: {
      tenantId: user.tenantId,
      OR: q
        ? [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim() || null;
  const gender = String(body.gender ?? "").trim() || null;
  const status = String(body.status ?? "active").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const member = await prisma.member.create({
    data: { tenantId: user.tenantId, name, phone, email, gender, status },
  });

  return NextResponse.json({ member }, { status: 201 });
}
