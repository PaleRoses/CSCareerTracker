/**
 * Query Authentication Utilities
 *
 * Standardized auth checking for data queries.
 * Reduces boilerplate across 20+ query files.
 */
import { auth } from '@/features/auth/auth'
import { createUserClient, createCacheClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

/**
 * Context for authenticated queries
 */
export type QueryContext = {
  userId: string
  supabase: ReturnType<typeof createUserClient>
}

/**
 * Context for public/cached queries
 */
export type CacheQueryContext = {
  supabase: ReturnType<typeof createCacheClient>
}

/**
 * Get authenticated query context
 *
 * Returns null if not authenticated, allowing graceful degradation.
 * Use this for user-specific queries where auth is required.
 *
 * @example
 * const ctx = await getQueryContext('getApplications')
 * if (!ctx) return []
 * const { userId, supabase } = ctx
 */
export async function getQueryContext(
  queryName: string
): Promise<QueryContext | null> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn(`${queryName}: No authenticated user`)
    return null
  }

  return {
    userId: session.user.id,
    supabase: createUserClient(session.user.id),
  }
}

/**
 * Get cache client context for public/cached queries
 *
 * Use this for queries that don't need user context
 * (e.g., job listings, company directories).
 *
 * @example
 * const { supabase } = getCacheContext()
 */
export function getCacheContext(): CacheQueryContext {
  return {
    supabase: createCacheClient(),
  }
}

/**
 * Get query context with required auth
 *
 * Throws if not authenticated (for use in contexts where
 * missing auth should be an error, not graceful degradation).
 *
 * @example
 * const { userId, supabase } = await requireQueryContext('getPrivateData')
 */
export async function requireQueryContext(
  queryName: string
): Promise<QueryContext> {
  const ctx = await getQueryContext(queryName)

  if (!ctx) {
    throw new Error(`${queryName}: Authentication required`)
  }

  return ctx
}
