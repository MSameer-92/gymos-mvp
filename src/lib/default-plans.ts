import { prisma } from "@/lib/prisma";

type DefaultPlan = {
  name: string;
  durationDays: number;
  price: number;
};

export const DEFAULT_PLAN_SEEDS: DefaultPlan[] = [
  { name: "Weekly Pass", durationDays: 7, price: 2500 },
  { name: "Monthly Standard", durationDays: 30, price: 5000 },
  { name: "3 Month Standard", durationDays: 90, price: 12000 },
  { name: "6 Month Standard", durationDays: 180, price: 22000 },
  { name: "1 Year Standard", durationDays: 365, price: 40000 },
];

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export async function ensureDefaultPlans(tenantId: number) {
  const activePlans = await prisma.plan.findMany({
    where: { tenantId, status: "active" },
    select: {
      id: true,
      name: true,
      durationDays: true,
      price: true,
      status: true,
    },
  });

  const existingKeys = new Set(
    activePlans.map((plan) => `${normalizeName(plan.name)}-${plan.durationDays}-${Number(plan.price)}`),
  );

  const missingPlans = DEFAULT_PLAN_SEEDS.filter(
    (plan) => !existingKeys.has(`${normalizeName(plan.name)}-${plan.durationDays}-${plan.price}`),
  );

  if (missingPlans.length > 0) {
    await prisma.plan.createMany({
      data: missingPlans.map((plan) => ({
        tenantId,
        name: plan.name,
        durationDays: plan.durationDays,
        price: plan.price,
        status: "active",
      })),
    });
  }

  return prisma.plan.findMany({
    where: { tenantId, status: "active" },
    orderBy: { durationDays: "asc" },
    select: {
      id: true,
      name: true,
      durationDays: true,
      price: true,
      status: true,
    },
  });
}
