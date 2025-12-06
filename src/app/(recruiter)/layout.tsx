import { redirect } from 'next/navigation'
import { auth } from '@/features/auth/auth'
import AppShell from '@/components/layout/AppShell'
import { ROUTES, RECRUITER_ROLES } from '@/config/routes'

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Must be logged in
  if (!session?.user) {
    redirect(ROUTES.home)
  }

  // Must have recruiter role
  const userRole = session.user.role
  if (!userRole || !RECRUITER_ROLES.includes(userRole as typeof RECRUITER_ROLES[number])) {
    redirect(ROUTES.dashboard)
  }

  return <AppShell userRole={userRole}>{children}</AppShell>
}
