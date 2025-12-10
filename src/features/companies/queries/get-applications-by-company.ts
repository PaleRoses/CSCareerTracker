'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { APPLICATION_SELECT_QUERY, transformDbToApplication } from '@/lib/queries/core/transform'
import { type Application } from '@/features/applications/schemas/application.schema'

/**
 * Get applications for a specific company
 * Requires authenticated user
 */
export async function getApplicationsByCompany(companyId: string): Promise<Application[]> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getApplicationsByCompany: No authenticated user')
    return []
  }

  return getCachedApplicationsByCompany(session.user.id, companyId)
}

const getCachedApplicationsByCompany = unstable_cache(
  async (userId: string, companyId: string): Promise<Application[]> => {
    const supabase = createCacheClient()

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('job_id')
      .eq('company_id', companyId)

    if (jobsError) {
      logger.error('Error fetching jobs for company', { error: jobsError, companyId })
      return []
    }

    if (!jobs || jobs.length === 0) {
      return []
    }

    const jobIds = jobs.map((j) => j.job_id)

    const { data, error } = await supabase
      .from('applications')
      .select(APPLICATION_SELECT_QUERY)
      .eq('user_id', userId)
      .in('job_id', jobIds)
      .order('application_date', { ascending: false })

    if (error) {
      logger.error('Error fetching applications by company', { error, companyId })
      return []
    }

    return (data || []).map(transformDbToApplication)
  },
  ['applications-by-company'],
  {
    tags: [QUERY_CACHE_TAGS.APPLICATIONS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
