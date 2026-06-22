import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Bell, Clock3, Settings, Shield, Sparkles, Zap } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { Field, inputClass } from "@/components/Field";
import {
  DEFAULT_GYM_SETTINGS,
  getGymSettings,
  sanitizeGymSettings,
  saveGymSettings,
} from "@/lib/gym-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveSettings(formData: FormData) {
  "use server";

  const user = await requireUser();

  const settings = sanitizeGymSettings({
    gymInfo: {
      gymName: String(formData.get("gymName") ?? ""),
      gymSlug: String(formData.get("gymSlug") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
    },
    business: {
      currency: String(formData.get("currency") ?? DEFAULT_GYM_SETTINGS.business.currency),
      timezone: String(formData.get("timezone") ?? DEFAULT_GYM_SETTINGS.business.timezone),
      defaultMembershipDuration: Number(formData.get("defaultMembershipDuration") ?? DEFAULT_GYM_SETTINGS.business.defaultMembershipDuration),
      defaultPaymentMethod: String(formData.get("defaultPaymentMethod") ?? DEFAULT_GYM_SETTINGS.business.defaultPaymentMethod),
    },
    alertRules: {
      expiringSoonDays: Number(formData.get("expiringSoonDays") ?? DEFAULT_GYM_SETTINGS.alertRules.expiringSoonDays),
      inactiveMemberDays: Number(formData.get("inactiveMemberDays") ?? DEFAULT_GYM_SETTINGS.alertRules.inactiveMemberDays),
      overduePaymentGraceDays: Number(
        formData.get("overduePaymentGraceDays") ?? DEFAULT_GYM_SETTINGS.alertRules.overduePaymentGraceDays,
      ),
    },
    reminderTemplates: {
      expiringSoon: String(formData.get("expiringSoonTemplate") ?? DEFAULT_GYM_SETTINGS.reminderTemplates.expiringSoon),
      expiredMembership: String(
        formData.get("expiredMembershipTemplate") ?? DEFAULT_GYM_SETTINGS.reminderTemplates.expiredMembership,
      ),
      inactiveMember: String(formData.get("inactiveMemberTemplate") ?? DEFAULT_GYM_SETTINGS.reminderTemplates.inactiveMember),
      paymentReminder: String(formData.get("paymentReminderTemplate") ?? DEFAULT_GYM_SETTINGS.reminderTemplates.paymentReminder),
    },
  });

  await saveGymSettings(user.tenantId, settings);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  revalidatePath("/reminders");

  redirect("/settings?saved=1");
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white">{value || "-"}</p>
    </div>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
  });
  const settings = await getGymSettings(user.tenantId);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const saved = resolvedSearchParams?.saved === "1";

  const gymName = settings.gymInfo.gymName || user.tenant.name;
  const gymSlug = settings.gymInfo.gymSlug || user.tenant.slug;

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-gray-800 bg-purple-500/20 p-3">
            <Settings className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Settings</h1>
            <p className="mt-2 text-gray-300">Manage gym information and the business rules that power reports and reminders.</p>
          </div>
        </div>
        {saved && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Settings saved successfully.
          </div>
        )}
      </div>

      <form action={saveSettings} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2.5">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Gym Information</h2>
                  <p className="text-sm text-gray-400">Basic workspace identity and contact details.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Gym Name">
                  <input className={inputClass} name="gymName" defaultValue={gymName} placeholder="Your Gym Name" />
                </Field>
                <Field label="Gym Slug">
                  <input className={inputClass} name="gymSlug" defaultValue={gymSlug} placeholder="your-gym" />
                </Field>
                <Field label="Owner Email">
                  <input className={inputClass} defaultValue={user.email} readOnly />
                </Field>
                <Field label="Phone">
                  <input className={inputClass} name="phone" defaultValue={settings.gymInfo.phone} placeholder="03xx-xxxxxxx" />
                </Field>
                <Field label="Address">
                  <input className={inputClass} name="address" defaultValue={settings.gymInfo.address} placeholder="Street address" />
                </Field>
                <Field label="City">
                  <input className={inputClass} name="city" defaultValue={settings.gymInfo.city} placeholder="Karachi" />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2.5">
                  <Clock3 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Business Settings</h2>
                  <p className="text-sm text-gray-400">Defaults used across forms and workflows.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Currency">
                  <input className={inputClass} name="currency" defaultValue={settings.business.currency} />
                </Field>
                <Field label="Timezone">
                  <input className={inputClass} name="timezone" defaultValue={settings.business.timezone} />
                </Field>
                <Field label="Default Membership Duration">
                  <input
                    className={inputClass}
                    type="number"
                    name="defaultMembershipDuration"
                    defaultValue={settings.business.defaultMembershipDuration}
                  />
                </Field>
                <Field label="Default Payment Method">
                  <select className={inputClass} name="defaultPaymentMethod" defaultValue={settings.business.defaultPaymentMethod}>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2.5">
                  <Bell className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Alert Rules</h2>
                  <p className="text-sm text-gray-400">Used by dashboard alerts, reports, and reminders.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Expiring Soon Days">
                  <input
                    className={inputClass}
                    type="number"
                    name="expiringSoonDays"
                    defaultValue={settings.alertRules.expiringSoonDays}
                  />
                </Field>
                <Field label="Inactive Member Days">
                  <input
                    className={inputClass}
                    type="number"
                    name="inactiveMemberDays"
                    defaultValue={settings.alertRules.inactiveMemberDays}
                  />
                </Field>
                <Field label="Overdue Payment Grace Days">
                  <input
                    className={inputClass}
                    type="number"
                    name="overduePaymentGraceDays"
                    defaultValue={settings.alertRules.overduePaymentGraceDays}
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2.5">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Reminder Templates</h2>
                  <p className="text-sm text-gray-400">Manual message templates for the Reminders center.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <Field label="Expiring Soon Message">
                  <textarea
                    className={`${inputClass} min-h-[96px] h-auto py-3`}
                    name="expiringSoonTemplate"
                    defaultValue={settings.reminderTemplates.expiringSoon}
                  />
                </Field>
                <Field label="Expired Membership Message">
                  <textarea
                    className={`${inputClass} min-h-[96px] h-auto py-3`}
                    name="expiredMembershipTemplate"
                    defaultValue={settings.reminderTemplates.expiredMembership}
                  />
                </Field>
                <Field label="Inactive Member Message">
                  <textarea
                    className={`${inputClass} min-h-[96px] h-auto py-3`}
                    name="inactiveMemberTemplate"
                    defaultValue={settings.reminderTemplates.inactiveMember}
                  />
                </Field>
                <Field label="Payment Reminder Message">
                  <textarea
                    className={`${inputClass} min-h-[96px] h-auto py-3`}
                    name="paymentReminderTemplate"
                    defaultValue={settings.reminderTemplates.paymentReminder}
                  />
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2.5">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Workspace Summary</h2>
                  <p className="text-sm text-gray-400">Current profile and subscription overview.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <InfoCard label="Gym Name" value={gymName} />
                <InfoCard label="Gym Slug" value={gymSlug} />
                <InfoCard label="Owner Email" value={user.email} />
                <InfoCard label="Subscription Plan" value={subscription?.planName ?? "Starter"} />
                <InfoCard label="Subscription Status" value={subscription?.status ?? "Active"} />
                <InfoCard label="Billing" value="Monthly" />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Notes</h2>
                <p className="mt-1 text-sm text-gray-400">
                  These settings are stored safely per tenant and power your dashboard, reports, and reminders with current defaults when no custom values are set.
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 text-sm leading-6 text-gray-300">
                Gym name and slug can override the shared shell display. Alert rules drive expiring soon, inactive, and overdue member workflows. Reminder templates are used as copy-ready messages in the Automation Center.
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
