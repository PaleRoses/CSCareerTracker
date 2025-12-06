'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'
import { logger } from '@/lib/logger'

export type TimelineStage = {
  stageName: string
  stageOrder: number
  status: 'inProgress' | 'rejected' | 'successful'
  startedAt: string
  endedAt: string | null
  durationDays: number | null
  notes: string
}

export type ApplicationTimeline = {
  applicationId: string
  company: string
  positionTitle: string
  applicationDate: string
  totalDays: number
  stages: TimelineStage[]
}

export async function getApplicationTimeline(
  applicationId: string
): Promise<ApplicationTimeline | null> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getApplicationTimeline: No authenticated user')
    return null
  }

  return getCachedTimeline(applicationId, session.user.id)
}

const getCachedTimeline = unstable_cache(
  async (applicationId: string, userId: string): Promise<ApplicationTimeline | null> => {
    const supabase = createCacheClient()

    // Fetch application with stages and company info
    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        application_date,
        position_title,
        user_id,
        jobs!inner (
          companies!inner (
            company_name
          )
        ),
        application_stages (
          started_at,
          ended_at,
          status,
          notes,
          stages!inner (
            stage_name,
            order_index
          )
        )
      `)
      .eq('application_id', applicationId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      logger.error('Error fetching application timeline', { error, applicationId })
      return null
    }

    if (!data) return null

    const now = new Date()
    const applicationDate = new Date(data.application_date)

    const jobs = data.jobs as unknown as Array<{ companies: Array<{ company_name: string }> }>
    const companyName = jobs?.[0]?.companies?.[0]?.company_name ?? 'Unknown Company'

    const sortedStages = [...(data.application_stages || [])].sort((a, b) => {
      const stagesA = a.stages as unknown as Array<{ order_index: number }>
      const stagesB = b.stages as unknown as Array<{ order_index: number }>
      const orderA = stagesA?.[0]?.order_index ?? 0
      const orderB = stagesB?.[0]?.order_index ?? 0
      return orderA - orderB
    })

    const stages: TimelineStage[] = sortedStages.map((stage) => {
      const startedAt = new Date(stage.started_at)
      const endedAt = stage.ended_at ? new Date(stage.ended_at) : null

      let durationDays: number | null = null
      if (endedAt) {
        durationDays = Math.round(
          (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      } else if (stage.status === 'inProgress') {
        durationDays = Math.round(
          (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      }

      const stageInfo = stage.stages as unknown as Array<{ stage_name: string; order_index: number }>

      return {
        stageName: stageInfo?.[0]?.stage_name ?? 'Unknown',
        stageOrder: stageInfo?.[0]?.order_index ?? 0,
        status: stage.status as TimelineStage['status'],
        startedAt: stage.started_at,
        endedAt: stage.ended_at,
        durationDays,
        notes: stage.notes || '',
      }
    })

    const totalDays = Math.round(
      (now.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      applicationId: data.application_id,
      company: companyName,
      positionTitle: data.position_title,
      applicationDate: data.application_date,
      totalDays,
      stages,
    }
  },
  ['application-timeline'],
  {
    tags: [QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
