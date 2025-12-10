'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateJobCaches, invalidateCompanyCaches } from '@/lib/actions/cache-utils'
import { JobPostingSchema } from '../schemas/job-posting.schema'
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

/**
 * Create a new job posting
 * Only recruiters, admins, and techno_warlords can post jobs
 */
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

    const locationsRaw = formData.get('locations')
    let locations: string[] = []

    if (typeof locationsRaw === 'string') {
      // Try to parse as JSON array, fallback to comma-separated
      try {
        locations = JSON.parse(locationsRaw)
      } catch {
        locations = locationsRaw.split(',').map(s => s.trim()).filter(Boolean)
      }
    }

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

    let resolvedCompanyId = companyId

    if (!resolvedCompanyId && companyName) {
      // Check if company already exists (case-insensitive)
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('company_id')
        .ilike('company_name', companyName)
        .maybeSingle()

      if (existingCompany) {
        resolvedCompanyId = existingCompany.company_id
      } else {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            company_name: companyName,
            website: '',
            locations: validatedLocations,
          })
          .select('company_id')
          .single()

        if (companyError) {
          logger.error('Failed to create company', { error: companyError })
          return databaseError(companyError, 'create company')
        }

        resolvedCompanyId = newCompany.company_id
        invalidateCompanyCaches()
      }
    }

    if (!resolvedCompanyId) {
      return {
        success: false,
        error: 'Could not resolve company. Please select or enter a company name.',
      }
    }

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
