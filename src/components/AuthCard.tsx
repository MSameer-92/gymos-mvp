const highlights = [
  "Real-time member tracking",
  "Automated billing and reminders",
  "Built for premium gym operations",
];

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__glow auth-shell__glow--one" />
      <div className="auth-shell__glow auth-shell__glow--two" />
      <div className="auth-shell__grid" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="relative hidden overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 text-white shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:flex lg:min-h-[760px] lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%)]" />
            <div className="auth-shell__orb auth-shell__orb--one" />
            <div className="auth-shell__orb auth-shell__orb--two" />

            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                GymOS Pro
              </div>

              <div className="max-w-xl space-y-5">
                <h2 className="text-5xl font-semibold tracking-tight text-white xl:text-6xl">
                  Manage your gym like a modern software company.
                </h2>
                <p className="max-w-lg text-lg leading-8 text-slate-300">
                  Command members, plans, payments, and attendance from a polished control room
                  designed to make your business feel premium.
                </p>
              </div>

              <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Uptime</p>
                  <p className="mt-3 text-3xl font-semibold text-white">99.9%</p>
                  <p className="mt-1 text-sm text-slate-400">Always ready for front-desk action.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Members</p>
                  <p className="mt-3 text-3xl font-semibold text-white">24/7</p>
                  <p className="mt-1 text-sm text-slate-400">Track visits without extra friction.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-white">Live</p>
                  <p className="mt-1 text-sm text-slate-400">See payments and progress instantly.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">What you get</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-200 backdrop-blur animate-rise"
                    style={{ animationDelay: `${index * 140}ms` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative mx-auto flex w-full max-w-lg items-center">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-40 blur-2xl animate-glow" />
            <div className="auth-card relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-8">
              <div className="auth-card__accent" />
              <div className="relative space-y-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                      <span className="h-2 w-2 rounded-full bg-cyan-300" />
                      Secure access
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {title}
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                      {subtitle}
                    </p>
                  </div>

                  <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-right text-xs text-slate-300 sm:block">
                    <p className="font-semibold text-white">GymOS</p>
                    <p className="mt-1">Premium operations</p>
                  </div>
                </div>

                {children}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
