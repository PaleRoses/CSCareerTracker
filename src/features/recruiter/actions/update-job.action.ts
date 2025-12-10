'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateJobCaches } from '@/features/jobs/utils/cache-utils'
import { UpdateJobPostingSchema } from '@/features/jobs/schemas'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'

type UpdateJobResult = {
  jobId: string
}

/**
 * Update an existing job posting
 * Only the recruiter who posted the job can update it
 */
export async function updateJobAction(
  _prevState: ActionState<UpdateJobResult>,
  formData: FormData
): Promise<ActionState<UpdateJobResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to update a job')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to update jobs')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const locationsRaw = formData.get('locations')
    let locations: string[] | undefined

    if (typeof locationsRaw === 'string' && locationsRaw.length > 0) {
      try {
        locations = JSON.parse(locationsRaw)
      } catch {
        locations = locationsRaw.split(',').map(s => s.trim()).filter(Boolean)
      }
    }

    const rawData = {
      jobId: formData.get('jobId'),
      title: formData.get('title') || undefined,
      type: formData.get('type') || undefined,
      locations,
      url: formData.get('url') || undefined,
      isActive: formData.get('isActive') === 'true' ? true :
                formData.get('isActive') === 'false' ? false : undefined,
    }

    const validation = UpdateJobPostingSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error)
    }

    const { jobId, title, type, url, isActive } = validation.data
    const validatedLocations = validation.data.locations

    const { data: existingJob, error: fetchError } = await supabase
      .from('jobs')
      .select('job_id, posted_by')
      .eq('job_id', jobId)
      .single()

    if (fetchError || !existingJob) {
      logger.warn('Job not found for update', { jobId, userId })
      return {
        success: false,
        error: 'Job not found',
      }
    }

    if (existingJob.posted_by !== userId) {
      logger.warn('User attempted to update job they do not own', {
        jobId,
        userId,
        ownerId: existingJob.posted_by
      })
      return authError('You can only update jobs you have posted')
    }

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.job_title = title
    if (type !== undefined) updateData.job_type = type
    if (validatedLocations !== undefined) updateData.locations = validatedLocations
    if (url !== undefined) updateData.url = url || null
    if (isActive !== undefined) updateData.is_active = isActive

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: 'No changes to save',
      }
    }

    const { error: updateError } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('job_id', jobId)

    if (updateError) {
      logger.error('Failed to update job', { error: updateError, jobId })
      return databaseError(updateError, 'update job')
    }

    invalidateJobCaches()
    logger.info('Job updated successfully', { jobId, updatedBy: userId })

    return {
      success: true,
      data: {
        jobId,
      },
    }
  } catch (error) {
    logger.error('Unexpected error in updateJobAction', { error })
    return unexpectedError(error, 'updateJobAction')
  }
}
