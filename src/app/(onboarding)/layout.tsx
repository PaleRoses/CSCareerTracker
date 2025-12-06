import { redirect } from 'next/navigation'
import { auth } from '@/features/auth/auth'
import { AUTH_CALLBACKS } from '@/config/routes'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect(AUTH_CALLBACKS.UNAUTHENTICATED)
  }

  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  )
}
