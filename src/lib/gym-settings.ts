import { cookies } from "next/headers";

export type GymSettings = {
  gymInfo: {
    gymName: string;
    gymSlug: string;
    phone: string;
    address: string;
    city: string;
  };
  business: {
    currency: string;
    timezone: string;
    defaultMembershipDuration: number;
    defaultPaymentMethod: string;
  };
  alertRules: {
    expiringSoonDays: number;
    inactiveMemberDays: number;
    overduePaymentGraceDays: number;
  };
  reminderTemplates: {
    expiringSoon: string;
    expiredMembership: string;
    inactiveMember: string;
    paymentReminder: string;
  };
};

export const DEFAULT_GYM_SETTINGS: GymSettings = {
  gymInfo: {
    gymName: "",
    gymSlug: "",
    phone: "",
    address: "",
    city: "",
  },
  business: {
    currency: "PKR",
    timezone: "Asia/Karachi",
    defaultMembershipDuration: 30,
    defaultPaymentMethod: "cash",
  },
  alertRules: {
    expiringSoonDays: 7,
    inactiveMemberDays: 14,
    overduePaymentGraceDays: 0,
  },
  reminderTemplates: {
    expiringSoon:
      "Hi [Member Name], your gym membership will expire soon. Please renew to continue your training.",
    expiredMembership:
      "Hi [Member Name], your gym membership has expired. Please renew your plan to continue using the gym.",
    inactiveMember:
      "Hi [Member Name], we noticed you have not checked in recently. We would love to see you back at the gym.",
    paymentReminder:
      "Hi [Member Name], your payment is pending. Please clear your dues to keep your membership active.",
  },
};

function settingsCookieName(tenantId: number) {
  return `gymos_settings_${tenantId}`;
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function toString(value: unknown, fallback: string) {
  const stringValue = typeof value === "string" ? value.trim() : "";
  return stringValue || fallback;
}

function sanitizeSettings(raw: Partial<GymSettings>): GymSettings {
  return {
    gymInfo: {
      gymName: toString(raw.gymInfo?.gymName, DEFAULT_GYM_SETTINGS.gymInfo.gymName),
      gymSlug: toString(raw.gymInfo?.gymSlug, DEFAULT_GYM_SETTINGS.gymInfo.gymSlug),
      phone: toString(raw.gymInfo?.phone, DEFAULT_GYM_SETTINGS.gymInfo.phone),
      address: toString(raw.gymInfo?.address, DEFAULT_GYM_SETTINGS.gymInfo.address),
      city: toString(raw.gymInfo?.city, DEFAULT_GYM_SETTINGS.gymInfo.city),
    },
    business: {
      currency: toString(raw.business?.currency, DEFAULT_GYM_SETTINGS.business.currency),
      timezone: toString(raw.business?.timezone, DEFAULT_GYM_SETTINGS.business.timezone),
      defaultMembershipDuration: toNumber(
        raw.business?.defaultMembershipDuration,
        DEFAULT_GYM_SETTINGS.business.defaultMembershipDuration,
      ),
      defaultPaymentMethod: toString(
        raw.business?.defaultPaymentMethod,
        DEFAULT_GYM_SETTINGS.business.defaultPaymentMethod,
      ),
    },
    alertRules: {
      expiringSoonDays: toNumber(
        raw.alertRules?.expiringSoonDays,
        DEFAULT_GYM_SETTINGS.alertRules.expiringSoonDays,
      ),
      inactiveMemberDays: toNumber(
        raw.alertRules?.inactiveMemberDays,
        DEFAULT_GYM_SETTINGS.alertRules.inactiveMemberDays,
      ),
      overduePaymentGraceDays: toNumber(
        raw.alertRules?.overduePaymentGraceDays,
        DEFAULT_GYM_SETTINGS.alertRules.overduePaymentGraceDays,
      ),
    },
    reminderTemplates: {
      expiringSoon: toString(
        raw.reminderTemplates?.expiringSoon,
        DEFAULT_GYM_SETTINGS.reminderTemplates.expiringSoon,
      ),
      expiredMembership: toString(
        raw.reminderTemplates?.expiredMembership,
        DEFAULT_GYM_SETTINGS.reminderTemplates.expiredMembership,
      ),
      inactiveMember: toString(
        raw.reminderTemplates?.inactiveMember,
        DEFAULT_GYM_SETTINGS.reminderTemplates.inactiveMember,
      ),
      paymentReminder: toString(
        raw.reminderTemplates?.paymentReminder,
        DEFAULT_GYM_SETTINGS.reminderTemplates.paymentReminder,
      ),
    },
  };
}

export async function getGymSettings(tenantId: number): Promise<GymSettings> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(settingsCookieName(tenantId))?.value;
  if (!raw) return DEFAULT_GYM_SETTINGS;

  try {
    return sanitizeSettings(JSON.parse(raw) as Partial<GymSettings>);
  } catch {
    return DEFAULT_GYM_SETTINGS;
  }
}

export async function saveGymSettings(tenantId: number, settings: GymSettings) {
  const cookieStore = await cookies();
  cookieStore.set(settingsCookieName(tenantId), JSON.stringify(settings), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function sanitizeGymSettings(settings: Partial<GymSettings>): GymSettings {
  return sanitizeSettings(settings);
}
