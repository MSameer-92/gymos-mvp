"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";
import { User } from "lucide-react";

export function MemberForm() {
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
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          gender: form.get("gender"),
          status: form.get("status"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not add member");
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
          <User className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Add New Member</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              className={inputClass}
              name="name"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field label="Phone Number">
            <input
              className={inputClass}
              name="phone"
              placeholder="+92 300 1234567"
              required
            />
          </Field>
          <Field label="Email Address">
            <input
              className={inputClass}
              name="email"
              type="email"
              placeholder="john@example.com"
            />
          </Field>
          <Field label="Gender">
            <select className={inputClass} name="gender" defaultValue="">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <Field label="Status">
          <select className={inputClass} name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </Field>
        <button
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
        >
          {loading ? "Adding member..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}
