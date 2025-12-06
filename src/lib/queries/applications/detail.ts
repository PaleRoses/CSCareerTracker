'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type Application } from '@/features/applications/schemas/application.schema'
import { APPLICATION_SELECT_QUERY, transformDbToApplication } from '../core/transform'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'
import { logger } from '@/lib/logger'

export async function getApplication(id: string): Promise<Application | null> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getApplication: No authenticated user')
    return null
  }

  return getCachedApplication(id, session.user.id)
}

/** Variant with per-application cache tag for fine-grained invalidation */
export async function getApplicationWithTag(id: string): Promise<Application | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  // Create a per-application cached query
  const getCachedById = unstable_cache(
    async (applicationId: string, userId: string) => {
      const supabase = createCacheClient()

      const { data, error } = await supabase
        .from('applications')
        .select(APPLICATION_SELECT_QUERY)
        .eq('application_id', applicationId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - not found or not authorized
          return null
        }
        logger.error('Error fetching application', { error, applicationId })
        return null
      }

      return transformDbToApplication(data)
    },
    [`application-${id}`],
    {
      tags: [QUERY_CACHE_TAGS.APPLICATION_BY_ID(id), QUERY_CACHE_TAGS.APPLICATIONS],
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    }
  )

  return getCachedById(id, session.user.id)
}

const getCachedApplication = unstable_cache(
  async (id: string, userId: string): Promise<Application | null> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(APPLICATION_SELECT_QUERY)
      .eq('application_id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - not found or not authorized
        return null
      }
      logger.error('Error fetching application', { error, id })
      return null
    }

    return transformDbToApplication(data)
  },
  ['application-detail'],
  {
    tags: [QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)

/** Lightweight existence check without fetching full data */
export async function applicationExists(id: string): Promise<boolean> {
  const session = await auth()

  if (!session?.user?.id) {
    return false
  }

  const supabase = createCacheClient()

  const { count, error } = await supabase
    .from('applications')
    .select('application_id', { count: 'exact', head: true })
    .eq('application_id', id)
    .eq('user_id', session.user.id)

  if (error) {
    logger.error('Error checking application existence', { error, id })
    return false
  }

  return (count ?? 0) > 0
}
