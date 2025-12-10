'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type StageDropoff } from '../../types'
import { logger } from '@/lib/logger'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'

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

    const { data: stagesData } = await supabase
      .from('stages')
      .select('stage_id, stage_name, order_index')
      .neq('stage_name', 'Withdrawn')
      .order('order_index', { ascending: true })

    if (!stagesData) {
      return []
    }

    const { data: appStagesData, error } = await supabase
      .from('application_stages')
      .select(`
        stage_id,
        status,
        applications!inner (
          user_id,
          application_id,
          final_outcome
        )
      `)
      .eq('applications.user_id', userId)

    if (error) {
      logger.error('Error fetching stage dropoff', { error })
      return []
    }

    type AppStageRow = {
      stage_id: string
      status: string
      applications: {
        application_id: string
        final_outcome: string
      }
    }

    const appStages = (appStagesData || []) as unknown as AppStageRow[]

    const stageReached = new Map<string, Set<string>>()
    const stageDropped = new Map<string, Set<string>>()

    for (const row of appStages) {
      const stageId = row.stage_id
      const appId = row.applications.application_id
      const finalOutcome = row.applications.final_outcome

      if (!stageReached.has(stageId)) {
        stageReached.set(stageId, new Set())
      }
      stageReached.get(stageId)!.add(appId)

      if (row.status === 'rejected' || finalOutcome === 'rejected') {
        if (!stageDropped.has(stageId)) {
          stageDropped.set(stageId, new Set())
        }
        stageDropped.get(stageId)!.add(appId)
      }
    }

    const results: StageDropoff[] = []

    for (const stage of stagesData) {
      const reached = stageReached.get(stage.stage_id)?.size || 0
      const dropped = stageDropped.get(stage.stage_id)?.size || 0

      if (reached > 0) {
        results.push({
          stageName: stage.stage_name,
          reachedCount: reached,
          droppedCount: dropped,
          dropoffRate: Math.round((dropped / reached) * 100),
        })
      }
    }

    return results
  },
  ['stage-dropoff'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
