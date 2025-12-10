'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateCompanyCaches } from '../utils/cache-utils'
import { CreateCompanySchema, type ActionState } from '../schemas'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'

type CreateCompanyResult = {
  companyId: string
}

export async function createCompanyAction(
  _prevState: ActionState<CreateCompanyResult>,
  formData: FormData
): Promise<ActionState<CreateCompanyResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to create a company')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to create companies')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    // Parse locations from JSON string
    const locationsRaw = formData.get('locations')
    const locations = locationsRaw ? JSON.parse(locationsRaw as string) : []

    const rawData = {
      name: formData.get('name'),
      website: formData.get('website') || undefined,
      locations,
      size: formData.get('size') || undefined,
      description: formData.get('description') || undefined,
      industry: formData.get('industry') || undefined,
    }

    const validation = CreateCompanySchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { name, website, size, description, industry } = validation.data
    const validatedLocations = validation.data.locations

    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        company_name: name,
        website: website || '',
        locations: validatedLocations,
        size: size || null,
        description: description || null,
        industry: industry || null,
        created_by: userId,
      })
      .select('company_id')
      .single()

    if (error) {
      logger.error('Failed to create company', { error })
      return databaseError(error, 'create company')
    }

    invalidateCompanyCaches()
    logger.info('Company created', { companyId: company.company_id, createdBy: userId })

    return {
      success: true,
      data: {
        companyId: company.company_id,
      },
    }
  } catch (error) {
    logger.error('Unexpected error in createCompanyAction', { error })
    return unexpectedError(error, 'createCompanyAction')
  }
}
