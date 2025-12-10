import { auth } from '@/features/auth/auth'
import { createUserClient, createCacheClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export type QueryContext = {
  userId: string
  supabase: ReturnType<typeof createUserClient>
}

export type CacheQueryContext = {
  supabase: ReturnType<typeof createCacheClient>
}

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

export function getCacheContext(): CacheQueryContext {
  return {
    supabase: createCacheClient(),
  }
}

export async function requireQueryContext(
  queryName: string
): Promise<QueryContext> {
  const ctx = await getQueryContext(queryName)

  if (!ctx) {
    throw new Error(`${queryName}: Authentication required`)
  }

  return ctx
}
