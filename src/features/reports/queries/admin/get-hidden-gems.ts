'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { type HiddenGem } from '@/lib/queries/core/types'
import { QUERY_CACHE_TAGS, LONG_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { isAdmin } from '@/lib/queries/core/auth-utils'
import { logger } from '@/lib/logger'

const LOW_VOLUME_THRESHOLD = 10
const HIGH_OFFER_RATE_THRESHOLD = 20

export async function getHiddenGemCompanies(): Promise<HiddenGem[]> {
  if (!(await isAdmin())) {
    return []
  }

  return getCachedHiddenGems()
}

const getCachedHiddenGems = unstable_cache(
  async (): Promise<HiddenGem[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        application_date,
        final_outcome,
        jobs (
          company_id,
          companies (
            company_id,
            company_name
          )
        ),
        application_stages (
          started_at,
          stages (
            order_index
          )
        )
      `)

    if (error) {
      logger.error('Error fetching hidden gems', { error })
      return []
    }

    type StageInfo = {
      started_at: string | null
      stages: { order_index: number } | null
    }

    type AppRow = {
      application_id: string
      application_date: string
      final_outcome: string
      jobs: {
        company_id: string
        companies: { company_id: string; company_name: string } | null
      } | null
      application_stages: StageInfo[]
    }

    const apps = (data || []) as unknown as AppRow[]

    const companyData = new Map<string, {
      companyName: string
      total: number
      offers: number
      responseDays: number[]
    }>()

    for (const app of apps) {
      const companyId = app.jobs?.company_id
      const companyName = app.jobs?.companies?.company_name
      if (!companyId || !companyName) continue

      const existing = companyData.get(companyId) || {
        companyName,
        total: 0,
        offers: 0,
        responseDays: [],
      }

      existing.total++

      if (app.final_outcome === 'offer') {
        existing.offers++
      }

      const stages = app.application_stages || []
      const secondStage = stages
        .filter(s => s.stages && s.stages.order_index > 1 && s.started_at)
        .sort((a, b) => (a.stages?.order_index || 0) - (b.stages?.order_index || 0))[0]

      if (secondStage?.started_at) {
        const applicationDate = new Date(app.application_date)
        const responseDate = new Date(secondStage.started_at)
        const daysDiff = Math.floor(
          (responseDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff >= 0) {
          existing.responseDays.push(daysDiff)
        }
      }

      companyData.set(companyId, existing)
    }

    const results: HiddenGem[] = []

    for (const [companyId, data] of companyData) {
      const offerRate = data.total > 0
        ? Math.round((data.offers / data.total) * 100)
        : 0

      if (data.total <= LOW_VOLUME_THRESHOLD && offerRate >= HIGH_OFFER_RATE_THRESHOLD) {
        const avgResponseDays = data.responseDays.length > 0
          ? Math.round(
              (data.responseDays.reduce((a, b) => a + b, 0) / data.responseDays.length) * 10
            ) / 10
          : 0

        results.push({
          companyId,
          companyName: data.companyName,
          totalApplications: data.total,
          offerRate,
          avgResponseDays,
        })
      }
    }

    return results.sort((a, b) => b.offerRate - a.offerRate)
  },
  ['hidden-gems'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)
