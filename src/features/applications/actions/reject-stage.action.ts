'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication, verifyApplicationOwnership } from '../utils/supabase-utils'
import { authError, notFoundError, databaseError } from '@/lib/actions/error-utils'
import { invalidateApplicationById } from '../utils/cache-utils'
import type { ActionState, StageStatus } from '../schemas/application.schema'
import { updateFinalOutcome } from '../services/stage-operations'

export async function rejectStageAction(
  applicationId: string,
  stageId: string
): Promise<ActionState> {
  const authContext = await requireAuth()
  if (!authContext) {
    return authError()
  }
  const { userId, supabase } = authContext

  const isOwner = await verifyApplicationOwnership(supabase, applicationId, userId)
  if (!isOwner) {
    return notFoundError('Application')
  }

  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('application_stages')
    .update({
      status: 'rejected' as StageStatus,
      ended_at: now,
    })
    .eq('app_stage_id', stageId)
    .eq('application_id', applicationId)

  if (updateError) {
    return databaseError(updateError, 'reject stage')
  }

  await updateFinalOutcome(supabase, applicationId, 'rejected')

  await touchApplication(supabase, applicationId)
  invalidateApplicationById(applicationId)

  return { success: true }
}
