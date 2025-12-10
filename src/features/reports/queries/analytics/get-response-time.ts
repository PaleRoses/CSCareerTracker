'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type CompanyStats } from '../../types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getResponseTimeByCompany(): Promise<CompanyStats[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedResponseTime(session.user.id)
}

const getCachedResponseTime = unstable_cache(
  async (userId: string): Promise<CompanyStats[]> => {
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
      .eq('user_id', userId)

    if (error) {
      logger.error('Error fetching response time data', { error })
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
      rejections: number
      pending: number
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
        rejections: 0,
        pending: 0,
        responseDays: [],
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

      const stages = app.application_stages || []
      const firstResponse = stages
        .filter(s => s.stages && s.stages.order_index > 1 && s.started_at)
        .sort((a, b) => (a.stages?.order_index || 0) - (b.stages?.order_index || 0))[0]

      if (firstResponse?.started_at) {
        const applicationDate = new Date(app.application_date)
        const responseDate = new Date(firstResponse.started_at)
        const daysDiff = Math.floor(
          (responseDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff >= 0) {
          existing.responseDays.push(daysDiff)
        }
      }

      companyData.set(companyId, existing)
    }

    const results: CompanyStats[] = []

    for (const [companyId, data] of companyData) {
      const avgResponseDays = data.responseDays.length > 0
        ? Math.round(
            (data.responseDays.reduce((a, b) => a + b, 0) / data.responseDays.length) * 10
          ) / 10
        : null

      results.push({
        companyId,
        companyName: data.companyName,
        totalApplications: data.total,
        offers: data.offers,
        rejections: data.rejections,
        pending: data.pending,
        offerRate: data.total > 0 ? Math.round((data.offers / data.total) * 100) : 0,
        avgResponseDays,
      })
    }

    return results.sort((a, b) => {
      if (a.avgResponseDays === null && b.avgResponseDays === null) return 0
      if (a.avgResponseDays === null) return 1
      if (b.avgResponseDays === null) return -1
      return a.avgResponseDays - b.avgResponseDays
    })
  },
  ['response-time-by-company'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.COMPANIES],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
