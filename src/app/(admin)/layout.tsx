import { redirect } from 'next/navigation'
import { auth } from '@/features/auth/auth'
import AppShell from '@/components/layout/AppShell'
import { ROUTES, ADMIN_ROLES } from '@/config/routes'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect(ROUTES.home)
  }

  const userRole = session.user.role
  if (!userRole || !ADMIN_ROLES.includes(userRole as (typeof ADMIN_ROLES)[number])) {
    redirect(ROUTES.dashboard)
  }

  return <AppShell userRole={userRole}>{children}</AppShell>
}
