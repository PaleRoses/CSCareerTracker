'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { LONG_REVALIDATE_SECONDS, QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'
import type { Job, JobType } from '@/features/jobs/types'

export async function getJob(jobId: string): Promise<Job | null> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getJob: No authenticated user')
    return null
  }

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
      .eq('posted_by', userId)
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
      .eq('is_active', true)
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
