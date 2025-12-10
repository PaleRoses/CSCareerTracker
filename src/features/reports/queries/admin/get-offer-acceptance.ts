'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { type OfferAcceptance } from '../../types'
import { QUERY_CACHE_TAGS, LONG_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { isAdmin } from '@/lib/queries/core/auth-utils'
import { logger } from '@/lib/logger'

export async function getOfferAcceptanceRatio(): Promise<OfferAcceptance[]> {
  if (!(await isAdmin())) {
    return []
  }

  return getCachedOfferAcceptance()
}

const getCachedOfferAcceptance = unstable_cache(
  async (): Promise<OfferAcceptance[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        final_outcome,
        jobs (
          company_id,
          companies (
            company_id,
            company_name
          )
        )
      `)
      .in('final_outcome', ['offer', 'withdrawn'])

    if (error) {
      logger.error('Error fetching offer acceptance data', { error })
      return []
    }

    type AppRow = {
      application_id: string
      final_outcome: string
      jobs: {
        company_id: string
        companies: { company_id: string; company_name: string } | null
      } | null
    }

    const apps = (data || []) as unknown as AppRow[]

    const companyData = new Map<string, {
      companyName: string
      offersExtended: number
      offersAccepted: number
    }>()

    for (const app of apps) {
      const companyId = app.jobs?.company_id
      const companyName = app.jobs?.companies?.company_name
      if (!companyId || !companyName) continue

      const existing = companyData.get(companyId) || {
        companyName,
        offersExtended: 0,
        offersAccepted: 0,
      }

      existing.offersExtended++

      if (app.final_outcome === 'offer') {
        existing.offersAccepted++
      }

      companyData.set(companyId, existing)
    }

    const results: OfferAcceptance[] = []

    for (const [companyId, data] of companyData) {
      if (data.offersExtended === 0) continue

      results.push({
        companyId,
        companyName: data.companyName,
        offersExtended: data.offersExtended,
        offersAccepted: data.offersAccepted,
        acceptanceRate: Math.round((data.offersAccepted / data.offersExtended) * 100),
      })
    }

    return results.sort((a, b) => b.offersExtended - a.offersExtended)
  },
  ['offer-acceptance'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)
