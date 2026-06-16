"use client";

import AnimatedBackground from '@/components/AnimatedBackground';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Settings,
  Package,
  Menu,
  X,
  Bell,
  Search,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { LogoutButton } from "./LogoutButton";
import { useEffect, useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/plans", label: "Plans", icon: Package },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/attendance", label: "Attendance", icon: Calendar },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  gymName,
  userName,
}: {
  children: React.ReactNode;
  gymName: string;
  userName: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: "#030712" }}>
      <AnimatedBackground />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        style={{ position: "relative", zIndex: 50 }}
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform border-r border-gray-800 bg-gray-950/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-gray-800 p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800">
                <span className="text-lg text-white">🏋️</span>
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-black tracking-tight text-white">GymOS</h1>
                <p className="text-xs text-gray-500">Gym Management</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <motion.nav
            variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
            initial="initial"
            animate="animate"
            className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
          >
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  className="relative"
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 top-0 w-1 rounded-r-full bg-purple-500"
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-l-4 border-purple-500 bg-purple-500/15 text-purple-300"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          <div style={{ padding: "16px", borderTop: "1px solid #1f2937" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              {gymName}
            </div>
          </div>
        </div>
      </aside>

      <main style={{ position: "relative", zIndex: 10 }} className="flex min-h-screen flex-col">
        <header style={{ position: "relative", zIndex: 60 }} className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-800/50 bg-gray-950/70 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden min-w-0 sm:block">
              <h2 className="truncate bg-gradient-to-r from-white to-gray-400 bg-clip-text font-bold text-transparent">
                {gymName}
              </h2>
              <p className="text-sm text-gray-400">Welcome back, {userName}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              animate={{ width: searchFocused ? 320 : 200 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2 lg:flex"
            >
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full border-none bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-500"
              />
            </motion.div>
            <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <LogoutButton />
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
