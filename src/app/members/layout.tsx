import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AppShell gymName={user.tenant.name} userName={user.name}>{children}</AppShell>;
}
