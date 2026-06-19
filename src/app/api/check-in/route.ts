import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { findMemberByPhone, recordAttendance } from "@/lib/attendance";

type CheckInBody = {
  phone?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckInBody;
  const phone = String(body.phone ?? "").trim();

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const member = await findMemberByPhone(phone);

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const result = await recordAttendance(member);

  if (result.alreadyCheckedIn) {
    return NextResponse.json({ error: "You are already checked in today." }, { status: 409 });
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  return NextResponse.json(
    {
      message: "Check-in recorded successfully.",
      attendance: result.attendance,
      member: {
        id: member.id,
        name: member.name,
      },
    },
    { status: 201 },
  );
}
