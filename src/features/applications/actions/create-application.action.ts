'use server'

import { auth } from '@/features/auth/auth'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateApplicationCaches } from '../utils/cache-utils'
import {
  CreateApplicationSchema,
  type ActionState,
} from '../schemas/application.schema'
import {
  validationError,
  authError,
  databaseError,
  notFoundError,
  unexpectedError,
} from '@/lib/actions/error-utils'
import { splitFullName } from '@/features/auth/utils'
import { logger } from '@/lib/logger'

type CreateApplicationResult = {
  applicationId: string
}

export async function createApplicationAction(
  _prevState: ActionState<CreateApplicationResult>,
  formData: FormData
): Promise<ActionState<CreateApplicationResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to create an application')
    }

    const userId = session.user.id

    const rawData = {
      jobId: formData.get('jobId'),
      applicationDate: formData.get('applicationDate') || undefined,
    }

    const validation = CreateApplicationSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error)
    }

    const { jobId, applicationDate } = validation.data
    const supabase = createUserClient(userId)

    // Ensure user exists in database (for OAuth users)
    const { fname, lname } = splitFullName(session.user.name, 'User', 'OAuth')
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        email: session.user.email || `${userId}@oauth.placeholder`,
        fname,
        lname,
        password_hash: 'oauth',
      }, { onConflict: 'user_id' })

    if (userError) {
      return databaseError(userError, 'sync user')
    }

    // Verify job exists and get its title
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('job_id, job_title, url, locations')
      .eq('job_id', jobId)
      .eq('is_active', true)
      .single()

    if (jobError || !job) {
      logger.warn('Job not found or inactive', { jobId, error: jobError })
      return notFoundError('Job')
    }

    // Check if user already applied to this job
    const { data: existingApp } = await supabase
      .from('applications')
      .select('application_id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .maybeSingle()

    if (existingApp) {
      return {
        success: false,
        error: 'You have already applied to this job',
      }
    }

    // Create the application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        position_title: job.job_title,
        application_date: applicationDate || new Date().toISOString().split('T')[0],
        metadata: {
          jobUrl: job.url || '',
          location: job.locations?.[0] || '',
        },
      })
      .select('application_id')
      .single()

    if (appError) {
      logger.error('Failed to create application', { error: appError, jobId, userId })
      return databaseError(appError, 'create application')
    }

    invalidateApplicationCaches()
    logger.info('Application created', { applicationId: application.application_id, jobId, userId })

    return {
      success: true,
      data: {
        applicationId: application.application_id,
      },
    }
  } catch (error) {
    logger.error('Unexpected error in createApplicationAction', { error })
    return unexpectedError(error, 'createApplicationAction')
  }
}
