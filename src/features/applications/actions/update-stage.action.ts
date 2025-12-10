'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication, verifyApplicationOwnership } from '../utils/supabase-utils'
import { authError, notFoundError, databaseError, unexpectedError } from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { invalidateApplicationById } from '../utils/cache-utils'
import {
  UpdateStageSchema,
  type ActionState,
  type StageStatus,
} from '../schemas/application.schema'
import { STAGE_NAMES } from '../config'

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
      return {
        success: false,
        error: 'Invalid stage update data',
        fieldErrors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      }
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
      const { error: outcomeError } = await supabase
        .from('applications')
        .update({ final_outcome: 'rejected' })
        .eq('application_id', applicationId)

      if (outcomeError) {
        logger.error('Failed to update final_outcome', { error: outcomeError, applicationId })
      }
    }

    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)

    return {
      success: true,
    }
  } catch (error) {
    return unexpectedError(error, 'updateStageAction')
  }
}

export async function advanceStageAction(
  applicationId: string,
  currentAppStageId: string
): Promise<ActionState> {
  const authContext = await requireAuth()
  if (!authContext) {
    return authError()
  }
  const { supabase } = authContext

  const { data: currentAppStage, error: currentError } = await supabase
    .from('application_stages')
    .select(`
      app_stage_id,
      stage_id,
      stages!inner (
        stage_id,
        stage_name,
        order_index,
        success_flag
      )
    `)
    .eq('app_stage_id', currentAppStageId)
    .eq('application_id', applicationId)
    .single()

  if (currentError || !currentAppStage) {
    return { success: false, error: 'Current stage not found' }
  }

  const stageInfo = currentAppStage.stages as unknown as {
    stage_id: string
    stage_name: string
    order_index: number
    success_flag: string
  }

  const now = new Date().toISOString()
  const { error: updateCurrentError } = await supabase
    .from('application_stages')
    .update({
      status: 'successful' as StageStatus,
      ended_at: now,
    })
    .eq('app_stage_id', currentAppStageId)

  if (updateCurrentError) {
    return { success: false, error: 'Failed to complete current stage' }
  }

  // Terminal success stage (e.g., Offer) - set final_outcome and done
  if (stageInfo.success_flag === 'true') {
    const { error: outcomeError } = await supabase
      .from('applications')
      .update({ final_outcome: 'offer' })
      .eq('application_id', applicationId)

    if (outcomeError) {
      logger.error('Failed to update final_outcome to offer', { error: outcomeError, applicationId })
    }

    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)

    return { success: true }
  }

  const { data: nextStage, error: nextStageError } = await supabase
    .from('stages')
    .select('stage_id, stage_name, order_index, success_flag')
    .gt('order_index', stageInfo.order_index)
    .neq('stage_name', STAGE_NAMES.REJECTED)
    .neq('stage_name', STAGE_NAMES.WITHDRAWN)
    .order('order_index', { ascending: true })
    .limit(1)
    .single()

  if (nextStageError || !nextStage) {
    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)
    return { success: true }
  }

  const { data: existingStage } = await supabase
    .from('application_stages')
    .select('app_stage_id')
    .eq('application_id', applicationId)
    .eq('stage_id', nextStage.stage_id)
    .maybeSingle()

  if (existingStage) {
    await supabase
      .from('application_stages')
      .update({
        status: 'inProgress' as StageStatus,
        started_at: now,
      })
      .eq('app_stage_id', existingStage.app_stage_id)
  } else {
    const { error: insertError } = await supabase
      .from('application_stages')
      .insert({
        application_id: applicationId,
        stage_id: nextStage.stage_id,
        status: 'inProgress' as StageStatus,
        started_at: now,
        notes: '',
      })

    if (insertError) {
      logger.error('Failed to insert next stage', { error: insertError, applicationId, stageId: nextStage.stage_id })
      return { success: false, error: 'Failed to create next stage' }
    }
  }

  await touchApplication(supabase, applicationId)
  invalidateApplicationById(applicationId)

  return { success: true }
}

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

  const { data: activeStage } = await supabase
    .from('application_stages')
    .select('app_stage_id')
    .eq('application_id', applicationId)
    .eq('status', 'inProgress')
    .maybeSingle()

  if (activeStage) {
    await supabase
      .from('application_stages')
      .update({
        status: 'successful' as StageStatus,
        ended_at: now,
      })
      .eq('app_stage_id', activeStage.app_stage_id)
  }

  const { data: withdrawnStage, error: stageError } = await supabase
    .from('stages')
    .select('stage_id')
    .eq('stage_name', STAGE_NAMES.WITHDRAWN)
    .single()

  if (stageError || !withdrawnStage) {
    return { success: false, error: 'Withdrawn stage not found in database' }
  }

  const { error: insertError } = await supabase
    .from('application_stages')
    .insert({
      application_id: applicationId,
      stage_id: withdrawnStage.stage_id,
      status: 'successful' as StageStatus,
      started_at: now,
      ended_at: now,
      notes: '',
    })

  if (insertError) {
    logger.error('Failed to insert Withdrawn stage', { error: insertError, applicationId })
    return { success: false, error: 'Failed to record withdrawal' }
  }

  const { error: outcomeError } = await supabase
    .from('applications')
    .update({ final_outcome: 'withdrawn' })
    .eq('application_id', applicationId)

  if (outcomeError) {
    logger.error('Failed to update final_outcome', { error: outcomeError, applicationId })
  }

  await touchApplication(supabase, applicationId)
  invalidateApplicationById(applicationId)

  return { success: true }
}
