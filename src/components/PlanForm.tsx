"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";
import { Package } from "lucide-react";

export function PlanForm() {
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
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          durationDays: Number(form.get("durationDays")),
          price: Number(form.get("price")),
          status: form.get("status"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not add plan");
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
          <Package className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Create Membership Plan</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Plan Name">
            <input
              className={inputClass}
              name="name"
              required
              placeholder="Monthly Pro Plan"
            />
          </Field>
          <Field label="Duration (Days)">
            <input
              className={inputClass}
              name="durationDays"
              type="number"
              required
              placeholder="30"
            />
          </Field>
          <Field label="Price (PKR)">
            <input
              className={inputClass}
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="5000"
            />
          </Field>
          <Field label="Status">
            <select className={inputClass} name="status" defaultValue="active">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
        <button
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
        >
          {loading ? "Creating plan..." : "Create Plan"}
        </button>
      </form>
    </div>
  );
}
