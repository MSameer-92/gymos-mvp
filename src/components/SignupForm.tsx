"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerName: form.get("ownerName"),
        email: form.get("email"),
        password: form.get("password"),
        gymName: form.get("gymName"),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Signup failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}
      <Field label="Your full name">
        <input
          className={inputClass}
          name="ownerName"
          placeholder="John Doe"
          autoComplete="name"
          required
        />
      </Field>
      <Field label="Email address">
        <input
          className={inputClass}
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          spellCheck={false}
          required
        />
      </Field>
      <Field label="Password">
        <input
          className={inputClass}
          name="password"
          type="password"
          placeholder="Enter password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </Field>
      <Field label="Gym name">
        <input
          className={inputClass}
          name="gymName"
          placeholder="Your Gym Name"
          autoComplete="organization"
          required
        />
      </Field>
      <button
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer" />
        <span className="relative">{loading ? "Creating account..." : "Create account"}</span>
      </button>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Sign in
        </Link>
      </p>
    </form>
  );
}
