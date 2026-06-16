import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Settings, Shield, Zap } from "lucide-react";

export default async function SettingsPage() {
  const user = await requireUser();
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-gray-300">Manage your gym workspace and preferences.</p>
      </div>

      {/* Gym Information */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-none">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2.5">
            <Settings className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Gym Information</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Gym Name</p>
            <p className="text-lg font-semibold text-white">{user.tenant.name}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Gym Slug</p>
            <p className="text-lg font-semibold text-white">{user.tenant.slug}</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-none">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2.5">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Account Information</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Owner Email</p>
            <p className="text-lg font-semibold text-white">{user.email}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Role</p>
            <p className="text-lg font-semibold text-white">Owner</p>
          </div>
        </div>
      </div>

      {/* Subscription Information */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-none">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2.5">
            <Zap className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Subscription</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Plan</p>
            <p className="text-lg font-semibold text-white">{subscription?.planName ?? "Starter"}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Status</p>
            <p className="text-lg font-semibold text-purple-400 capitalize">
              {subscription?.status ?? "Active"}
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-xs font-medium text-gray-400 mb-1">Billing</p>
            <p className="text-lg font-semibold text-white">Monthly</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <p className="text-sm font-semibold text-purple-400 mb-2">Coming Soon</p>
        <p className="text-sm text-gray-300">
          Advanced settings, integrations, and automation features will be available soon. 
          GymOS plans to integrate with n8n for automated reminders for membership expiry,
          overdue payments, and member birthdays.
        </p>
      </div>
    </div>
  );

}
