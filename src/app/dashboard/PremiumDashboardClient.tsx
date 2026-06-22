"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Activity, Clock, Package, TrendingUp, UserCheck, Users, UserMinus, X } from "lucide-react";
import gsap from "gsap";
import { motion } from "framer-motion";
import DashboardClient from "./DashboardClient";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AnimatedCounter from "@/components/AnimatedCounter";

type KpiTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    fill?: string;
  }>;
  label?: string | number;
};

function KpiTooltip({ active, payload, label }: KpiTooltipProps) {
  if (!active || !payload?.length) return null;

  const dotColor = payload[0]?.fill ?? "#a855f7";
  const value = payload[0]?.value;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dotColor }} />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-[#F9FAFB]">{value}</p>
    </div>
  );
}

function StatCard({
  index,
  label,
  value,
  secondary,
  icon,
  iconBg,
  iconColor,
}: {
  index: number;
  label: string;
  value: string | number;
  secondary?: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  const numericValue = typeof value === "number" ? value : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 animate-rise"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="mt-2 text-white text-3xl font-black">
            {numericValue !== null ? <AnimatedCounter value={numericValue} /> : value}
          </p>
          {secondary ? <div className="mt-2 space-y-1 text-sm text-gray-400">{secondary}</div> : null}
        </div>
        <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${iconBg} border border-gray-800`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </motion.div>
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
  expiringSoonNext,
  overduePayments,
  overdueOldestDays,
  inactiveMembers,
  lowStockItems,
  collectDueCount,
  collectDueAmount,
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
  expiringSoonNext: { memberName: string; dateLabel: string } | null;
  overduePayments: number;
  overdueOldestDays: number;
  inactiveMembers: number;
  lowStockItems: number;
  collectDueCount: number;
  collectDueAmount: number;
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
  // Quick Actions: Deactivate Member modal state
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateSearch, setDeactivateSearch] = useState("");
  const [deactivateMembers, setDeactivateMembers] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // Fetch active members when modal opens (and on search changes)
  useEffect(() => {
    if (!deactivateModalOpen) return;

    (async () => {
      try {
        const res = await fetch(`/api/members?q=${encodeURIComponent(deactivateSearch)}`);
        const data = await res.json();
        if (!res.ok) return;

        const active = (Array.isArray(data?.members) ? data.members : [])
          .filter((m: any) => String(m?.status ?? "").toLowerCase() === "active")
          .map((m: any) => ({ id: Number(m.id), name: String(m.name) }));

        setDeactivateMembers(active);
      } catch {
        // no-op
      }
    })();
  }, [deactivateModalOpen, deactivateSearch]);

  useEffect(() => {
    if (!deactivateModalOpen) return;
    setSelectedMemberId(null);
  }, [deactivateModalOpen]);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".attention-card");

    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    );

    cards.forEach((card) => {
      const countEl = card.querySelector<HTMLElement>(".attention-count");
      if (!countEl) return;

      const target = Number(countEl.dataset.value ?? countEl.textContent ?? 0);
      if (!Number.isFinite(target) || target <= 0) {
        countEl.textContent = "0";
        return;
      }

      const counter = { value: 0 };
      countEl.textContent = "0";

      gsap.to(counter, {
        value: target,
        duration: 1,
        ease: "power2.out",
        snap: { value: 1 },
        onUpdate: () => {
          countEl.textContent = String(counter.value);
        },
      });
    });
  }, []);

  const isTrial = subscription?.status === "trial" || subscription?.planName === "Starter" || subscription?.status === "Trial";
  const kpiChartData = [
    { name: "Members", value: activeMembers, fill: "#a855f7" },
    { name: "Attendance", value: todayAttendance, fill: "#ef4444" },
    { name: "Expiring", value: expiringSoon, fill: "#10b981" },
    { name: "Overdue Members", value: overduePayments, fill: "#f97316" },
    { name: "Inactive", value: inactiveMembers, fill: "#06b6d4" },
    { name: "Stock", value: lowStockItems, fill: "#ec4899" },
    { name: "Collect Due", value: collectDueCount, fill: "#8b5cf6" },
  ];
  const revenueChartData = [
    { name: "Revenue", value: revenueThisMonth },
    { name: "Recoverable", value: recoverableRevenue },
  ];
  const alertChartData = attentionItems.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: ["#a855f7", "#06b6d4", "#f59e0b", "#ef4444"][index % 4],
  }));

  const collectDueDisplay = collectDueAmount > 0 ? `PKR ${Number(collectDueAmount).toLocaleString()}` : collectDueCount;

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
          label="Overdue Members"
          value={overduePayments}
          secondary={
            overduePayments === 0 ? (
              <p className="text-emerald-400">All caught up ✅</p>
            ) : (
              <div className="space-y-1">
                <p>Oldest: {overdueOldestDays} days</p>
                <a href="/members?filter=overdue" className="inline-flex text-gray-400 transition-colors hover:text-white">
                  Send reminders →
                </a>
              </div>
            )
          }
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-orange-500/20"
          iconColor="text-orange-400"
        />
        <StatCard
          index={4}
          label="Expiring Soon"
          value={expiringSoon}
          secondary={
            expiringSoonNext ? (
              <p>
                Next: {expiringSoonNext.memberName} on {expiringSoonNext.dateLabel}
              </p>
            ) : (
              <p>No renewals needed</p>
            )
          }
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          index={5}
          label="Inactive Members"
          value={inactiveMembers}
          secondary={
            <a href="/members?filter=inactive" className="inline-flex text-gray-400 transition-colors hover:text-white">
              View List →
            </a>
          }
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
        <StatCard
          index={8}
          label="Collect Due"
          value={collectDueDisplay}
          secondary={
            <div className="space-y-1">
              <p>Total: Rs {Number(collectDueAmount).toLocaleString()}</p>
              <a href="/payments" className="inline-flex text-gray-400 transition-colors hover:text-white">
                Collect →
              </a>
            </div>
          }
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-violet-500/20"
          iconColor="text-violet-400"
        />
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div style={{ marginTop: "32px", marginBottom: "8px" }}>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800" }}>Analytics Overview</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Track your gym performance</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">KPI Snapshot</h3>
              <p className="mt-1 text-sm text-gray-400">A quick visual of the current dashboard metrics.</p>
            </div>
          </div>
          <motion.div className="h-80 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={false} />
                <Tooltip
                  content={<KpiTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {kpiChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
            <p className="mt-1 text-sm text-gray-400">Current revenue versus recoverable revenue.</p>
          </div>
          <motion.div className="h-80 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1f2937",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#a855f7" fill="url(#revenueGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <DashboardClient attentionItems={attentionItems} />
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
                <p className="text-xs font-medium text-gray-500">Overdue Members</p>
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <QuickActionButton label="Review members" href="/members" icon={<Users className="h-5 w-5 text-blue-400" />} />
          <QuickActionButton label="Collect dues" href="/payments" icon={<TrendingUp className="h-5 w-5 text-purple-400" />} />
          <QuickActionButton label="View activity" href="/attendance" icon={<Activity className="h-5 w-5 text-pink-400" />} />
          <QuickActionButton label="Open inventory" href="/inventory" icon={<Package className="h-5 w-5 text-amber-400" />} />

          <button
            type="button"
            onClick={() => setDeactivateModalOpen(true)}
            className="flex items-center justify-between p-5 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-purple-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-900/60 border border-gray-800 p-2">
                <UserMinus className="h-5 w-5 text-red-400" />
              </div>
              <span className="text-gray-200 font-medium text-sm">Deactivate Member</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDeactivateModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-white font-bold text-lg">Deactivate Member</h3>
              <button
                type="button"
                onClick={() => setDeactivateModalOpen(false)}
                className="rounded-lg border border-gray-800 bg-gray-900/40 p-2 text-gray-300 hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-400">Select an active member to deactivate.</p>

            <div className="mt-5 space-y-3">
              <label className="text-xs font-medium text-gray-500">Search Active Members</label>
              <input
                value={deactivateSearch}
                onChange={(e) => setDeactivateSearch(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950/30 px-4 py-2 text-sm text-gray-200 outline-none focus:border-purple-500/50"
              />

              <select
                value={selectedMemberId ?? ""}
                onChange={(e) => setSelectedMemberId(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950/30 px-4 py-2 text-sm text-gray-200 outline-none focus:border-purple-500/50"
              >
                <option value="" disabled>
                  Select a member
                </option>
                {deactivateMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (ID: {m.id})
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={!selectedMemberId}
                onClick={async () => {
                  if (!selectedMemberId) return;
                  const res = await fetch("/api/members/deactivate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ selectedMemberId }),
                  });

                  if (res.ok) {
                    setDeactivateModalOpen(false);
                    window.location.reload();
                  }
                }}
                className="w-full rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

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
