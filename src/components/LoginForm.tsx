"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "./Field";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
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
          autoComplete="current-password"
          required
        />
      </Field>
      <button
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer" />
        <span className="relative">{loading ? "Logging in..." : "Sign in"}</span>
      </button>
      <p className="text-center text-sm text-slate-400">
        New to GymOS?{" "}
        <Link href="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Create account
        </Link>
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">Demo Credentials</p>
        <p className="text-xs text-slate-400">
          Email: <code className="text-cyan-300">owner@gymos.test</code>
        </p>
        <p className="text-xs text-slate-400">
          Password: <code className="text-cyan-300">admin123</code>
        </p>
      </div>
    </form>
  );
}
