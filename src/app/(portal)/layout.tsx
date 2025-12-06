import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { AUTH_CALLBACKS } from "@/config/routes";
import AppShell from "@/components/layout/AppShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect(AUTH_CALLBACKS.UNAUTHENTICATED);
  }

  const userRole = session.user.role;

  if (!userRole) {
    redirect(AUTH_CALLBACKS.NEEDS_ONBOARDING);
  }

  return <AppShell userRole={userRole}>{children}</AppShell>;
}
