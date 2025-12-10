import { redirect } from 'next/navigation'
import { auth } from '@/features/auth/auth'
import { AppShell } from '@/features/shared'
import { ROUTES, RECRUITER_ROLES } from '@/config/routes'

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect(ROUTES.home)
  }

  const userRole = session.user.role
  if (!userRole || !RECRUITER_ROLES.includes(userRole as typeof RECRUITER_ROLES[number])) {
    redirect(ROUTES.dashboard)
  }

  return <AppShell userRole={userRole}>{children}</AppShell>
}
