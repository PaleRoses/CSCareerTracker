'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type StaleApplication } from '../types'
import {
  QUERY_CACHE_TAGS,
  DEFAULT_REVALIDATE_SECONDS,
  DEFAULT_STALE_THRESHOLD_DAYS,
  MAX_STALE_APPLICATIONS,
} from '@/lib/queries/core/cache'
import { logger } from '@/lib/logger'

export async function getStaleApplications(
  thresholdDays: number = DEFAULT_STALE_THRESHOLD_DAYS,
  limit: number = MAX_STALE_APPLICATIONS
): Promise<StaleApplication[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedStaleApplications(session.user.id, thresholdDays, limit)
}

const getCachedStaleApplications = unstable_cache(
  async (
    userId: string,
    thresholdDays: number,
    limit: number
  ): Promise<StaleApplication[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        position_title,
        date_updated,
        created_at,
        jobs (
          companies (
            company_name
          )
        ),
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
      logger.error('Error fetching stale applications', { error })
      return []
    }

    const now = new Date()
    const apps = data || []

    const staleApps = apps
      .filter((app) => {
        const stages = (app.application_stages as Array<{ status: string }>) || []
        return stages.some((s) => s.status === 'inProgress')
      })
      .map((app) => {
        const lastUpdate = app.date_updated || app.created_at
        const updatedAt = new Date(lastUpdate)
        const daysSinceUpdate = Math.floor(
          (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )

        const rawStages = (app.application_stages || []) as unknown as Array<{
          status: string
          stages: { stage_name: string; order_index: number } | null
        }>
        const stages = rawStages
          .filter((s) => s.stages)
          .sort((a, b) => {
            const orderA = a.stages?.order_index ?? 0
            const orderB = b.stages?.order_index ?? 0
            return orderA - orderB
          })

        const currentStage = stages.find((s) => s.status === 'inProgress')

        const job = app.jobs as unknown as { companies: { company_name: string } | null } | null
        const companyName = job?.companies?.company_name || 'Unknown Company'

        return {
          id: app.application_id,
          company: companyName,
          positionTitle: app.position_title,
          daysSinceUpdate,
          currentStage: currentStage?.stages?.stage_name || 'Unknown',
        }
      })
      .filter((app) => app.daysSinceUpdate >= thresholdDays)
      .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
      .slice(0, limit)

    return staleApps
  },
  ['stale-applications'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
