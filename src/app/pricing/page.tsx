import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "GymOS Pricing - Simple Plans for Every Gym",
  description: "Choose the GymOS plan that fits your gym. Starter, Pro, and Business plans with premium gym management features.",
};

const plans = [
  {
    name: "Starter",
    price: "PKR 3,000/month",
    accent: "from-cyan-400/20 to-cyan-500/5",
    features: ["Member management", "Plans", "Payments", "Attendance", "Basic dashboard"],
    cta: "Start Free Trial",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "PKR 7,000/month",
    accent: "from-violet-400/20 to-violet-500/5",
    features: ["Everything in Starter", "Reports", "Reminders", "Revenue recovery", "Member history"],
    cta: "Choose Pro",
    href: "/signup",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "PKR 15,000/month",
    accent: "from-emerald-400/20 to-emerald-500/5",
    features: ["Everything in Pro", "Multi-branch support", "Staff roles", "Advanced reports", "Automations"],
    cta: "Contact Sales",
    href: "/contact#contact",
    featured: false,
  },
];

export default function PricingPage() {
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
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,7,18,0.2),rgba(3,7,18,0.92))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Pricing</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Simple pricing for every gym
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Choose a plan that matches your gym today and upgrade as you grow.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl ${
                  plan.featured ? "ring-2 ring-violet-400/30" : ""
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${plan.accent}`} />
                {plan.badge && (
                  <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
                    {plan.badge}
                  </div>
                )}

                <h2 className="text-2xl font-black text-white">{plan.name}</h2>
                <p className="mt-2 text-3xl font-black text-white">{plan.price}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    plan.featured
                      ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div id="contact" className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white">Need help choosing a plan?</h3>
            <p className="mt-3 text-slate-300">
              Talk to us about setup, training, multi-branch operations, or custom onboarding.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact#contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
