'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { LONG_REVALIDATE_SECONDS, QUERY_CACHE_TAGS } from '../core/cache'
import type { Job, JobFilters, JobType } from '@/features/jobs/types'

/**
 * Get all jobs with company information
 * Jobs are public data - no user auth required
 */
export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  const filterKey = createJobFilterKey(filters)
  return getCachedJobs(filters, filterKey)
}

const getCachedJobs = unstable_cache(
  async (filters: JobFilters, _filterKey: string): Promise<Job[]> => {
    const supabase = createCacheClient()

    let query = supabase
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

    // By default, only show active jobs (unless includeArchived is true)
    if (!filters.includeArchived) {
      query = query.eq('is_active', true)
    }

    // Apply filters
    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId)
    }

    if (filters.type) {
      query = query.eq('job_type', filters.type)
    }

    if (filters.search) {
      query = query.ilike('job_title', `%${filters.search}%`)
    }

    if (filters.postedBy) {
      query = query.eq('posted_by', filters.postedBy)
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1)
    }

    const { data, error } = await query.order('posted_date', { ascending: false })

    if (error) {
      logger.error('Error fetching jobs', { error })
      return []
    }

    return (data || []).map(transformDbToJob)
  },
  ['jobs-list'],
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

function createJobFilterKey(filters: JobFilters): string {
  const parts = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value)}`)

  return parts.length > 0 ? parts.join('|') : 'no-filters'
}
