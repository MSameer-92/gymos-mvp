import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, LayoutDashboard, Sparkles, Users, Wallet } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "GymOS Login - Secure Gym Management Access",
  description: "Log in to GymOS to manage members, memberships, payments, attendance, reminders, and reports.",
};

const statCards = [
  { label: "Total Members", value: "2,482", delta: "+12% this month", icon: Users },
  { label: "Monthly Revenue", value: "PKR 48,290", delta: "+18% this month", icon: Wallet },
  { label: "Attendance Rate", value: "92.7%", delta: "+8% this month", icon: LayoutDashboard },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-x-hidden overflow-y-auto bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.08),rgba(2,6,23,0.92))]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-6 lg:px-10 lg:py-6">
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
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <section
          className="grid flex-1 items-center gap-10"
          style={{ maxWidth: 1500, width: "100%", gridTemplateColumns: "560px 820px", gap: 40 }}
        >
          <div className="w-[560px]">
            <div className="flex h-[680px] flex-col rounded-[2rem] border border-cyan-400/15 bg-slate-950/60 p-8 shadow-[0_30px_100px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Secure Access
              </div>

              <div className="mt-5 space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Login to GymOS</h1>
                <p className="text-base leading-7 text-slate-300">Open your gym dashboard.</p>
              </div>

              <div className="mt-4">
                <LoginForm />
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Secure Gym Access</p>
                    <p className="text-xs leading-5 text-slate-400">
                      Fast sign-in for members, payments, and operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[680px] w-[820px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <Image
              src="/images/gym-trainer-hero.png"
              alt="Gym trainer using GymOS"
              fill
              priority
              className="object-cover object-right-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.86)_0%,rgba(2,6,23,0.34)_40%,rgba(2,6,23,0.08)_72%,rgba(2,6,23,0.06)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_28%)]" />

            <div className="absolute inset-0 p-8 z-20 flex flex-col">
              {/* Top-left: stat cards + chart */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                  Overview
                </div>

                <div className="flex flex-col gap-3">
                  {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.label}
                        className="w-full max-w-[260px] rounded-2xl border border-white/10 bg-slate-950/75 p-3.5 shadow-lg shadow-black/30 backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">{card.label}</p>
                            <p className="text-lg font-bold text-white">{card.value}</p>
                            <p className="text-xs font-medium text-emerald-300">{card.delta}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full max-w-[360px] rounded-3xl border border-white/10 bg-slate-950/80 p-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Member Check-ins</p>
                      <p className="text-xs text-slate-400">This week</p>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      +12.4%
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.8))] p-3">
                    <svg viewBox="0 0 360 140" className="h-[150px] w-full">
                      <defs>
                        <linearGradient id="checkinsLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="55%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="checkinsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(34,211,238,0.32)" />
                          <stop offset="100%" stopColor="rgba(168,85,247,0.02)" />
                        </linearGradient>
                        <filter id="checkinsGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 0.75 0"
                          />
                        </filter>
                      </defs>

                      {[28, 56, 84, 112].map((y) => (
                        <line
                          key={y}
                          x1="18"
                          x2="342"
                          y1={y}
                          y2={y}
                          stroke="rgba(148,163,184,0.14)"
                          strokeDasharray="4 6"
                        />
                      ))}

                      <path
                        d="M 18 104 C 42 96, 52 94, 72 88 S 108 70, 126 72 S 162 90, 180 82 S 216 58, 234 64 S 270 94, 288 76 S 324 36, 342 44"
                        fill="none"
                        stroke="url(#checkinsLine)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#checkinsGlow)"
                      />

                      <path
                        d="M 18 104 C 42 96, 52 94, 72 88 S 108 70, 126 72 S 162 90, 180 82 S 216 58, 234 64 S 270 94, 288 76 S 324 36, 342 44 L 342 128 L 18 128 Z"
                        fill="url(#checkinsFill)"
                      />

                      {[
                        [18, 104],
                        [72, 88],
                        [126, 72],
                        [180, 82],
                        [234, 64],
                        [288, 76],
                        [342, 44],
                      ].map(([x, y], index) => (
                        <g key={index}>
                          <circle cx={x} cy={y} r="5.5" fill="#08111f" stroke="url(#checkinsLine)" strokeWidth="2.5" />
                          <circle cx={x} cy={y} r="2.2" fill="#dffbff" />
                        </g>
                      ))}
                    </svg>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-left: headline */}
              <div className="mt-auto space-y-2 max-w-[560px]">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Premium gym operations</p>
                <h2 className="text-4xl font-black tracking-tight text-white leading-none">
                  Run your gym.
                  <br />
                  Grow your business.
                </h2>
                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                  GymOS helps modern gyms streamline operations, delight members, and grow revenue.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
