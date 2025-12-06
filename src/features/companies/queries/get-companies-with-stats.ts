'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { LONG_REVALIDATE_SECONDS, QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'
import type { Company } from '../types'

/**
 * Get all companies with job counts
 * Companies are public data - no user auth required
 */
export async function getCompaniesWithStats(): Promise<Company[]> {
  return getCachedCompaniesWithStats()
}

const getCachedCompaniesWithStats = unstable_cache(
  async (): Promise<Company[]> => {
    const supabase = createCacheClient()

    // Get companies with job count
    const { data, error } = await supabase
      .from('companies')
      .select(`
        company_id,
        company_name,
        website,
        locations,
        size,
        jobs (count)
      `)
      .order('company_name', { ascending: true })

    if (error) {
      logger.error('Error fetching companies with stats', { error })
      return []
    }

    return (data || []).map((row) => {
      const jobs = row.jobs as unknown as Array<{ count: number }> | null
      const jobCount = jobs?.[0]?.count ?? 0

      return {
        id: row.company_id,
        name: row.company_name,
        website: row.website,
        locations: row.locations || [],
        size: row.size,
        jobCount,
      }
    })
  },
  ['companies-with-stats'],
  {
    tags: [QUERY_CACHE_TAGS.COMPANIES],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)
