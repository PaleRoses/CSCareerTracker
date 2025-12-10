'use server'

import { createUserClient, createCacheClient } from '@/lib/supabase/server'
import { auth, hasPrivilegedAccess } from '@/features/auth'
import { logger } from '@/lib/logger'
import type { Candidate, CandidateStage } from '@/features/recruiter/types'

interface CandidateFilters {
  jobId?: string
  status?: 'inProgress' | 'successful' | 'rejected'
  outcome?: 'pending' | 'offer' | 'rejected' | 'withdrawn'
  limit?: number
  offset?: number
}

export async function getCandidates(filters: CandidateFilters = {}): Promise<Candidate[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return []
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    let query = supabase
      .from('applications')
      .select(`
        application_id,
        user_id,
        position_title,
        application_date,
        final_outcome,
        users!inner (
          user_id,
          email,
          fname,
          lname
        ),
        jobs!inner (
          job_id,
          posted_by
        ),
        application_stages (
          app_stage_id,
          stage_id,
          started_at,
          ended_at,
          status,
          notes,
          updated_by,
          stages!inner (
            stage_name,
            order_index
          )
        )
      `)
      .eq('jobs.posted_by', userId)

    if (filters.jobId) {
      query = query.eq('job_id', filters.jobId)
    }

    if (filters.outcome) {
      query = query.eq('final_outcome', filters.outcome)
    }

    query = query.order('application_date', { ascending: false })

    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      logger.error('Error fetching candidates', { error })
      return []
    }

    return (data || []).map(transformToCandidate)
  } catch (error) {
    logger.error('Unexpected error in getCandidates', { error })
    return []
  }
}

export async function getCandidateDetail(applicationId: string): Promise<Candidate | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return null
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        user_id,
        position_title,
        application_date,
        final_outcome,
        users!inner (
          user_id,
          email,
          fname,
          lname
        ),
        jobs!inner (
          job_id,
          posted_by
        ),
        application_stages (
          app_stage_id,
          stage_id,
          started_at,
          ended_at,
          status,
          notes,
          updated_by,
          stages!inner (
            stage_name,
            order_index
          )
        )
      `)
      .eq('application_id', applicationId)
      .eq('jobs.posted_by', userId)
      .single()

    if (error) {
      logger.error('Error fetching candidate detail', { error, applicationId })
      return null
    }

    return transformToCandidate(data)
  } catch (error) {
    logger.error('Unexpected error in getCandidateDetail', { error, applicationId })
    return null
  }
}

export async function getCandidateCountsByStage(jobId?: string): Promise<Record<string, number>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return {}
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return {}
    }

    const userId = session.user.id
    const supabase = createCacheClient()

    let query = supabase
      .from('application_stages')
      .select(`
        stage_id,
        status,
        applications!inner (
          jobs!inner (
            posted_by
          )
        ),
        stages!inner (
          stage_name
        )
      `)
      .eq('applications.jobs.posted_by', userId)
      .is('ended_at', null)

    if (jobId) {
      query = query.eq('applications.job_id', jobId)
    }

    const { data, error } = await query

    if (error) {
      logger.error('Error fetching candidate counts', { error })
      return {}
    }

    const counts: Record<string, number> = {}
    for (const row of data || []) {
      const stages = row.stages as unknown as { stage_name: string }
      const stageName = stages?.stage_name
      if (stageName) {
        counts[stageName] = (counts[stageName] || 0) + 1
      }
    }

    return counts
  } catch (error) {
    logger.error('Unexpected error in getCandidateCountsByStage', { error })
    return {}
  }
}

function transformToCandidate(row: Record<string, unknown>): Candidate {
  const user = row.users as { user_id: string; email: string; fname: string; lname: string }
  const appStages = row.application_stages as Array<{
    app_stage_id: string
    stage_id: string
    started_at: string
    ended_at: string | null
    status: string
    notes: string
    updated_by: string | null
    stages: { stage_name: string; order_index: number }
  }> | undefined

  const sortedStages = [...(appStages || [])].sort(
    (a, b) => a.stages.order_index - b.stages.order_index
  )

  const activeStage = sortedStages.find(s => s.ended_at === null)
  const currentStageName = activeStage?.stages.stage_name || 'Unknown'
  const currentStageStatus = (activeStage?.status || 'inProgress') as CandidateStage['status']

  return {
    applicationId: row.application_id as string,
    userId: user.user_id,
    userName: `${user.fname} ${user.lname}`,
    userEmail: user.email,
    positionTitle: row.position_title as string,
    applicationDate: row.application_date as string,
    currentStage: currentStageName,
    currentStageStatus,
    outcome: (row.final_outcome as string) === 'pending' ? 'pending' : row.final_outcome as Candidate['outcome'],
    stages: sortedStages.map(s => ({
      id: s.app_stage_id,
      name: s.stages.stage_name,
      status: s.status as CandidateStage['status'],
      startedAt: s.started_at,
      endedAt: s.ended_at,
      notes: s.notes,
      updatedBy: s.updated_by,
    })),
  }
}
