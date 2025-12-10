'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication, verifyApplicationOwnership } from '../utils/supabase-utils'
import { authError, notFoundError, databaseError, unexpectedError, validationError } from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { invalidateApplicationById } from '../utils/cache-utils'
import {
  UpdateStageSchema,
  type ActionState,
} from '../schemas/application.schema'
import { updateFinalOutcome } from '../services/stage-operations'

export async function updateStageAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const authContext = await requireAuth()
    if (!authContext) {
      return authError('You must be logged in to update a stage')
    }
    const { userId, supabase } = authContext

    const rawData = {
      applicationId: formData.get('applicationId'),
      stageId: formData.get('stageId'),
      status: formData.get('status'),
      completedAt: formData.get('completedAt') || undefined,
    }

    const validation = UpdateStageSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error, 'Invalid stage update data')
    }

    const { applicationId, stageId, status, completedAt } = validation.data

    const isOwner = await verifyApplicationOwnership(supabase, applicationId, userId)
    if (!isOwner) {
      return notFoundError('Application')
    }

    const dbUpdate: Record<string, unknown> = {}

    if (status) {
      dbUpdate.status = status
      if (status === 'successful' || status === 'rejected') {
        dbUpdate.ended_at = completedAt || new Date().toISOString()
      }
    }

    if (completedAt) {
      dbUpdate.ended_at = completedAt
    }

    const { error: updateError } = await supabase
      .from('application_stages')
      .update(dbUpdate)
      .eq('app_stage_id', stageId)
      .eq('application_id', applicationId)

    if (updateError) {
      return databaseError(updateError, 'update stage')
    }

    if (status === 'rejected') {
      await updateFinalOutcome(supabase, applicationId, 'rejected')
    }

    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in updateStageAction', { error })
    return unexpectedError(error, 'updateStageAction')
  }
}
