'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type MonthlyStats, type DateRange } from '@/lib/queries/core/types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getMonthlyTrends(dateRange?: DateRange): Promise<MonthlyStats[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  const rangeKey = dateRange ? `${dateRange.from}-${dateRange.to}` : 'all'
  return getCachedMonthlyTrends(session.user.id, rangeKey, dateRange)
}

const getCachedMonthlyTrends = unstable_cache(
  async (
    userId: string,
    _rangeKey: string,
    dateRange?: DateRange
  ): Promise<MonthlyStats[]> => {
    const supabase = createCacheClient()

    let query = supabase
      .from('applications')
      .select('application_date, final_outcome')
      .eq('user_id', userId)

    if (dateRange?.from) {
      query = query.gte('application_date', dateRange.from)
    }
    if (dateRange?.to) {
      query = query.lte('application_date', dateRange.to)
    }

    const { data, error } = await query.order('application_date', { ascending: true })

    if (error) {
      logger.error('Error fetching monthly trends', { error })
      return []
    }

    const apps = data || []

    const monthMap = new Map<string, {
      applications: number
      offers: number
      rejections: number
      withdrawn: number
    }>()

    for (const app of apps) {
      const month = app.application_date.substring(0, 7)

      const existing = monthMap.get(month) || {
        applications: 0,
        offers: 0,
        rejections: 0,
        withdrawn: 0,
      }

      existing.applications++

      switch (app.final_outcome) {
        case 'offer':
          existing.offers++
          break
        case 'rejected':
          existing.rejections++
          break
        case 'withdrawn':
          existing.withdrawn++
          break
      }

      monthMap.set(month, existing)
    }

    const results: MonthlyStats[] = []

    for (const [month, stats] of monthMap) {
      results.push({
        month,
        applications: stats.applications,
        offers: stats.offers,
        rejections: stats.rejections,
        withdrawn: stats.withdrawn,
        successRate: stats.applications > 0
          ? Math.round((stats.offers / stats.applications) * 100)
          : 0,
      })
    }

    return results.sort((a, b) => a.month.localeCompare(b.month))
  },
  ['monthly-trends'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
