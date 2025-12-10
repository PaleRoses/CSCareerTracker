'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type StageDropoff } from '../../types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getStageDropoff(): Promise<StageDropoff[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedStageDropoff(session.user.id)
}

const getCachedStageDropoff = unstable_cache(
  async (userId: string): Promise<StageDropoff[]> => {
    const supabase = createCacheClient()

    const { data: stages, error: stagesError } = await supabase
      .from('stages')
      .select('stage_id, stage_name, order_index')
      .order('order_index', { ascending: true })

    if (stagesError) {
      logger.error('Error fetching stages', { error: stagesError })
      return []
    }

    const { data: appStages, error: appStagesError } = await supabase
      .from('application_stages')
      .select(`
        app_stage_id,
        stage_id,
        status,
        applications!inner (
          user_id
        )
      `)
      .eq('applications.user_id', userId)

    if (appStagesError) {
      logger.error('Error fetching application stages', { error: appStagesError })
      return []
    }

    const stageStats = new Map<string, {
      stageName: string
      orderIndex: number
      reachedCount: number
      droppedCount: number
    }>()

    for (const stage of stages || []) {
      stageStats.set(stage.stage_id, {
        stageName: stage.stage_name,
        orderIndex: stage.order_index,
        reachedCount: 0,
        droppedCount: 0,
      })
    }

    for (const appStage of appStages || []) {
      const stats = stageStats.get(appStage.stage_id)
      if (stats) {
        stats.reachedCount++
        if (appStage.status === 'rejected') {
          stats.droppedCount++
        }
      }
    }

    const results: StageDropoff[] = []

    for (const [, stats] of stageStats) {
      if (stats.reachedCount > 0) {
        results.push({
          stageName: stats.stageName,
          reachedCount: stats.reachedCount,
          droppedCount: stats.droppedCount,
          dropoffRate: Math.round((stats.droppedCount / stats.reachedCount) * 100),
        })
      }
    }

    return results.sort((a, b) => {
      const aStats = Array.from(stageStats.values()).find(s => s.stageName === a.stageName)
      const bStats = Array.from(stageStats.values()).find(s => s.stageName === b.stageName)
      return (aStats?.orderIndex || 0) - (bStats?.orderIndex || 0)
    })
  },
  ['stage-dropoff'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
