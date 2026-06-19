import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { getGymSettings } from "@/lib/gym-settings";

export default async function PlansLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const settings = await getGymSettings(user.tenantId);
  return <AppShell gymName={settings.gymInfo.gymName || user.tenant.name} userName={user.name}>{children}</AppShell>;
}
