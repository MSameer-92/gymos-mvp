import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "GymOS Blog - Gym Growth Tips and Management Guides",
  description: "Tips, guides, and growth strategies for modern gym owners.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,7,18,0.2),rgba(3,7,18,0.94))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 flex flex-col gap-4">
            <Link href="/" className="inline-flex w-fit text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
              ← Back to home
            </Link>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Blog</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                GymOS Blog
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Tips, guides, and growth strategies for modern gym owners.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-transform hover:-translate-y-1"
              >
                <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                    <Tag className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{post.title}</h2>
                <p className="mt-4 leading-7 text-slate-300">{post.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-cyan-300" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-violet-300" />
                    {post.readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
