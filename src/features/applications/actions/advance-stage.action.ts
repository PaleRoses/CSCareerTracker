'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication } from '../utils/supabase-utils'
import { authError } from '@/lib/actions/error-utils'
import { invalidateApplicationById } from '../utils/cache-utils'
import type { ActionState } from '../schemas/application.schema'
import {
  getCurrentStageInfo,
  completeStage,
  updateFinalOutcome,
  getNextStage,
  upsertStageEntry,
} from '../services/stage-operations'

export async function advanceStageAction(
  applicationId: string,
  currentAppStageId: string
): Promise<ActionState> {
  const authContext = await requireAuth()
  if (!authContext) {
    return authError()
  }
  const { supabase } = authContext

  const stageInfo = await getCurrentStageInfo(supabase, currentAppStageId, applicationId)
  if (!stageInfo) {
    return { success: false, error: 'Current stage not found' }
  }

  const completeResult = await completeStage(supabase, {
    appStageId: currentAppStageId,
    applicationId,
    status: 'successful',
  })

  if (!completeResult.success) {
    return { success: false, error: 'Failed to complete current stage' }
  }

  if (stageInfo.successFlag) {
    await updateFinalOutcome(supabase, applicationId, 'offer')
    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)
    return { success: true }
  }

  const nextStage = await getNextStage(supabase, stageInfo.orderIndex)
  if (!nextStage) {
    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)
    return { success: true }
  }

  const upsertResult = await upsertStageEntry(supabase, {
    applicationId,
    stageId: nextStage.stageId,
    status: 'inProgress',
  })

  if (!upsertResult.success) {
    return { success: false, error: 'Failed to create next stage' }
  }

  await touchApplication(supabase, applicationId)
  invalidateApplicationById(applicationId)

  return { success: true }
}
