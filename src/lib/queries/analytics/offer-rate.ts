'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type CompanyStats } from '../core/types'
import { logger } from '@/lib/logger'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'

export async function getOfferRateByCompany(): Promise<CompanyStats[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedOfferRates(session.user.id)
}

const getCachedOfferRates = unstable_cache(
  async (userId: string): Promise<CompanyStats[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        final_outcome,
        jobs (
          company_id,
          companies (
            company_id,
            company_name
          )
        )
      `)
      .eq('user_id', userId)

    if (error) {
      logger.error('Error fetching offer rates', { error })
      return []
    }

    type AppRow = {
      final_outcome: string
      jobs: {
        company_id: string
        companies: { company_id: string; company_name: string } | null
      } | null
    }

    const apps = (data || []) as unknown as AppRow[]

    const companyMap = new Map<string, {
      companyName: string
      total: number
      offers: number
      rejections: number
      pending: number
    }>()

    for (const app of apps) {
      const companyId = app.jobs?.company_id
      const companyName = app.jobs?.companies?.company_name
      if (!companyId || !companyName) continue

      const existing = companyMap.get(companyId) || {
        companyName,
        total: 0,
        offers: 0,
        rejections: 0,
        pending: 0,
      }

      existing.total++

      switch (app.final_outcome) {
        case 'offer':
          existing.offers++
          break
        case 'rejected':
          existing.rejections++
          break
        case 'pending':
          existing.pending++
          break
      }

      companyMap.set(companyId, existing)
    }

    const results: CompanyStats[] = []

    for (const [companyId, stats] of companyMap) {
      results.push({
        companyId,
        companyName: stats.companyName,
        totalApplications: stats.total,
        offers: stats.offers,
        rejections: stats.rejections,
        pending: stats.pending,
        offerRate: stats.total > 0
          ? Math.round((stats.offers / stats.total) * 100)
          : 0,
        avgResponseDays: null,
      })
    }

    return results.sort((a, b) => b.totalApplications - a.totalApplications)
  },
  ['offer-rate-by-company'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
