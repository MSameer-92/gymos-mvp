"use client";

import React from "react";
import { ArrowRight, Activity, Clock, Package, TrendingUp, UserCheck, Users } from "lucide-react";

function StatCard({
  index,
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  index: number;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 animate-rise"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="mt-2 text-white text-3xl font-black">{value}</p>
        </div>
        <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${iconBg} border border-gray-800`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-5 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-purple-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gray-900/60 border border-gray-800 p-2">{icon}</div>
        <span className="text-gray-200 font-medium text-sm">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function AttentionCard({
  label,
  value,
  description,
  action,
  href,
}: {
  label: string;
  value: number;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-black text-white">{value}</p>
        </div>
        <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
          Needs attention
        </span>
      </div>
      <p className="text-sm leading-6 text-gray-400">{description}</p>
      <a
        href={href}
        className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
      >
        {action}
      </a>
    </div>
  );
}

export function PremiumDashboardClient({
  userTenantName,
  userName,
  subscription,
  totalMembers,
  activeMembers,
  expiringSoon,
  revenueThisMonth,
  todayAttendance,
  overduePayments,
  inactiveMembers,
  lowStockItems,
  coachHoursThisMonth,
  recoverableRevenue,
  attentionItems,
}: {
  userTenantName: string;
  userName: string;
  subscription: { status?: string; planName?: string } | null;
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  revenueThisMonth: number;
  todayAttendance: number;
  overduePayments: number;
  inactiveMembers: number;
  lowStockItems: number;
  coachHoursThisMonth: number;
  recoverableRevenue: number;
  attentionItems: Array<{
    label: string;
    value: number;
    description: string;
    action: string;
    href: string;
  }>;
}) {
  const isTrial = subscription?.status === "trial" || subscription?.planName === "Starter" || subscription?.status === "Trial";

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-white font-black text-4xl">Dashboard</h1>
        <p className="text-gray-400">Premium gym insights at a glance.</p>
        <p className="text-gray-400">Welcome back, {userName}!</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Active Members"
          value={activeMembers}
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
        />
        <StatCard
          index={1}
          label="Revenue This Month"
          value={`PKR ${Number(revenueThisMonth).toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          iconBg="bg-yellow-500/20"
          iconColor="text-yellow-400"
        />
        <StatCard
          index={2}
          label="Attendance Today"
          value={todayAttendance}
          icon={<Activity className="h-6 w-6" />}
          iconBg="bg-red-500/20"
          iconColor="text-red-400"
        />
        <StatCard
          index={3}
          label="Overdue Payments"
          value={overduePayments}
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-orange-500/20"
          iconColor="text-orange-400"
        />
        <StatCard
          index={4}
          label="Expiring Soon"
          value={expiringSoon}
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          index={5}
          label="Inactive Members"
          value={inactiveMembers}
          icon={<UserCheck className="h-6 w-6" />}
          iconBg="bg-cyan-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          index={6}
          label="Low Stock Items"
          value={lowStockItems}
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-pink-500/20"
          iconColor="text-pink-400"
        />
        <StatCard
          index={7}
          label="Coach Hours This Month"
          value={coachHoursThisMonth}
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white/90 font-bold text-lg">Needs Attention</h2>
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
              Rule-based alerts
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {attentionItems.map((item) => (
              <AttentionCard
                key={item.label}
                label={item.label}
                value={item.value}
                description={item.description}
                action={item.action}
                href={item.href}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-white/90 font-bold text-lg">Revenue Recovery Engine</h2>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-400">Potential Revenue to Recover</p>
              <p className="mt-2 text-4xl font-black text-white">
                PKR {Number(recoverableRevenue).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Rule-based estimate from expiring, overdue, and inactive memberships.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                <p className="text-xs font-medium text-gray-500">Expiring Soon</p>
                <p className="mt-2 text-2xl font-black text-white">{expiringSoon}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                <p className="text-xs font-medium text-gray-500">Overdue</p>
                <p className="mt-2 text-2xl font-black text-white">{overduePayments}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                <p className="text-xs font-medium text-gray-500">Inactive</p>
                <p className="mt-2 text-2xl font-black text-white">{inactiveMembers}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <QuickActionButton label="Send Reminder" href="/reminders" icon={<Users className="h-5 w-5 text-blue-400" />} />
              <QuickActionButton label="Record Payment" href="/payments" icon={<TrendingUp className="h-5 w-5 text-purple-400" />} />
              <QuickActionButton label="View activity" href="/attendance" icon={<Activity className="h-5 w-5 text-pink-400" />} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-white/90 font-bold text-lg">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionButton label="Review members" href="/members" icon={<Users className="h-5 w-5 text-blue-400" />} />
          <QuickActionButton label="Collect dues" href="/payments" icon={<TrendingUp className="h-5 w-5 text-purple-400" />} />
          <QuickActionButton label="View activity" href="/attendance" icon={<Activity className="h-5 w-5 text-pink-400" />} />
          <QuickActionButton label="Open inventory" href="/inventory" icon={<Package className="h-5 w-5 text-amber-400" />} />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-white font-bold text-lg">Workspace Status</h3>
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            {isTrial ? "Trial" : subscription?.status ?? "Active"}
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
          <div className="bg-purple-500 h-2 rounded-full w-1/3 transition-all duration-1000" />
        </div>

        <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
          Upgrade to Pro
        </button>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-950/30 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Gym Name</p>
            <p className="text-lg font-semibold text-gray-200">{userTenantName}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/30 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Subscription Plan</p>
            <p className="text-lg font-semibold text-gray-200">{subscription?.planName ?? "Starter"}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/30 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
            <p className="text-lg font-semibold text-green-400 capitalize">{subscription?.status ?? "Active"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
