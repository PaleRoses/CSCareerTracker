import { auth } from '@/features/auth/auth'
import { createUserClient } from '@/lib/supabase/server'

export type AuthContext = {
  userId: string
  supabase: ReturnType<typeof createUserClient>
}

export async function requireAuth(): Promise<AuthContext | null> {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }
  return {
    userId: session.user.id,
    supabase: createUserClient(session.user.id),
  }
}

export async function getUserEmail(userId: string): Promise<string> {
  const session = await auth()
  return session?.user?.email || `${userId}@oauth.placeholder`
}

export async function getUserNameParts(): Promise<{
  firstName: string
  lastName: string
}> {
  const session = await auth()
  const name = session?.user?.name || ''
  const parts = name.split(' ')
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' ') || 'OAuth',
  }
}
