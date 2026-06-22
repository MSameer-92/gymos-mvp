"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Field, inputClass } from "./Field";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}
      <Field label="Email address">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className={inputClass}
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            spellCheck={false}
            required
          />
        </div>
      </Field>
      <Field label="Password">
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className={inputClass}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <input
              type="checkbox"
              name="rememberMe"
              className="peer h-4 w-4 appearance-none rounded border border-white/15 bg-slate-950/70 transition checked:border-cyan-400 checked:bg-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
            <span className="pointer-events-none absolute inset-0 hidden items-center justify-center text-[10px] font-black text-slate-950 peer-checked:flex">
              ✓
            </span>
          </span>
          <span>Remember me</span>
        </label>
        <Link href="/contact#contact" className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
          Forgot password?
        </Link>
      </div>

      <button
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_18px_50px_rgba(34,211,238,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer" />
        <span className="relative">{loading ? "Logging in..." : "Sign in"}</span>
      </button>
      <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
        Secure login • Multi-gym ready • Fast setup
      </p>
      <p className="text-center text-sm text-slate-400">
        New to GymOS?{" "}
        <Link href="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Create account
        </Link>
      </p>
    </form>
  );
}
