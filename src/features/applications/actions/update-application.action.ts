'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { invalidateApplicationById } from '@/lib/actions/cache-utils'
import {
  UpdateApplicationSchema,
  type ActionState,
} from '../schemas/application.schema'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
} from '@/lib/actions/error-utils'

/**
 * Update an existing job application
 *
 * Supports partial updates - only provided fields will be updated.
 * User can only update their own applications (RLS enforced).
 *
 * Revalidates both 'applications' and specific application cache tags.
 */
export async function updateApplicationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1. Authenticate
    const authContext = await requireAuth()
    if (!authContext) {
      return authError('You must be logged in to update an application')
    }
    const { userId, supabase } = authContext

    // 2. Extract and validate form data
    const rawData: Record<string, unknown> = {
      id: formData.get('id'),
    }

    // Only include fields that were provided
    const company = formData.get('company')
    const positionTitle = formData.get('positionTitle')
    const dateApplied = formData.get('dateApplied')
    const outcome = formData.get('outcome')
    const location = formData.get('location')
    const jobUrl = formData.get('jobUrl')

    if (company) rawData.company = company
    if (positionTitle) rawData.positionTitle = positionTitle
    if (dateApplied) rawData.dateApplied = dateApplied
    if (outcome) rawData.outcome = outcome
    if (location !== null) rawData.location = location
    if (jobUrl !== null) rawData.jobUrl = jobUrl

    const validation = UpdateApplicationSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error)
    }

    const { id, ...updateData } = validation.data

    // 3. Build update object (convert camelCase to snake_case)
    // Note: company is in companies table via jobs FK - not directly updatable here
    // location/jobUrl are stored in metadata JSONB column
    const dbUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updateData.positionTitle !== undefined) {
      dbUpdate.position_title = updateData.positionTitle
    }
    if (updateData.dateApplied !== undefined) {
      dbUpdate.application_date = updateData.dateApplied
    }
    if (updateData.outcome !== undefined) {
      dbUpdate.final_outcome = updateData.outcome
    }

    // Update metadata if location or jobUrl provided
    if (updateData.location !== undefined || updateData.jobUrl !== undefined) {
      // We need to merge with existing metadata, so fetch first
      const { data: existing } = await supabase
        .from('applications')
        .select('metadata')
        .eq('application_id', id)
        .eq('user_id', userId)
        .single()

      const currentMetadata = (existing?.metadata as Record<string, unknown>) || {}
      dbUpdate.metadata = {
        ...currentMetadata,
        ...(updateData.location !== undefined && { location: updateData.location }),
        ...(updateData.jobUrl !== undefined && { jobUrl: updateData.jobUrl }),
      }
    }

    // 4. Update in Supabase
    const { error } = await supabase
      .from('applications')
      .update(dbUpdate)
      .eq('application_id', id)
      .eq('user_id', userId) // Ownership check

    if (error) {
      return databaseError(error, 'update application')
    }

    // 5. Invalidate cache
    invalidateApplicationById(id)

    return {
      success: true,
    }
  } catch (error) {
    return unexpectedError(error, 'updateApplicationAction')
  }
}
