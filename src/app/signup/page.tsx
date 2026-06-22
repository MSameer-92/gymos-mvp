import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "GymOS Signup - Create your workspace",
  description: "Create your GymOS workspace and start your 14-day free trial.",
};

const stats = [
  {
    label: "Used by",
    value: "200+ gyms",
    text: "Trusted by modern gym operators",
  },
  {
    label: "Processed monthly",
    value: "PKR 2.1M",
    text: "Payments and dues cleared through GymOS",
  },
  {
    label: "Platform uptime",
    value: "99.9%",
    text: "Reliable for daily front-desk operations",
  },
];

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.08),rgba(2,6,23,0.92))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between pb-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur-xl">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-2xl font-black text-transparent">
                G
              </span>
            </div>
            <div>
              <div className="text-[34px] font-black leading-none tracking-tight">GymOS</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.42em] text-cyan-100/80">
                Premium gym operations
              </div>
            </div>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,820px)]">
          <div className="w-full max-w-[560px]">
            <SignupForm />
          </div>

          <div className="relative min-h-[680px] w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="absolute inset-0 p-8">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                    Overview
                  </div>

                  <div className="mt-5 space-y-3">
                    {stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className="w-full max-w-[360px] rounded-2xl border border-white/10 bg-slate-950/75 p-4 shadow-lg shadow-black/30 backdrop-blur-xl"
                        style={{ marginLeft: `${index * 28}px` }}
                      >
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                        <div className="mt-2 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="mt-1 text-sm text-slate-400">{stat.text}</p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <BarChart3 className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Why teams choose GymOS</p>
                      <p className="text-xs text-slate-400">Operational clarity from day one</p>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      Trusted platform
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Members and renewals together",
                      "Payments with clean reporting",
                      "Attendance and growth visibility",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
