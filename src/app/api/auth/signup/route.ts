import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { setAuthCookie, signAuthToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ownerName = String(body.ownerName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const gymName = String(body.gymName ?? "").trim();

    if (!ownerName || !email || !password || !gymName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const baseSlug = createSlug(gymName);
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        name: gymName,
        slug,
        status: "active",
        subscriptions: {
          create: {
            planName: "starter",
            status: "trial",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        },
        users: {
          create: {
            name: ownerName,
            email,
            passwordHash,
            role: "owner",
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    const token = signAuthToken({ userId: user.id, tenantId: tenant.id, role: user.role });
    await setAuthCookie(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
