import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultPlans } from "@/lib/default-plans";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await ensureDefaultPlans(user.tenantId);

  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const durationDays = Number(body.durationDays);
  const price = Number(body.price);
  const status = String(body.status ?? "active").trim();

  if (!name || !durationDays || !price) {
    return NextResponse.json({ error: "Name, duration and price are required" }, { status: 400 });
  }

  const plan = await prisma.plan.create({
    data: { tenantId: user.tenantId, name, durationDays, price, status },
  });

  return NextResponse.json({ plan }, { status: 201 });
}
