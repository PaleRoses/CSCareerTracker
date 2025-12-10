'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type StageConversion } from '../../types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getConversionRates(): Promise<StageConversion[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedConversionRates(session.user.id)
}

const getCachedConversionRates = unstable_cache(
  async (userId: string): Promise<StageConversion[]> => {
    const supabase = createCacheClient()

    const { data: stagesData } = await supabase
      .from('stages')
      .select('stage_id, stage_name, order_index')
      .order('order_index', { ascending: true })

    if (!stagesData || stagesData.length < 2) {
      return []
    }

    const orderedStages = stagesData.filter(s => s.stage_name !== 'Withdrawn')

    const { data: appStagesData, error } = await supabase
      .from('application_stages')
      .select(`
        stage_id,
        status,
        applications!inner (
          user_id,
          application_id
        )
      `)
      .eq('applications.user_id', userId)

    if (error) {
      logger.error('Error fetching conversion rates', { error })
      return []
    }

    type AppStageRow = {
      stage_id: string
      status: string
      applications: { application_id: string }
    }

    const appStages = (appStagesData || []) as unknown as AppStageRow[]

    const appStageMap = new Map<string, Set<string>>()
    const successfulStages = new Map<string, Set<string>>()

    for (const row of appStages) {
      const appId = row.applications.application_id
      const stageId = row.stage_id

      if (!appStageMap.has(stageId)) {
        appStageMap.set(stageId, new Set())
      }
      appStageMap.get(stageId)!.add(appId)

      if (row.status === 'successful') {
        if (!successfulStages.has(stageId)) {
          successfulStages.set(stageId, new Set())
        }
        successfulStages.get(stageId)!.add(appId)
      }
    }

    const results: StageConversion[] = []

    for (let i = 0; i < orderedStages.length - 1; i++) {
      const fromStage = orderedStages[i]
      const toStage = orderedStages[i + 1]

      const appsAtFromStage = appStageMap.get(fromStage.stage_id) || new Set()
      const appsAtToStage = appStageMap.get(toStage.stage_id) || new Set()

      const totalAttempts = appsAtFromStage.size
      const successes = [...appsAtFromStage].filter(appId =>
        appsAtToStage.has(appId)
      ).length

      if (totalAttempts > 0) {
        results.push({
          fromStage: fromStage.stage_name,
          toStage: toStage.stage_name,
          totalAttempts,
          successes,
          conversionRate: Math.round((successes / totalAttempts) * 100),
        })
      }
    }

    return results
  },
  ['conversion-rates'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
