import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-gym" },
    update: {},
    create: {
      name: "Demo Fitness Gym",
      slug: "demo-gym",
      status: "active",
      subscriptions: {
        create: {
          planName: "starter",
          status: "trial",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
      users: {
        create: {
          name: "Demo Owner",
          email: "owner@gymos.test",
          passwordHash,
          role: "owner",
        },
      },
    },
  });

  const monthlyPlan = await prisma.membershipPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Monthly Plan",
      durationDays: 30,
      price: 5000,
      status: "active",
    },
  });

  await prisma.member.createMany({
    data: [
      { tenantId: tenant.id, name: "Ahmed Khan", phone: "03001234567", email: "ahmed@example.com", gender: "male", status: "active" },
      { tenantId: tenant.id, name: "Sara Ali", phone: "03007654321", email: "sara@example.com", gender: "female", status: "active" },
    ],
    skipDuplicates: true,
  });

  const firstMember = await prisma.member.findFirst({ where: { tenantId: tenant.id } });
  if (firstMember) {
    await prisma.memberMembership.create({
      data: {
        tenantId: tenant.id,
        memberId: firstMember.id,
        planId: monthlyPlan.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
      },
    });
    await prisma.payment.create({
      data: {
        tenantId: tenant.id,
        memberId: firstMember.id,
        amount: 5000,
        paymentMethod: "cash",
        paymentStatus: "paid",
      },
    });
  }

  console.log("Seed completed.");
  console.log("Login: owner@gymos.test / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
