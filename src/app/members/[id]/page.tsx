import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Calendar, CreditCard, History, Medal, Phone, UserCheck, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Field, inputClass } from "@/components/Field";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function assignOrRenewPlan(formData: FormData) {
  "use server";

  const user = await requireUser();
  const memberId = Number(formData.get("memberId"));
  const planId = Number(formData.get("planId"));

  if (!memberId || !planId) {
    redirect(`/members/${memberId}`);
  }

  const [member, plan] = await Promise.all([
    prisma.member.findFirst({
      where: { id: memberId, tenantId: user.tenantId },
      select: { id: true },
    }),
    prisma.membershipPlan.findFirst({
      where: { id: planId, tenantId: user.tenantId },
      select: { id: true, durationDays: true },
    }),
  ]);

  if (!member || !plan) {
    notFound();
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.memberMembership.create({
    data: {
      tenantId: user.tenantId,
      memberId: member.id,
      planId: plan.id,
      startDate,
      endDate,
      status: "active",
    },
  });

  revalidatePath(`/members/${member.id}`);
  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/plans");
  redirect(`/members/${member.id}`);
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    Active: { bg: "bg-emerald-500/15", text: "text-emerald-300", label: "Active" },
    "Expiring Soon": { bg: "bg-amber-500/15", text: "text-amber-300", label: "Expiring Soon" },
    Expired: { bg: "bg-red-500/15", text: "text-red-300", label: "Expired" },
    "No Plan": { bg: "bg-slate-500/15", text: "text-slate-300", label: "No Plan" },
  };

  const variant = variants[status] ?? variants["No Plan"];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variant.bg} ${variant.text}`}>
      {variant.label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-none">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-3">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-1 text-sm font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const memberId = Number(id);

  const [member, plans, payments, attendance] = await Promise.all([
    prisma.member.findFirst({
      where: { id: memberId, tenantId: user.tenantId },
      include: {
        memberships: {
          orderBy: { endDate: "desc" },
          include: {
            plan: true,
          },
          take: 1,
        },
      },
    }),
    prisma.membershipPlan.findMany({
      where: { tenantId: user.tenantId, status: "active" },
      orderBy: { name: "asc" },
    }),
    prisma.payment.findMany({
      where: { tenantId: user.tenantId, memberId },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.attendance.findMany({
      where: { tenantId: user.tenantId, memberId },
      orderBy: { checkInAt: "desc" },
      take: 12,
    }),
  ]);

  if (!member) {
    notFound();
  }

  const currentMembership = member.memberships[0] ?? null;
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const membershipStatus = !currentMembership
    ? "No Plan"
    : currentMembership.endDate < now
      ? "Expired"
      : currentMembership.endDate <= sevenDaysFromNow
        ? "Expiring Soon"
        : "Active";

  const remainingDays = currentMembership
    ? Math.ceil((currentMembership.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 transition-colors hover:text-purple-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to members
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white">{member.name}</h1>
            <p className="mt-2 text-gray-300">Member profile and activity history.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/payments?memberId=${member.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Link>
          <Link
            href={`/attendance?memberId=${member.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-gray-800"
          >
            <UserCheck className="h-4 w-4" />
            Mark Attendance
          </Link>
          <a
            href="#assign-plan"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-gray-800"
          >
            <Medal className="h-4 w-4" />
            Assign / Renew Plan
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard icon={<Users className="h-5 w-5 text-purple-400" />} label="Phone" value={member.phone} />
            <StatCard icon={<Phone className="h-5 w-5 text-emerald-400" />} label="Email" value={member.email ?? "-"} />
            <StatCard icon={<Calendar className="h-5 w-5 text-blue-400" />} label="Joining Date" value={member.joiningDate.toLocaleDateString()} />
            <StatCard icon={<History className="h-5 w-5 text-amber-400" />} label="Gender" value={member.gender ?? "-"} />
            <StatCard icon={<UserCheck className="h-5 w-5 text-pink-400" />} label="Status" value={<StatusBadge status={membershipStatus} />} />
            <StatCard icon={<Calendar className="h-5 w-5 text-cyan-400" />} label="Remaining Days" value={remainingDays == null ? "No Plan" : `${remainingDays} days`} />
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Current Membership</h2>
                <p className="mt-1 text-sm text-gray-400">Latest active or recently expired plan on this member.</p>
              </div>
              <StatusBadge status={membershipStatus} />
            </div>

            {currentMembership ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Plan</p>
                  <p className="mt-1 text-sm font-semibold text-white">{currentMembership.plan.name}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Start Date</p>
                  <p className="mt-1 text-sm font-semibold text-white">{currentMembership.startDate.toLocaleDateString()}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">End Date</p>
                  <p className="mt-1 text-sm font-semibold text-white">{currentMembership.endDate.toLocaleDateString()}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Days Left</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {remainingDays != null ? `${remainingDays} days` : "-"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-5 text-sm text-gray-300">
                No active plan assigned yet.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Payment History</h2>
                <p className="mt-1 text-sm text-gray-400">Payments for this member in the current tenant.</p>
              </div>
              <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-300">
                {payments.length} records
              </span>
            </div>

            <div className="space-y-3">
              {payments.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-5 text-sm text-gray-300">
                  No payments yet for this member.
                </div>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        PKR {Number(payment.amount).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {payment.paymentMethod} • {payment.paidAt.toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {payment.paymentStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Attendance History</h2>
                <p className="mt-1 text-sm text-gray-400">Recent check-ins for this member.</p>
              </div>
              <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300">
                {attendance.length} records
              </span>
            </div>

            <div className="space-y-3">
              {attendance.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-5 text-sm text-gray-300">
                  No attendance history yet for this member.
                </div>
              ) : (
                attendance.map((row) => (
                  <div key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {row.checkInAt.toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Checked in at {row.checkInAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                      Present
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form
            id="assign-plan"
            action={assignOrRenewPlan}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none"
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Assign / Renew Plan</h2>
              <p className="mt-1 text-sm text-gray-400">Use an existing plan for this member.</p>
            </div>

            <input type="hidden" name="memberId" value={member.id} />
            <div className="space-y-4">
              <Field label="Membership Plan">
                <select className={inputClass} name="planId" required defaultValue="">
                  <option value="">Choose a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - PKR {Number(plan.price).toLocaleString()} / {plan.durationDays} days
                    </option>
                  ))}
                </select>
              </Field>

              <button className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500">
                Assign / Renew Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
