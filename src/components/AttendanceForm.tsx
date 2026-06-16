"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";
import { Activity } from "lucide-react";

export function AttendanceForm({
  members,
  defaultMemberId,
}: {
  members: { id: number; name: string; phone: string }[];
  defaultMemberId?: number | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: Number(form.get("memberId")) }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not mark attendance");
        return;
      }

      formElement.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-none">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/20 p-2.5">
          <Activity className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Mark Member Check-in</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Field label="Select Member">
              <select
                className={inputClass}
                name="memberId"
                required
                defaultValue={defaultMemberId != null ? String(defaultMemberId) : ""}
              >
                <option value="">Choose a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.phone}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex items-end">
            <button
              disabled={loading}
              className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Checking in..." : "Mark Check-in"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
