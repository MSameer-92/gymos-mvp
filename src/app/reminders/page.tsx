import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function RemindersPage() {
  await requireUser();

  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-none">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-gray-800 bg-purple-500/20 p-4">
            <Bell className="h-8 w-8 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Reminders</h1>
            <p className="mt-1 text-gray-400">Coming soon</p>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-gray-300">
          Automated member reminders are not connected yet. This page will eventually handle renewal
          nudges, overdue payment follow-ups, and other member notifications.
        </p>
      </div>
    </div>
  );
}
