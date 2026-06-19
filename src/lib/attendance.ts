import { prisma } from "./prisma";

export function startOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function findMemberByPhone(phone: string) {
  const trimmedPhone = phone.trim();
  const normalizedPhone = normalizePhone(trimmedPhone);

  if (!trimmedPhone || !normalizedPhone) {
    return null;
  }

  const members = await prisma.member.findMany({
    select: {
      id: true,
      tenantId: true,
      name: true,
      phone: true,
    },
  });

  return (
    members.find((member) => member.phone.trim() === trimmedPhone) ??
    members.find((member) => normalizePhone(member.phone) === normalizedPhone) ??
    null
  );
}

export async function recordAttendance(member: { id: number; tenantId: number }, now = new Date()) {
  const todayStart = startOfDay(now);

  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      tenantId: member.tenantId,
      memberId: member.id,
      checkInAt: {
        gte: todayStart,
      },
    },
    select: {
      id: true,
      checkInAt: true,
    },
  });

  if (existingAttendance) {
    return {
      alreadyCheckedIn: true as const,
      attendance: existingAttendance,
    };
  }

  const attendance = await prisma.attendance.create({
    data: {
      tenantId: member.tenantId,
      memberId: member.id,
      checkInAt: now,
    },
  });

  return {
    alreadyCheckedIn: false as const,
    attendance,
  };
}
