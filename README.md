# GymOS MVP

This is a simple first MVP web app for GymOS.

It includes:

- Signup
- Login
- Gym workspace / tenant system
- PostgreSQL database through Prisma
- Dashboard
- Members
- Membership plans
- Payments
- Attendance
- Basic settings

It does **not** include Stripe, WhatsApp, SMS, n8n, AI, inventory, franchise, or advanced reports yet.

---

## 1. Requirements

Install these first:

- Node.js 20 or newer
- PostgreSQL Server
- VS Code

---

## 2. Create PostgreSQL database

Open PostgreSQL Workbench or phpMyAdmin and run:

```sql
CREATE DATABASE gymos;
```

---

## 3. Setup project

Open this folder in VS Code.

Run:

```bash
npm install
```

---

## 4. Create `.env`

Copy `.env.example` and create a new file named `.env`.

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/gymos?schema=public"
JWT_SECRET="change-this-secret-key"
```

Change `root1234` to your PostgreSQL password.

If your PostgreSQL has no password, use:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/gymos?schema=public"
JWT_SECRET="change-this-secret-key"
```

---

## 5. Create database tables

Run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 6. Optional: add demo data

Run:

```bash
npm run seed
```

Demo login:

```text
Email: owner@gymos.test
Password: admin123
```

---

## 7. Run web app

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Important SaaS rule

Every main table has `tenantId`.

This means every gym has separate data.

Example:

- Tenant 1 = Ali Fitness Gym
- Tenant 2 = PowerHouse Gym

When Tenant 1 logs in, they only see Tenant 1 data.

---

## Next features after MVP

After this works, add:

1. CSV/Excel import
2. Invoice module
3. Expiry tracking screen
4. n8n automation
5. SMS/WhatsApp reminders
6. Reports
7. Staff roles
