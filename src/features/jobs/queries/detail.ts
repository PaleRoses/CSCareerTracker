'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { LONG_REVALIDATE_SECONDS, QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'
import type { Job, JobType } from '@/features/jobs/types'

/**
 * Get a single job by ID
 * For recruiters editing their own jobs - verifies ownership
 */
export async function getJob(jobId: string): Promise<Job | null> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getJob: No authenticated user')
    return null
  }

  // Only privileged users (recruiters, admins) can fetch job details for editing
  if (!hasPrivilegedAccess(session.user.role)) {
    logger.warn('getJob: User does not have privileged access')
    return null
  }

  return getCachedJob(jobId, session.user.id)
}

const getCachedJob = unstable_cache(
  async (jobId: string, userId: string): Promise<Job | null> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        job_id,
        job_title,
        job_type,
        locations,
        url,
        posted_date,
        posted_by,
        is_active,
        company_id,
        companies!inner (
          company_name,
          website,
          size
        )
      `)
      .eq('job_id', jobId)
      .eq('posted_by', userId) // Ownership check - only fetch if user owns the job
      .maybeSingle()

    if (error) {
      logger.error('Error fetching job', { error, jobId })
      return null
    }

    if (!data) {
      return null
    }

    return transformDbToJob(data)
  },
  ['job-detail'],
  {
    tags: [QUERY_CACHE_TAGS.JOBS],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)

/**
 * Get a job by ID without ownership check
 * For public job viewing (job browser, candidate applications)
 */
export async function getJobPublic(jobId: string): Promise<Job | null> {
  return getCachedJobPublic(jobId)
}

const getCachedJobPublic = unstable_cache(
  async (jobId: string): Promise<Job | null> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        job_id,
        job_title,
        job_type,
        locations,
        url,
        posted_date,
        posted_by,
        is_active,
        company_id,
        companies!inner (
          company_name,
          website,
          size
        )
      `)
      .eq('job_id', jobId)
      .eq('is_active', true) // Only active jobs for public viewing
      .maybeSingle()

    if (error) {
      logger.error('Error fetching public job', { error, jobId })
      return null
    }

    if (!data) {
      return null
    }

    return transformDbToJob(data)
  },
  ['job-detail-public'],
  {
    tags: [QUERY_CACHE_TAGS.JOBS],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)

function transformDbToJob(row: Record<string, unknown>): Job {
  const companies = row.companies as { company_name: string; website: string | null; size: number | null } | null

  return {
    id: row.job_id as string,
    companyId: row.company_id as string,
    companyName: companies?.company_name ?? 'Unknown Company',
    title: row.job_title as string,
    type: row.job_type as JobType,
    locations: (row.locations as string[]) || [],
    url: row.url as string | null,
    postedDate: row.posted_date as string,
    postedBy: row.posted_by as string | null,
    companyWebsite: companies?.website ?? null,
    companySize: companies?.size ?? null,
    isActive: row.is_active as boolean,
  }
}
