import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export type AuthPayload = {
  userId: number;
  tenantId: number;
  role: string;
};

const COOKIE_NAME = "gymos_token";

export function signAuthToken(payload: AuthPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthPayload(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const payload = await getAuthPayload();
  if (!payload) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
      tenantId: payload.tenantId,
    },
    include: {
      tenant: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    tenantId: user.tenantId,
    name: user.name,
    email: user.email,
    role: user.role,
    tenant: user.tenant,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
