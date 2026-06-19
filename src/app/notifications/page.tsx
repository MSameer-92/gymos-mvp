import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#030712",
        padding: "32px",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "28px",
          fontWeight: "800",
          marginBottom: "8px",
        }}
      >
        🔔 All Notifications
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Your gym activity alerts</p>
      <div
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #1f2937",
            color: "white",
            fontWeight: "600",
          }}
        >
          Recent Activity
        </div>
        <div style={{ padding: "20px", color: "#9ca3af" }}>
          Check dashboard for latest updates on members, payments, and attendance.
        </div>
      </div>
    </div>
  );
}
