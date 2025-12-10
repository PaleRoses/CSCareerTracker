'use server'

import { auth } from '@/features/auth/auth'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateApplicationCaches, invalidateCompanyCaches } from '@/lib/actions/cache-utils'
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

    let resolvedCompanyId = companyId

    if (!resolvedCompanyId && companyName) {
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
            website: '', // Could be added to form later
          })
          .select('company_id')
          .single()

        if (companyError) {
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
