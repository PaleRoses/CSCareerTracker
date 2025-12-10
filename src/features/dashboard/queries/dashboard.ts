'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import {
  STALE_THRESHOLD_DAYS,
  MAX_STALE_APPLICATIONS,
  MAX_RECENT_ACTIVITY,
  MAX_RECENT_APPLICATIONS,
  MAX_RECENT_OUTCOMES,
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
} from '@/features/dashboard/constants'
import {
  extractOrderIndex,
  extractStageName,
  extractCompanyName,
} from '@/lib/queries/core/transform'
import { logger } from '@/lib/logger'
import type { StageDistribution, StaleApplication, ActivityItem, DashboardStats } from '../types'

export type { StageDistribution, StaleApplication, ActivityItem, DashboardStats }

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth()

  if (!session?.user?.id) {
    return getEmptyStats()
  }

  return getCachedDashboardStats(session.user.id)
}

const getCachedDashboardStats = unstable_cache(
  async (userId: string): Promise<DashboardStats> => {
    const supabase = createCacheClient()

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        position_title,
        final_outcome,
        date_updated,
        created_at,
        jobs (
          job_id,
          companies (
            company_name
          )
        ),
        application_stages (
          app_stage_id,
          status,
          stages (
            stage_name,
            order_index
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching dashboard stats', { error })
      return getEmptyStats()
    }

    const apps = applications || []

    const totalApplications = apps.length
    const offersReceived = apps.filter((a) => a.final_outcome === 'offer').length
    const rejectedApplications = apps.filter((a) => a.final_outcome === 'rejected').length

    const pendingApplications = apps.filter((a) => {
      const stages = a.application_stages as Array<Record<string, unknown>> || []
      return stages.some((s) => s.status === 'inProgress')
    }).length

    const responded = offersReceived + rejectedApplications
    const responseRate = totalApplications > 0
      ? Math.round((responded / totalApplications) * 100)
      : 0

    const stageDistribution = calculateStageDistribution(apps)
    const staleApplications = findStaleApplications(apps)
    const recentActivity = buildRecentActivity(apps)

    return {
      totalApplications,
      offersReceived,
      pendingApplications,
      rejectedApplications,
      responseRate,
      stageDistribution,
      staleApplications,
      recentActivity,
    }
  },
  ['dashboard-stats'],
  {
    tags: [CACHE_TAGS.APPLICATIONS, CACHE_TAGS.DASHBOARD],
    revalidate: CACHE_REVALIDATE_SECONDS,
  }
)

function getEmptyStats(): DashboardStats {
  return {
    totalApplications: 0,
    offersReceived: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    responseRate: 0,
    stageDistribution: [],
    staleApplications: [],
    recentActivity: [],
  }
}

function calculateStageDistribution(
  apps: Array<{
    final_outcome: string | null
    application_stages: Array<{
      status: string
      stages: Array<{ stage_name: string; order_index: number }> | { stage_name: string; order_index: number } | null
    }>
  }>
): StageDistribution[] {
  const stageCounts: Record<string, number> = {}

  apps.forEach((app) => {
    const stages = (app.application_stages || [])
      .filter((s) => s.stages)
      .sort((a, b) => extractOrderIndex(a) - extractOrderIndex(b))

    const currentStage = stages.find((s) => s.status === 'inProgress')
      || stages.filter((s) => s.status === 'successful').pop()
      || stages[0]

    if (currentStage?.stages) {
      const stageName = extractStageName(currentStage)
      if (stageName && stageName !== 'Offer') {
        stageCounts[stageName] = (stageCounts[stageName] || 0) + 1
      }
    }
  })

  const offers = apps.filter((a) => a.final_outcome === 'offer').length
  const rejections = apps.filter((a) => a.final_outcome === 'rejected').length

  const distribution: StageDistribution[] = Object.entries(stageCounts).map(
    ([stage, count]) => ({ stage, count })
  )

  if (offers > 0) {
    distribution.push({ stage: 'Received Offers', count: offers })
  }
  if (rejections > 0) {
    distribution.push({ stage: 'Rejected', count: rejections })
  }

  return distribution
}

function findStaleApplications(
  apps: Array<{
    application_id: string
    position_title: string
    final_outcome: string | null
    date_updated: string | null
    jobs: Array<{ companies: Array<{ company_name: string }> }> | null
    application_stages: Array<{
      status: string
      stages: Array<{ stage_name: string; order_index: number }> | { stage_name: string; order_index: number } | null
    }>
  }>
): StaleApplication[] {
  const now = new Date()

  return apps
    .filter((app) => {
      const stages = app.application_stages || []
      return stages.some((s) => s.status === 'inProgress')
    })
    .map((app) => {
      const updatedAt = new Date(app.date_updated || app.application_id)
      const daysSinceUpdate = Math.floor(
        (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      const stages = (app.application_stages || [])
        .filter((s) => s.stages)
        .sort((a, b) => extractOrderIndex(a) - extractOrderIndex(b))

      const currentStage = stages.find((s) => s.status === 'inProgress')
      const companyName = extractCompanyName(app)
      const stageName = currentStage ? extractStageName(currentStage) : null

      return {
        id: app.application_id,
        company: companyName,
        positionTitle: app.position_title,
        daysSinceUpdate,
        currentStage: stageName || 'Unknown',
      }
    })
    .filter((app) => app.daysSinceUpdate >= STALE_THRESHOLD_DAYS)
    .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
    .slice(0, MAX_STALE_APPLICATIONS)
}

function buildRecentActivity(
  apps: Array<{
    application_id: string
    position_title: string
    final_outcome: string | null
    created_at: string
    jobs: Array<{ companies: Array<{ company_name: string }> }> | null
  }>
): ActivityItem[] {
  const activities: ActivityItem[] = []

  apps.slice(0, MAX_RECENT_APPLICATIONS).forEach((app) => {
    const companyName = extractCompanyName(app)
    activities.push({
      id: `create-${app.application_id}`,
      type: 'application_created',
      company: companyName,
      position: app.position_title,
      date: app.created_at,
      description: `Applied to ${companyName}`,
    })
  })

  apps
    .filter((app) => app.final_outcome === 'offer' || app.final_outcome === 'rejected')
    .slice(0, MAX_RECENT_OUTCOMES)
    .forEach((app) => {
      const companyName = extractCompanyName(app)
      activities.push({
        id: `outcome-${app.application_id}`,
        type: app.final_outcome === 'offer' ? 'offer_received' : 'rejection',
        company: companyName,
        position: app.position_title,
        date: app.created_at,
        description:
          app.final_outcome === 'offer'
            ? `Received offer from ${companyName}`
            : `Rejected by ${companyName}`,
      })
    })

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_RECENT_ACTIVITY)
}
