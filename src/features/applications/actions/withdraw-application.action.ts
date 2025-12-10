'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication, verifyApplicationOwnership } from '../utils/supabase-utils'
import { authError, notFoundError } from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { invalidateApplicationById } from '../utils/cache-utils'
import type { ActionState, StageStatus } from '../schemas/application.schema'
import { STAGE_NAMES } from '../config'
import {
  closeActiveStage,
  getStageByName,
  createStageEntry,
  updateFinalOutcome,
} from '../services/stage-operations'

export async function withdrawApplicationAction(
  applicationId: string
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

  await closeActiveStage(supabase, applicationId)

  const withdrawnStage = await getStageByName(supabase, STAGE_NAMES.WITHDRAWN)
  if (!withdrawnStage) {
    return { success: false, error: 'Withdrawn stage not found in database' }
  }

  const createResult = await createStageEntry(supabase, {
    applicationId,
    stageId: withdrawnStage.stageId,
    status: 'successful' as StageStatus,
    startedAt: now,
    endedAt: now,
  })

  if (!createResult.success) {
    logger.error('Failed to insert Withdrawn stage', { applicationId })
    return { success: false, error: 'Failed to record withdrawal' }
  }

  await updateFinalOutcome(supabase, applicationId, 'withdrawn')

  await touchApplication(supabase, applicationId)
  invalidateApplicationById(applicationId)

  return { success: true }
}
