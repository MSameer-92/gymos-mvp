# TODO

- [x] Add new API route `POST /api/members/deactivate` to set a member's status to `Inactive` (tenant-scoped, Prisma mutation).

- [ ] Inject exactly one new Quick Actions card into `PremiumDashboardClient` grid: `Deactivate Member` (user-minus left icon, chevron right), without changing other card logic.
- [ ] Implement modal overlay with searchable drop-down for members with status `Active`, displaying `Name (ID)` options.
- [ ] Wire confirm button to call `/api/members/deactivate`, close modal, and `window.location.reload()`.
- [ ] Run dev build/test steps to verify UI and DB update.

