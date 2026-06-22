"use client";

type RevenueRow = {
  memberName: string;
  amount: string;
  paymentMethod: string;
  status: string;
  date: string;
};

type ExpiringRow = {
  memberName: string;
  phone: string;
  planName: string;
  endDate: string;
  remainingDays: string;
};

type ExpiredRow = {
  memberName: string;
  phone: string;
  lastPlan: string;
  expiredDate: string;
};

type AttendanceRow = {
  memberName: string;
  phone: string;
  checkInTime: string;
};

type QueueRow = {
  memberName: string;
  phone: string;
  reason: string;
  suggestedAction: string;
};

function csvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function buildSection(title: string, headers: string[], rows: string[][]) {
  const lines = [title, headers.join(",")];
  rows.forEach((row) => {
    lines.push(row.map(csvEscape).join(","));
  });
  lines.push("");
  return lines.join("\n");
}

export function ReportsClient({
  revenueRows,
  expiringRows,
  expiredRows,
  attendanceRows,
  queueRows,
}: {
  revenueRows: RevenueRow[];
  expiringRows: ExpiringRow[];
  expiredRows: ExpiredRow[];
  attendanceRows: AttendanceRow[];
  queueRows: QueueRow[];
}) {
  const handleExportCsv = () => {
    const csv = [
      buildSection(
        "Revenue Report",
        ["Member", "Amount", "Payment Method", "Status", "Date"],
        revenueRows.map((row) => [row.memberName, row.amount, row.paymentMethod, row.status, row.date]),
      ),
      buildSection(
        "Membership Expiry Report",
        ["Member", "Phone", "Plan", "End Date", "Remaining Days"],
        expiringRows.map((row) => [row.memberName, row.phone, row.planName, row.endDate, row.remainingDays]),
      ),
      buildSection(
        "Expired / Overdue Report",
        ["Member", "Phone", "Last Plan", "Expired Date"],
        expiredRows.map((row) => [row.memberName, row.phone, row.lastPlan, row.expiredDate]),
      ),
      buildSection(
        "Attendance Report",
        ["Member", "Phone", "Check-In Time"],
        attendanceRows.map((row) => [row.memberName, row.phone, row.checkInTime]),
      ),
      buildSection(
        "Daily Follow-up Queue",
        ["Member", "Phone", "Reason", "Suggested Action"],
        queueRows.map((row) => [row.memberName, row.phone, row.reason, row.suggestedAction]),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gymos-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleExportCsv}
        className="rounded-lg border border-purple-500/40 bg-purple-500/15 px-4 py-2 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-500/25"
      >
        Export CSV
      </button>
      <button
        type="button"
        className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-800"
      >
        Export PDF Coming Soon
      </button>
    </div>
  );
}
