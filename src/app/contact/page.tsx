import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mail, MessageSquare, PhoneCall, Sparkles } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "GymOS Contact - Talk to Sales or Request a Demo",
  description: "Contact GymOS for sales, support, or demo requests. Explore the product with a simple and fast contact page.",
};

const contactCards = [
  { title: "Sales", text: "Talk about plans, pricing, and onboarding.", icon: PhoneCall },
  { title: "Support", text: "Need help? Reach out for product support.", icon: Mail },
  { title: "Demo Request", text: "Book a walkthrough of GymOS in action.", icon: MessageSquare },
];

export default function ContactPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Contact</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Contact GymOS
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Reach out for sales, support, or a demo request. This form is frontend-only for now.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <ContactForm />

            <div className="space-y-6">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{card.title}</h2>
                    <p className="mt-3 leading-7 text-slate-300">{card.text}</p>
                  </div>
                );
              })}

              <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-violet-500/10 to-emerald-400/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  Ready when you are
                </div>
                <p className="mt-3 leading-8 text-slate-300">
                  Explore GymOS pricing, sign up, or view the blog for more gym growth strategies.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    View Pricing
                  </Link>
                  <Link href="/blog" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    Read Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
