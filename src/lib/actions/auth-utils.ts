import { auth } from '@/features/auth/auth'
import { createUserClient } from '@/lib/supabase/server'
import { hasPrivilegedAccess, type PrivilegedRole } from '@/features/auth/constants'
import { authError, type ActionState } from './error-utils'

/**
 * Basic auth context returned by requireAuth
 */
export type AuthContext = {
  userId: string
  supabase: ReturnType<typeof createUserClient>
}

/**
 * Extended action context with role information
 */
export type ActionContext = AuthContext & {
  userRole: string
}

/**
 * Action context for privileged users (recruiter, admin, techno_warlord)
 */
export type PrivilegedActionContext = AuthContext & {
  userRole: PrivilegedRole
}

/**
 * Legacy auth check - returns null if not authenticated
 * @deprecated Use requireActionAuth() for better error handling
 */
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

/**
 * Require authenticated user for server action
 * Returns discriminated union for clean error handling
 *
 * @example
 * const result = await requireActionAuth()
 * if ('error' in result) return result.error
 * const { userId, supabase, userRole } = result.context
 */
export async function requireActionAuth(): Promise<
  { context: ActionContext } | { error: ActionState }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: authError('You must be logged in') }
  }

  return {
    context: {
      userId: session.user.id,
      userRole: session.user.role || 'applicant',
      supabase: createUserClient(session.user.id),
    }
  }
}

/**
 * Require privileged access (recruiter, admin, techno_warlord)
 *
 * @example
 * const result = await requirePrivilegedAuth()
 * if ('error' in result) return result.error
 * const { userId, supabase, userRole } = result.context
 */
export async function requirePrivilegedAuth(): Promise<
  { context: PrivilegedActionContext } | { error: ActionState }
> {
  const result = await requireActionAuth()

  if ('error' in result) return result

  if (!hasPrivilegedAccess(result.context.userRole)) {
    return { error: authError('You do not have permission for this action') }
  }

  return { context: result.context as PrivilegedActionContext }
}

/**
 * Require admin access (admin, techno_warlord only)
 *
 * @example
 * const result = await requireAdminAuth()
 * if ('error' in result) return result.error
 * const { userId, supabase } = result.context
 */
export async function requireAdminAuth(): Promise<
  { context: ActionContext } | { error: ActionState }
> {
  const result = await requireActionAuth()

  if ('error' in result) return result

  const { userRole } = result.context
  if (userRole !== 'admin' && userRole !== 'techno_warlord') {
    return { error: authError('Only administrators can perform this action') }
  }

  return result
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
