"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Settings,
  Package,
  Bell,
  Menu,
  X,
  Search,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { LogoutButton } from "./LogoutButton";
import { useEffect, useRef, useState } from "react";

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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const readIds = JSON.parse(localStorage.getItem("readNotifIds") || "[]");

    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        const notifs = (data.notifications || []).map((n: any) => ({
          ...n,
          read: readIds.includes(n.id) ? true : n.read,
        }));
        setNotifications(notifs);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifClick = (notif: any) => {
    const readIds = JSON.parse(localStorage.getItem("readNotifIds") || "[]");
    if (!readIds.includes(notif.id)) {
      localStorage.setItem("readNotifIds", JSON.stringify([...readIds, notif.id]));
    }
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    setNotifOpen(false);
    router.push(notif.link);
  };

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem("readNotifIds", JSON.stringify(allIds));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotifOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#030712",
        position: "relative",
      }}
    >
      <AnimatedBackground />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid #1f2937",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed 0%, #4f1fe8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(124,58,237,0.5)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/889/889463.png"
              alt="GymOS Logo"
              width="26"
              height="26"
              style={{
                filter: "brightness(0) invert(1)",
                objectFit: "contain",
              }}
            />
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: "800",
                fontSize: "17px",
                letterSpacing: "-0.3px",
                background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GymOS
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: "11px",
              }}
            >
              Gym Management
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            aria-label="Close sidebar"
            style={{ marginLeft: "auto" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <motion.nav
          variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
          initial="initial"
          animate="animate"
          style={{ flex: 1, padding: "24px 16px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                  }}
                  style={{ position: "relative" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        borderRadius: "0 9999px 9999px 0",
                        backgroundColor: "#a855f7",
                      }}
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
                    style={{
                      color: isActive ? "#d8b4fe" : "#d1d5db",
                      backgroundColor: isActive ? "rgba(168,85,247,0.15)" : "transparent",
                      marginLeft: isActive ? "4px" : "0",
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>

        <div style={{ padding: "16px", borderTop: "1px solid #1f2937" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{gymName}</div>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: "64px",
            backgroundColor: "rgba(3,7,18,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1f2937",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
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

            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  position: "relative",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid #1f2937",
                  borderRadius: "10px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: "18px",
                }}
                aria-label="Toggle notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "700",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #030712",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    right: 0,
                    width: "300px",
                    backgroundColor: "#111827",
                    border: "1px solid #1f2937",
                    borderRadius: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #1f2937",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>
                      Notifications
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(124,58,237,0.2)",
                          color: "#a78bfa",
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {unreadCount} new
                      </span>
                      <span
                        onClick={markAllRead}
                        style={{
                          color: "#6b7280",
                          fontSize: "11px",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Mark all read
                      </span>
                    </div>
                  </div>

                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(124,58,237,0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #1f2937",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>
                        {notif.type === "warning" ? "⚠️" : notif.type === "success" ? "✅" : "ℹ️"}
                      </span>
                      <div>
                        <p
                          style={{
                            color: notif.read ? "#9ca3af" : "white",
                            fontSize: "13px",
                            margin: 0,
                            fontWeight: notif.read ? "400" : "500",
                          }}
                        >
                          {notif.text}
                        </p>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "11px",
                            margin: "4px 0 0 0",
                          }}
                        >
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#7c3aed",
                            marginLeft: "auto",
                            marginTop: "4px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <div
                    onClick={() => {
                      setNotifOpen(false);
                      router.push("/members");
                    }}
                    style={{
                      padding: "14px",
                      textAlign: "center",
                      cursor: "pointer",
                      color: "#7c3aed",
                    }}
                  >
                    View all activity →
                  </div>
                </div>
              )}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div style={{ padding: "24px", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
