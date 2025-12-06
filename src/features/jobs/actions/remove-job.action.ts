'use server'

import { auth } from '@/features/auth/auth'
import { createUserClient, createCacheClient } from '@/lib/supabase/server'
import { invalidateJobCaches } from '@/lib/actions/cache-utils'
import { logger } from '@/lib/logger'

type RemoveJobResult = {
  success: boolean
  action?: 'archived' | 'deleted'
  error?: string
}

const ADMIN_ROLES = ['admin', 'recruiter', 'techno_warlord'] as const

/**
 * Remove a job from the system.
 *
 * Smart removal logic:
 * - If job has applications: soft delete (archive) - sets is_active = false
 * - If job has no applications: hard delete - removes from database
 *
 * Only admin, recruiter, and techno_warlord roles can perform this action.
 * RLS policies enforce this at the database level.
 */
export async function removeJob(jobId: string): Promise<RemoveJobResult> {
  try {
    // 1. Authenticate and check role
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in' }
    }

    const userRole = session.user.role
    if (!userRole || !ADMIN_ROLES.includes(userRole as typeof ADMIN_ROLES[number])) {
      return { success: false, error: 'You do not have permission to remove jobs' }
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    // 2. Check if job has any applications
    const cacheClient = createCacheClient()
    const { count, error: countError } = await cacheClient
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', jobId)

    if (countError) {
      logger.error('Failed to count applications for job', { error: countError, jobId })
      return { success: false, error: 'Failed to check job applications' }
    }

    const hasApplications = (count ?? 0) > 0

    if (hasApplications) {
      // 3a. Soft delete - job has applications, preserve referential integrity
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ is_active: false })
        .eq('job_id', jobId)

      if (updateError) {
        logger.error('Failed to archive job', { error: updateError, jobId })
        return { success: false, error: updateError.message }
      }

      invalidateJobCaches()
      logger.info('Job archived (soft delete)', { jobId, applicationCount: count })

      return { success: true, action: 'archived' }
    } else {
      // 3b. Hard delete - no applications, safe to remove completely
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('job_id', jobId)

      if (deleteError) {
        logger.error('Failed to delete job', { error: deleteError, jobId })
        return { success: false, error: deleteError.message }
      }

      invalidateJobCaches()
      logger.info('Job deleted (hard delete)', { jobId })

      return { success: true, action: 'deleted' }
    }
  } catch (error) {
    logger.error('Unexpected error in removeJob', { error, jobId })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
