"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    form.reset();
    setSent(true);
  }

  return (
    <form
      className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl"
      onSubmit={onSubmit}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Send a message</h2>
        <p className="mt-2 text-slate-300">Tell us what you need and we’ll get back to you.</p>
      </div>

      <div className="grid gap-4">
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20" placeholder="Full Name" />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20" placeholder="Email" type="email" />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20" placeholder="Gym Name" />
        <textarea className="min-h-40 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20" placeholder="Message" />
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
      >
        Submit
        <ArrowRight className="h-4 w-4" />
      </button>

      <p
        data-success
        className={`${sent ? "" : "hidden"} mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300`}
      >
        Thanks. Your message is ready to send.
      </p>
    </form>
  );
}
