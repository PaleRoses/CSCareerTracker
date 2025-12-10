'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { type CompanyConsistency } from '../../types'
import { QUERY_CACHE_TAGS, LONG_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { isAdmin } from '@/lib/queries/core/auth-utils'
import { logger } from '@/lib/logger'

export async function getCompanyConsistencyStats(): Promise<CompanyConsistency[]> {
  if (!(await isAdmin())) {
    return []
  }

  return getCachedCompanyConsistency()
}

const getCachedCompanyConsistency = unstable_cache(
  async (): Promise<CompanyConsistency[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        application_date,
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
      logger.error('Error fetching company consistency', { error })
      return []
    }

    type StageInfo = {
      started_at: string | null
      stages: { order_index: number } | null
    }

    type AppRow = {
      application_id: string
      application_date: string
      jobs: {
        company_id: string
        companies: { company_id: string; company_name: string } | null
      } | null
      application_stages: StageInfo[]
    }

    const apps = (data || []) as unknown as AppRow[]

    const companyData = new Map<string, {
      companyName: string
      responseDays: number[]
    }>()

    for (const app of apps) {
      const companyId = app.jobs?.company_id
      const companyName = app.jobs?.companies?.company_name
      if (!companyId || !companyName) continue

      const existing = companyData.get(companyId) || {
        companyName,
        responseDays: [],
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

    const results: CompanyConsistency[] = []

    for (const [companyId, data] of companyData) {
      if (data.responseDays.length < 2) continue

      const days = data.responseDays
      const avg = days.reduce((a, b) => a + b, 0) / days.length
      const variance = days.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / days.length
      const stdDev = Math.sqrt(variance)

      const maxStdDev = 30
      const consistencyScore = Math.max(0, Math.round((1 - stdDev / maxStdDev) * 100))

      results.push({
        companyId,
        companyName: data.companyName,
        totalApplicationsAllUsers: days.length,
        avgResponseDays: Math.round(avg * 10) / 10,
        responseVariance: Math.round(variance * 10) / 10,
        consistencyScore,
      })
    }

    return results.sort((a, b) => b.consistencyScore - a.consistencyScore)
  },
  ['company-consistency'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: LONG_REVALIDATE_SECONDS,
  }
)
