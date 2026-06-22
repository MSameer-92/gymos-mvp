"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "./Field";

type PlanOption = {
  id: string;
  name: string;
  durationDays: number;
  price: number;
};

type AssignPlanProps = {
  memberId: number;
  plans: Array<{
    id: number | string;
    name: string;
    durationDays: number;
    price: number;
  }>;
};

const glassInputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatCurrency(value: number) {
  return `PKR ${Number(value).toLocaleString("en-US")}`;
}

function normalizePlans(plans: AssignPlanProps["plans"]) {
  const deduped = new Map<string, PlanOption>();

  for (const plan of plans) {
    const normalized: PlanOption = {
      id: String(plan.id),
      name: plan.name,
      durationDays: Number(plan.durationDays),
      price: Number(plan.price),
    };
    const key = `${normalized.name.trim().toLowerCase()}-${normalized.durationDays}-${normalized.price}`;
    if (!deduped.has(key)) {
      deduped.set(key, normalized);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => a.durationDays - b.durationDays);
}

export function AssignPlan({ memberId, plans: initialPlans }: AssignPlanProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanOption[]>(() => normalizePlans(initialPlans));
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState(() => toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setPlans(normalizePlans(initialPlans));
    setLoadingPlans(false);
  }, [initialPlans]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? null,
    [plans, planId],
  );

  useEffect(() => {
    if (!selectedPlan || !startDate) {
      setEndDate("");
      return;
    }

    const start = parseDateInputValue(startDate);
    setEndDate(toDateInputValue(addDays(start, selectedPlan.durationDays)));
  }, [selectedPlan, startDate]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), 2500);
    return () => window.clearTimeout(timer);
  }, [success]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPlan) {
      setError("Please choose a plan.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please choose a start date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/member-memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          planId: selectedPlan.id,
          startDate,
          endDate,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Could not assign plan");
      }

      setSuccess("Plan assigned successfully.");
      router.refresh();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Could not assign plan";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="assign-plan"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">Assign / Renew Plan</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set the membership dates so expired plans can flow into overdue reports.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <Field label="Membership Plan">
          <div className="relative z-50">
            <select
              className="relative z-50 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-inner shadow-black/20 backdrop-blur-xl outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
              name="planId"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              disabled={loadingPlans}
              required
            >
              <option value="" className="bg-[#111827] text-white">
                {loadingPlans ? "Loading plans..." : "Choose a plan"}
              </option>
              {plans.length === 0 ? (
                <option value="" disabled className="bg-[#111827] text-white">
                  No plans found. Add in Settings.
                </option>
              ) : (
                plans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-[#111827] text-white">
                    {`${plan.name} - ${plan.durationDays} days - ${formatCurrency(plan.price)}`}
                  </option>
                ))
              )}
            </select>
          </div>
        </Field>

        <Field label="Start Date">
          <div className="relative z-20">
            <input
              className={glassInputClass}
              name="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        </Field>

        <Field label="End Date">
          <div className="relative z-10">
            <input
              className={glassInputClass}
              name="endDate"
              type="date"
              value={endDate}
              readOnly
              disabled
            />
          </div>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Assigning..." : "Assign / Renew Plan"}
        </button>
      </div>
    </form>
  );
}
