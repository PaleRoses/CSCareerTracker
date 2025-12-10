'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type StageDistribution } from '../../types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getStageDistribution(): Promise<StageDistribution[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedStageDistribution(session.user.id)
}

const getCachedStageDistribution = unstable_cache(
  async (userId: string): Promise<StageDistribution[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        final_outcome,
        application_stages (
          status,
          stages (
            stage_name,
            order_index
          )
        )
      `)
      .eq('user_id', userId)

    if (error) {
      logger.error('Error fetching stage distribution', { error })
      return []
    }

    const apps = data || []
    const stageCounts: Record<string, number> = {}

    apps.forEach((app) => {
      const stages = ((app.application_stages as Array<{
        status: string
        stages: { stage_name: string; order_index: number } | { stage_name: string; order_index: number }[] | null
      }>) || [])
        .filter((s) => s.stages)
        .sort((a, b) => {
          const orderA = extractOrderIndex(a.stages)
          const orderB = extractOrderIndex(b.stages)
          return orderA - orderB
        })

      const currentStage =
        stages.find((s) => s.status === 'inProgress') ||
        stages.filter((s) => s.status === 'successful').pop() ||
        stages[0]

      if (currentStage?.stages) {
        const stageName = extractStageName(currentStage.stages)
        if (stageName) {
          stageCounts[stageName] = (stageCounts[stageName] || 0) + 1
        }
      }
    })

    const distribution: StageDistribution[] = Object.entries(stageCounts)
      .map(([stage, count]) => ({ stage, count }))
      .sort((a, b) => getStageOrder(a.stage) - getStageOrder(b.stage))

    return distribution
  },
  ['stage-distribution'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)

function extractOrderIndex(stages: unknown): number {
  if (!stages) return 0
  if (Array.isArray(stages)) {
    return (stages[0] as { order_index?: number })?.order_index ?? 0
  }
  return (stages as { order_index?: number })?.order_index ?? 0
}

function extractStageName(stages: unknown): string | null {
  if (!stages) return null
  if (Array.isArray(stages)) {
    return (stages[0] as { stage_name?: string })?.stage_name ?? null
  }
  return (stages as { stage_name?: string })?.stage_name ?? null
}

function getStageOrder(stageName: string): number {
  const order: Record<string, number> = {
    'Applied': 1,
    'OA': 2,
    'Phone Screen': 3,
    'Onsite/Virtual': 4,
    'Offer': 5,
    'Rejected': 6,
    'Withdrawn': 7,
  }
  return order[stageName] ?? 99
}
