'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'
import { DEFAULT_REVALIDATE_SECONDS, QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'
import type { Company } from '../types'

export interface CompanyDetailData extends Company {
  description: string | null
  industry: string | null
}

/**
 * Get a single company's details by ID
 */
export async function getCompanyDetail(companyId: string): Promise<CompanyDetailData | null> {
  return getCachedCompanyDetail(companyId)
}

const getCachedCompanyDetail = unstable_cache(
  async (companyId: string): Promise<CompanyDetailData | null> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('companies')
      .select(`
        company_id,
        company_name,
        website,
        locations,
        size,
        description,
        industry,
        jobs (count)
      `)
      .eq('company_id', companyId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows
        return null
      }
      logger.error('Error fetching company detail', { error, companyId })
      return null
    }

    if (!data) return null

    const jobs = data.jobs as unknown as Array<{ count: number }> | null
    const jobCount = jobs?.[0]?.count ?? 0

    return {
      id: data.company_id,
      name: data.company_name,
      website: data.website,
      locations: data.locations || [],
      size: data.size,
      jobCount,
      description: data.description ?? null,
      industry: data.industry ?? null,
    }
  },
  ['company-detail'],
  {
    tags: [QUERY_CACHE_TAGS.COMPANIES],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
