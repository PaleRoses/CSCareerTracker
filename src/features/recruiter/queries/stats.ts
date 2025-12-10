'use server'

import { createUserClient } from '@/lib/supabase/server'
import { auth, hasPrivilegedAccess } from '@/features/auth'
import { logger } from '@/lib/logger'
import type { RecruiterStats } from '@/features/recruiter/types'

export async function getRecruiterStats(): Promise<RecruiterStats> {
  const defaultStats: RecruiterStats = {
    totalJobsPosted: 0,
    activeJobsCount: 0,
    totalCandidates: 0,
    candidatesByStage: {},
    candidatesByOutcome: {},
    recentApplications: 0,
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return defaultStats
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return defaultStats
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('job_id, is_active')
      .eq('posted_by', userId)

    if (jobsError) {
      logger.error('Error fetching jobs for stats', { error: jobsError })
      return defaultStats
    }

    const totalJobsPosted = jobs?.length || 0
    const activeJobsCount = jobs?.filter(j => j.is_active).length || 0
    const jobIds = jobs?.map(j => j.job_id) || []

    if (jobIds.length === 0) {
      return {
        ...defaultStats,
        totalJobsPosted,
        activeJobsCount,
      }
    }

    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        application_id,
        final_outcome,
        application_date,
        application_stages!inner (
          ended_at,
          stages!inner (
            stage_name
          )
        )
      `)
      .in('job_id', jobIds)

    if (appsError) {
      logger.error('Error fetching applications for stats', { error: appsError })
      return {
        ...defaultStats,
        totalJobsPosted,
        activeJobsCount,
      }
    }

    const totalCandidates = applications?.length || 0

    const candidatesByOutcome: Record<string, number> = {}
    for (const app of applications || []) {
      const outcome = app.final_outcome || 'pending'
      candidatesByOutcome[outcome] = (candidatesByOutcome[outcome] || 0) + 1
    }

    const candidatesByStage: Record<string, number> = {}
    for (const app of applications || []) {
      const stages = app.application_stages as unknown as Array<{
        ended_at: string | null
        stages: { stage_name: string }
      }>
      const activeStage = stages?.find(s => s.ended_at === null)
      if (activeStage) {
        const stageName = activeStage.stages.stage_name
        candidatesByStage[stageName] = (candidatesByStage[stageName] || 0) + 1
      }
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentApplications = (applications || []).filter(app => {
      const appDate = new Date(app.application_date)
      return appDate >= sevenDaysAgo
    }).length

    return {
      totalJobsPosted,
      activeJobsCount,
      totalCandidates,
      candidatesByStage,
      candidatesByOutcome,
      recentApplications,
    }
  } catch (error) {
    logger.error('Unexpected error in getRecruiterStats', { error })
    return defaultStats
  }
}
