'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateCompanyCaches } from '../utils/cache-utils'
import { UpdateCompanySchema, type ActionState } from '../schemas'
import {
  validationError,
  authError,
  databaseError,
  notFoundError,
  unexpectedError,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'

type UpdateCompanyResult = {
  companyId: string
}

export async function updateCompanyAction(
  _prevState: ActionState<UpdateCompanyResult>,
  formData: FormData
): Promise<ActionState<UpdateCompanyResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to update a company')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to update companies')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    // Parse locations from JSON string if provided
    const locationsRaw = formData.get('locations')
    const locations = locationsRaw ? JSON.parse(locationsRaw as string) : undefined

    const rawData = {
      companyId: formData.get('companyId'),
      name: formData.get('name') || undefined,
      website: formData.get('website') || undefined,
      locations,
      size: formData.get('size') || undefined,
      description: formData.get('description') || undefined,
      industry: formData.get('industry') || undefined,
    }

    const validation = UpdateCompanySchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { companyId, name, website, size, description, industry } = validation.data
    const validatedLocations = validation.data.locations

    // Verify company exists
    const { data: existing, error: fetchError } = await supabase
      .from('companies')
      .select('company_id')
      .eq('company_id', companyId)
      .single()

    if (fetchError || !existing) {
      return notFoundError('Company')
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.company_name = name
    if (website !== undefined) updateData.website = website || ''
    if (validatedLocations !== undefined) updateData.locations = validatedLocations
    if (size !== undefined) updateData.size = size
    if (description !== undefined) updateData.description = description
    if (industry !== undefined) updateData.industry = industry

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No fields to update' }
    }

    const { error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('company_id', companyId)

    if (updateError) {
      logger.error('Failed to update company', { error: updateError, companyId })
      return databaseError(updateError, 'update company')
    }

    invalidateCompanyCaches()
    logger.info('Company updated', { companyId, updatedBy: userId })

    return {
      success: true,
      data: {
        companyId,
      },
    }
  } catch (error) {
    logger.error('Unexpected error in updateCompanyAction', { error })
    return unexpectedError(error, 'updateCompanyAction')
  }
}
