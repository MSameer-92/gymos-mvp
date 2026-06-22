"use client";

import { useState } from "react";
import { CalendarCheck2, Loader2, Phone, ShieldCheck, Sparkles } from "lucide-react";

type CheckInResponse =
  | {
      message: string;
      attendance: { id: number; checkInAt: string };
      member: { id: number; name: string };
    }
  | {
      error: string;
    };

export default function CheckInPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"idle" | "success" | "error" | "info">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageTone("idle");

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = (await response.json().catch(() => ({}))) as CheckInResponse;

      if (!response.ok) {
        if ("error" in data && data.error === "You are already checked in today.") {
          setMessage(data.error);
          setMessageTone("info");
          return;
        }

        setMessage("error" in data ? data.error : "Could not check in.");
        setMessageTone("error");
        return;
      }

      if ("message" in data) {
        setMessage(data.message);
        setMessageTone("success");
      }

      setPhone("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#020617_45%,_#030712_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-200">
              <Sparkles className="h-4 w-4" />
              GymOS Access
            </div>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/20 to-pink-500/10">
                <CalendarCheck2 className="h-8 w-8 text-purple-300" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Member Check-in</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Enter your phone number to mark attendance instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-100">Phone Number</span>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="03xx-xxxxxxx"
                    className="flex h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/30"
                    required
                  />
                </div>
              </label>

              {message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    messageTone === "success"
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                      : messageTone === "info"
                        ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
                        : "border-rose-400/20 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? "Checking in..." : "Check In"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
