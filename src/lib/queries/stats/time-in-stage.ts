'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type TimeInStage } from '../core/types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'
import { logger } from '@/lib/logger'

export async function getAverageTimeInStage(): Promise<TimeInStage[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedTimeInStage(session.user.id)
}

const getCachedTimeInStage = unstable_cache(
  async (userId: string): Promise<TimeInStage[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('application_stages')
      .select(`
        started_at,
        ended_at,
        stages (
          stage_name
        ),
        applications!inner (
          user_id
        )
      `)
      .eq('applications.user_id', userId)
      .not('started_at', 'is', null)
      .not('ended_at', 'is', null)

    if (error) {
      logger.error('Error fetching time in stage', { error })
      return []
    }

    type StageRow = {
      started_at: string
      ended_at: string
      stages: { stage_name: string } | null
    }

    const stageData = (data || []) as unknown as StageRow[]

    const stageMetrics = new Map<string, number[]>()

    for (const row of stageData) {
      const stageName = row.stages?.stage_name
      if (!stageName) continue

      const startDate = new Date(row.started_at)
      const endDate = new Date(row.ended_at)
      const daysInStage = Math.max(0, Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ))

      const existing = stageMetrics.get(stageName) || []
      existing.push(daysInStage)
      stageMetrics.set(stageName, existing)
    }

    const results: TimeInStage[] = []

    for (const [stageName, days] of stageMetrics) {
      if (days.length === 0) continue

      const sorted = [...days].sort((a, b) => a - b)
      const sum = days.reduce((acc, d) => acc + d, 0)

      results.push({
        stageName,
        avgDays: Math.round((sum / days.length) * 10) / 10,
        minDays: sorted[0],
        maxDays: sorted[sorted.length - 1],
        sampleSize: days.length,
      })
    }

    return results.sort((a, b) => b.sampleSize - a.sampleSize)
  },
  ['time-in-stage'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
