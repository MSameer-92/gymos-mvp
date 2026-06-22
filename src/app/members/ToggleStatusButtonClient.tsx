"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ToggleStatusButtonClient({
  memberId,
  status,
}: {
  memberId: number;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/members/${memberId}/toggle-status`, {
        method: "POST",
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={loading}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 disabled:opacity-60"
    >
      {loading ? "Updating..." : status === "active" ? "Set Inactive" : "Set Active"}
    </button>
  );
}
