'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient, createCacheClient } from '@/lib/supabase/server'
import { invalidateJobCaches } from '../utils/cache-utils'
import { logger } from '@/lib/logger'
import {
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'

type RemoveJobResult = {
  action: 'archived' | 'deleted'
}

/**
 * Remove a job from the system.
 *
 * Smart removal logic:
 * - If job has applications: soft delete (archive) - sets is_active = false
 * - If job has no applications: hard delete - removes from database
 *
 * Only privileged roles (admin, recruiter, techno_warlord) can perform this action.
 * RLS policies enforce this at the database level.
 */
export async function removeJobAction(
  _prevState: ActionState<RemoveJobResult> | undefined,
  formData: FormData
): Promise<ActionState<RemoveJobResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to remove jobs')
    }

    const jobId = formData.get('jobId') as string
    if (!jobId) {
      return { success: false, error: 'Job ID is required' }
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)
    const cacheClient = createCacheClient()
    const { count, error: countError } = await cacheClient
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', jobId)

    if (countError) {
      logger.error('Failed to count applications for job', { error: countError, jobId })
      return databaseError(countError, 'check job applications')
    }

    const hasApplications = (count ?? 0) > 0

    if (hasApplications) {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ is_active: false })
        .eq('job_id', jobId)

      if (updateError) {
        logger.error('Failed to archive job', { error: updateError, jobId })
        return databaseError(updateError, 'archive job')
      }

      invalidateJobCaches()
      logger.info('Job archived (soft delete)', { jobId, applicationCount: count })

      return { success: true, data: { action: 'archived' } }
    } else {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('job_id', jobId)

      if (deleteError) {
        logger.error('Failed to delete job', { error: deleteError, jobId })
        return databaseError(deleteError, 'delete job')
      }

      invalidateJobCaches()
      logger.info('Job deleted (hard delete)', { jobId })

      return { success: true, data: { action: 'deleted' } }
    }
  } catch (error) {
    logger.error('Unexpected error in removeJobAction', { error })
    return unexpectedError(error, 'removeJobAction')
  }
}
