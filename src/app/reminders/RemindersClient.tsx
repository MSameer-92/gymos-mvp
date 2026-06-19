"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Copy } from "lucide-react";

type ReminderCategory = "expiring" | "expired" | "inactive" | "payment";

type ReminderRow = {
  id: string;
  memberId: number;
  memberName: string;
  phone: string;
  email: string | null;
  category: ReminderCategory;
  reason: string;
  suggestedMessage: string;
};

function Badge({
  children,
  tone = "purple",
}: {
  children: React.ReactNode;
  tone?: "purple" | "emerald" | "amber" | "red" | "slate" | "cyan";
}) {
  const tones = {
    purple: "bg-purple-500/15 text-purple-200",
    emerald: "bg-emerald-500/15 text-emerald-200",
    amber: "bg-amber-500/15 text-amber-200",
    red: "bg-red-500/15 text-red-200",
    slate: "bg-slate-500/15 text-slate-200",
    cyan: "bg-cyan-500/15 text-cyan-200",
  } as const;

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-none">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

const tabs: Array<{ id: "all" | ReminderCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "expiring", label: "Expiring Soon" },
  { id: "expired", label: "Expired" },
  { id: "inactive", label: "Inactive" },
  { id: "payment", label: "Payment" },
];

export function RemindersClient({
  reminders,
  stats,
  birthdaySupport,
}: {
  reminders: ReminderRow[];
  stats: {
    total: number;
    expiring: number;
    expired: number;
    inactive: number;
    payment: number;
  };
  birthdaySupport: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"all" | ReminderCategory>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleReminders = useMemo(() => {
    if (activeTab === "all") return reminders;
    return reminders.filter((reminder) => reminder.category === activeTab);
  }, [activeTab, reminders]);

  const handleCopy = async (id: string, message: string) => {
    await navigator.clipboard.writeText(message);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total reminders" value={stats.total} />
        <StatsCard label="Expiring soon" value={stats.expiring} />
        <StatsCard label="Expired" value={stats.expired} />
        <StatsCard label="Inactive" value={stats.inactive} />
        <StatsCard label="Payment pending" value={stats.payment} />
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Reminder Queue</h2>
            <p className="mt-1 text-sm text-gray-400">Prepare messages manually before sending them to members.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "border border-gray-700 bg-gray-950 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-300">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Suggested Message</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {visibleReminders.map((reminder) => (
                <tr key={reminder.id} className="hover:bg-gray-800/60">
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{reminder.memberName}</p>
                      <Badge
                        tone={
                          reminder.category === "expiring"
                            ? "amber"
                            : reminder.category === "expired"
                              ? "red"
                              : reminder.category === "inactive"
                                ? "cyan"
                                : "purple"
                        }
                      >
                        {reminder.category}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{reminder.phone}</td>
                  <td className="px-4 py-4 text-gray-300">{reminder.email ?? "-"}</td>
                  <td className="px-4 py-4 text-gray-300">{reminder.reason}</td>
                  <td className="px-4 py-4 text-gray-300">
                    <p className="max-w-[28rem] whitespace-normal leading-6">{reminder.suggestedMessage}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(reminder.id, reminder.suggestedMessage)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-semibold text-purple-300 transition-colors hover:bg-gray-800"
                      >
                        <Copy className="h-4 w-4" />
                        {copiedId === reminder.id ? "Copied" : "Copy Message"}
                      </button>
                      <Link
                        href={`/members/${reminder.memberId}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-semibold text-gray-200 transition-colors hover:bg-gray-800"
                      >
                        Open Member Profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleReminders.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-300" colSpan={6}>
                    No reminders match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Birthday Reminders</h2>
              <p className="mt-1 text-sm text-gray-400">Birthday fields are not available in the current schema.</p>
            </div>
            <Badge tone="slate">Coming Soon</Badge>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-5 text-sm text-gray-300">
            If a birthday field is added later, this section can automatically generate birthday messages.
          </div>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-none">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Automation Center</h2>
              <p className="mt-1 text-sm text-gray-400">Manual prep only for now. No real SMS or email integration.</p>
            </div>
            <Badge tone="purple">
              <Bell className="mr-1 h-3.5 w-3.5" />
              Ready
            </Badge>
          </div>
          <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-950/40 p-5 text-sm text-gray-300">
            <p>Use the queue above to copy a message, open the member profile, and send it manually.</p>
            <p>Suggested categories: renewals, overdue dues, inactive check-ins, and payment follow-ups.</p>
            {!birthdaySupport && <p>Birthday reminders are not available yet because the schema does not include a birthday field.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
