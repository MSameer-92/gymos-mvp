import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "GymOS - Run your gym like a SaaS company",
  description:
    "GymOS helps gym owners manage members, payments, attendance, and growth from one premium workspace.",
};

const featureCards = [
  {
    icon: Users,
    title: "Member operations",
    text: "Keep profiles, memberships, and renewals in one clean workspace.",
  },
  {
    icon: CreditCard,
    title: "Payments and dues",
    text: "See collections, pending dues, and monthly revenue at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Attendance control",
    text: "Track check-ins instantly and spot inactive members before churn grows.",
  },
];

const metrics = [
  { label: "Active members", value: "2,482", delta: "+14% this month", tone: "cyan" },
  { label: "Monthly revenue", value: "PKR 2.1M", delta: "120 payments cleared", tone: "violet" },
  { label: "Attendance rate", value: "94.8%", delta: "12 gyms monitored", tone: "emerald" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.08),rgba(2,6,23,0.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_90%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between gap-4 pb-4">
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

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/features" className="text-sm text-slate-300 transition-colors hover:text-white">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-slate-300 transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm text-slate-300 transition-colors hover:text-white">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-slate-300 transition-colors hover:text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition-transform hover:scale-[1.02]"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-8 lg:grid-cols-[1.45fr_0.95fr] lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Premium SaaS for modern gym operators
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Run your gym like
              <br />
              a SaaS company
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Manage members, payments, and attendance from one premium workspace built for modern gyms.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(168,85,247,0.18)] transition-transform hover:scale-[1.02]"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                View Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Member and plan management",
                "Payments with clear revenue visibility",
                "Attendance, reminders, and recovery",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-xl animate-rise"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div id="demo" className="relative lg:pl-2">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-emerald-400/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_28%)]" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
                        Live operations
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">GymOS control room</h2>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      Real-time
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {metrics.map((metric, index) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl animate-float"
                        style={{ animationDelay: `${index * 180}ms` }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
                            <p
                              className={`mt-2 text-3xl font-black ${
                                metric.tone === "cyan"
                                  ? "text-cyan-300"
                                  : metric.tone === "violet"
                                    ? "text-violet-300"
                                    : "text-emerald-300"
                              }`}
                            >
                              {metric.value}
                            </p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70">
                            <LayoutDashboard className="h-5 w-5 text-white/80" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
                          {metric.delta}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">This week</p>
                        <p className="text-xs text-slate-400">Members, payments, and attendance together</p>
                      </div>
                      <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        +12.4%
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {[34, 48, 56, 72, 58, 80, 94].map((height, index) => (
                        <div
                          key={height}
                          className="flex h-28 items-end rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.74))] p-2"
                        >
                          <div
                            className="w-full rounded-full"
                            style={{
                              height: `${height}%`,
                              background:
                                index % 3 === 0
                                  ? "linear-gradient(180deg, rgba(34,211,238,0.95), rgba(34,211,238,0.22))"
                                  : index % 3 === 1
                                    ? "linear-gradient(180deg, rgba(168,85,247,0.95), rgba(168,85,247,0.22))"
                                    : "linear-gradient(180deg, rgba(16,185,129,0.95), rgba(16,185,129,0.22))",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 lg:pb-14">
          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_18px_60px_rgba(2,6,23,0.24)] backdrop-blur-xl animate-rise"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
