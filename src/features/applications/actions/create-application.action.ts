'use server'

import { auth } from '@/features/auth/auth'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateApplicationCaches } from '../utils/cache-utils'
import { resolveCompany } from '@/features/companies/utils'
import {
  CreateApplicationSchema,
  type ActionState,
} from '../schemas/application.schema'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
} from '@/lib/actions/error-utils'

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
      companyId: formData.get('companyId') || undefined,
      companyName: formData.get('companyName') || undefined,
      positionTitle: formData.get('positionTitle'),
      applicationDate: formData.get('applicationDate'),
      location: formData.get('location') || undefined,
      jobUrl: formData.get('jobUrl') || undefined,
    }

    const validation = CreateApplicationSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error)
    }

    const { companyId, companyName, positionTitle, applicationDate, location, jobUrl } =
      validation.data

    const supabase = createUserClient(userId)

    // Ensure user exists (NextAuth users aren't auto-synced to Supabase)
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        email: session.user.email || `${userId}@oauth.placeholder`,
        fname: session.user.name?.split(' ')[0] || 'User',
        lname: session.user.name?.split(' ').slice(1).join(' ') || 'OAuth',
        password_hash: 'oauth', // Placeholder for OAuth users
      }, { onConflict: 'user_id' })

    if (userError) {
      return databaseError(userError, 'sync user')
    }

    // Resolve or create company
    const companyResult = await resolveCompany(supabase, { companyId, companyName })
    if (!companyResult.success) {
      return { success: false, error: companyResult.error }
    }
    const resolvedCompanyId = companyResult.companyId

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        company_id: resolvedCompanyId,
        job_title: positionTitle,
        url: jobUrl || null,
        locations: location ? [location] : [],
      })
      .select('job_id')
      .single()

    if (jobError) {
      return databaseError(jobError, 'create job')
    }

    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_id: job.job_id,
        position_title: positionTitle,
        application_date: applicationDate,
        metadata: {
          jobUrl: jobUrl || '',
          location: location || '',
        },
      })
      .select('application_id')
      .single()

    if (appError) {
      return databaseError(appError, 'create application')
    }

    // Initial "Applied" stage is auto-created by DB trigger
    invalidateApplicationCaches()

    return {
      success: true,
      data: {
        applicationId: application.application_id,
      },
    }
  } catch (error) {
    return unexpectedError(error, 'createApplicationAction')
  }
}
