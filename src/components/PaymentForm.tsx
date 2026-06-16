"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";
import { CreditCard } from "lucide-react";

export function PaymentForm({
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
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: Number(form.get("memberId")),
          amount: Number(form.get("amount")),
          paymentMethod: form.get("paymentMethod"),
          paymentStatus: form.get("paymentStatus"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not add payment");
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
          <CreditCard className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Record Payment</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Member">
            <select
              className={inputClass}
              name="memberId"
              required
              defaultValue={defaultMemberId != null ? String(defaultMemberId) : ""}
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.phone}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Amount (PKR)">
            <input
              className={inputClass}
              name="amount"
              type="number"
              step="0.01"
              required
              placeholder="5000"
            />
          </Field>
          <Field label="Payment Method">
            <select className={inputClass} name="paymentMethod" defaultValue="cash">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} name="paymentStatus" defaultValue="paid">
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </Field>
        </div>
        <button
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
        >
          {loading ? "Recording payment..." : "Record Payment"}
        </button>
      </form>
    </div>
  );
}
