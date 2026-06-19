"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Copy, MessageSquare, Send, X } from "lucide-react";

const QUICK_TEMPLATES = {
  "DEPEND ON YOU": "DEPEND ON YOU",
  "Payment Reminder":
    "Hi {name}, your gym fee of PKR {amount} is due. Please clear it soon. - Shahnawaz Fitness Gym",
  "Plan Expiring":
    "Hi {name}, your {plan} expires on {date}. Renew now to avoid gap. - Shahnawaz Fitness Gym",
  Welcome: "Welcome to Shahnawaz Fitness Gym {name}! Your journey starts now 💪",
} as const;

type QuickTemplateName = keyof typeof QUICK_TEMPLATES;

type SendMessageDialogProps = {
  memberName: string;
  memberPhone: string;
  amount: number;
  planName: string;
  expiryDate: string;
};

type TemplateOption = "Payment Reminder" | "Plan Expiring" | "Welcome" | "Custom";

function formatAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "0";
  return amount.toLocaleString("en-US");
}

function renderTemplate(template: string, data: { name: string; amount: string; plan: string; date: string }) {
  return template
    .replaceAll("{name}", data.name)
    .replaceAll("{amount}", data.amount)
    .replaceAll("{plan}", data.plan)
    .replaceAll("{date}", data.date);
}

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-0 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {children}
      </div>
    </div>,
    document.body,
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 px-4 pr-12 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950 text-white">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={8}
      className="min-h-[200px] w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
    />
  );
}

export function SendMessageDialog({
  memberName,
  memberPhone,
  amount,
  planName,
  expiryDate,
}: SendMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<TemplateOption>("Custom");
  const [message, setMessage] = useState<string>(QUICK_TEMPLATES["DEPEND ON YOU"]);
  const [customMessage, setCustomMessage] = useState<string>(QUICK_TEMPLATES["DEPEND ON YOU"]);
  const [toastText, setToastText] = useState<string | null>(null);

  const messageData = useMemo(
    () => ({
      name: memberName,
      amount: formatAmount(amount),
      plan: planName,
      date: expiryDate,
    }),
    [amount, expiryDate, memberName, planName],
  );

  useEffect(() => {
    if (!open) return;
    setTemplate("Custom");
    setMessage(QUICK_TEMPLATES["DEPEND ON YOU"]);
    setCustomMessage(QUICK_TEMPLATES["DEPEND ON YOU"]);
  }, [open]);

  useEffect(() => {
    if (!toastText) return;
    const timer = window.setTimeout(() => setToastText(null), 1600);
    return () => window.clearTimeout(timer);
  }, [toastText]);

  const showToast = (text: string) => {
    setToastText(text);
  };

  const handleTemplateChange = (nextTemplate: string) => {
    const typedTemplate = nextTemplate as TemplateOption;
    setTemplate(typedTemplate);

    if (typedTemplate === "Custom") {
      const nextMessage = customMessage || QUICK_TEMPLATES["DEPEND ON YOU"];
      setMessage(nextMessage);
      return;
    }

    const nextMessage = renderTemplate(QUICK_TEMPLATES[typedTemplate], messageData);
    setMessage(nextMessage);

    if (typedTemplate === "Welcome") {
      return;
    }
  };

  const handleMessageChange = (nextMessage: string) => {
    setMessage(nextMessage);
    if (template === "Custom") {
      setCustomMessage(nextMessage);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    showToast("Copied!");
    setOpen(false);
  };

  const handleWhatsApp = () => {
    const phone = memberPhone.replace(/[^\d]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#22D3EE] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-transform hover:scale-[1.01]"
      >
        <MessageSquare className="h-4 w-4" />
        Send Message
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-white">Send Message to {memberName}</h2>
            <p className="mt-1 text-sm text-slate-300">Phone: {memberPhone}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close message dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Quick Template</label>
            <Select
              value={template}
              onChange={handleTemplateChange}
              options={[
                { label: "Payment Reminder", value: "Payment Reminder" },
                { label: "Plan Expiring", value: "Plan Expiring" },
                { label: "Welcome", value: "Welcome" },
                { label: "Custom", value: "Custom" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Message</label>
            <Textarea value={message} onChange={handleMessageChange} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
            >
              <Send className="h-4 w-4" />
              Send WhatsApp
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
              Copy Text
            </button>
          </div>
        </div>
      </Dialog>

      {toastText &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[60] rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm font-medium text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
            {toastText}
          </div>,
          document.body,
        )}
    </>
  );
}
