import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, Bell, CreditCard, LayoutDashboard, Repeat2, ShieldCheck, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "GymOS Features - Modern Gym Management Software",
  description:
    "Explore GymOS features for member management, payments, attendance, reminders, reports, revenue recovery, and SaaS-ready operations.",
};

const features = [
  { title: "Member Management", icon: Users, text: "Organize profiles, membership history, and member details." },
  { title: "Membership Plans", icon: Repeat2, text: "Create and renew plans with clear expiry controls." },
  { title: "Payment Tracking", icon: CreditCard, text: "Track revenue, dues, and payment status across members." },
  { title: "Attendance", icon: ShieldCheck, text: "Capture check-ins and monitor active usage patterns." },
  { title: "Reports", icon: BarChart3, text: "See analytics for revenue, expiry, overdue, and activity." },
  { title: "Reminders", icon: Bell, text: "Keep renewals and collections moving with follow-ups." },
  { title: "Revenue Recovery", icon: Sparkles, text: "Surface overdue memberships and recover missed revenue." },
  { title: "Member Profile", icon: LayoutDashboard, text: "Open a detailed view of each member’s history and status." },
  { title: "Multi-gym SaaS Ready", icon: LayoutDashboard, text: "Built with tenant-scoped architecture for scalable growth." },
];

export default function FeaturesPage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GymOS",
    url: "https://gymos.app",
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,7,18,0.2),rgba(3,7,18,0.94))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Features</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              GymOS Features
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Everything you need to manage members, payments, attendance, reminders, and growth from a single modern platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform hover:-translate-y-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{feature.title}</h2>
                  <p className="mt-3 leading-7 text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-violet-500/10 to-emerald-400/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-white">Ready to get started?</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Try GymOS for free and see how much easier your gym workflow becomes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02]">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
