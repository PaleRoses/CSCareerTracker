'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateJobCaches, parseLocationsFromFormData } from '@/features/jobs/utils'
import { resolveCompany } from '@/features/companies/utils'
import { JobPostingSchema } from '@/features/jobs/schemas'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'

type CreateJobResult = {
  jobId: string
}

export async function createJobAction(
  _prevState: ActionState<CreateJobResult>,
  formData: FormData
): Promise<ActionState<CreateJobResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to post a job')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to post jobs')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const locations = parseLocationsFromFormData(formData)

    const rawData = {
      companyId: formData.get('companyId') || undefined,
      companyName: formData.get('companyName') || undefined,
      title: formData.get('title'),
      type: formData.get('type'),
      locations,
      url: formData.get('url') || undefined,
    }

    const validation = JobPostingSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error)
    }

    const { companyId, companyName, title, type, url } = validation.data
    const validatedLocations = validation.data.locations

    const companyResult = await resolveCompany(supabase, {
      companyId,
      companyName,
      locations: validatedLocations,
    })
    if (!companyResult.success) {
      return { success: false, error: companyResult.error }
    }
    const resolvedCompanyId = companyResult.companyId

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        company_id: resolvedCompanyId,
        job_title: title,
        job_type: type,
        locations: validatedLocations,
        url: url || null,
        posted_by: userId,
      })
      .select('job_id')
      .single()

    if (jobError) {
      logger.error('Failed to create job', { error: jobError })
      return databaseError(jobError, 'create job')
    }

    invalidateJobCaches()
    logger.info('Job created successfully', { jobId: job.job_id, postedBy: userId })

    return {
      success: true,
      data: {
        jobId: job.job_id,
      },
    }
  } catch (error) {
    logger.error('Unexpected error in createJobAction', { error })
    return unexpectedError(error, 'createJobAction')
  }
}
