'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { LONG_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export type CompanyOption = {
  id: string
  name: string
  website: string
}

export async function getCompanies(): Promise<CompanyOption[]> {
  return getCachedCompanies()
}

const getCachedCompanies = unstable_cache(
  async (): Promise<CompanyOption[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('companies')
      .select('company_id, company_name, website')
      .order('company_name', { ascending: true })

    if (error) {
      logger.error('Error fetching companies', { error })
      return []
    }

    return (data || []).map((row) => ({
      id: row.company_id,
      name: row.company_name,
      website: row.website,
    }))
  },
  ['companies'],
  {
    tags: ['companies'],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)
