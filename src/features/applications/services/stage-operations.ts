import type { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import type { StageStatus, Outcome } from '../schemas/application.schema'
import { STAGE_NAMES } from '../config'

export type StageOperationResult =
  | { success: true; stageId?: string }
  | { success: false; error: string }

export interface StageInfo {
  stageId: string
  stageName: string
  orderIndex: number
  successFlag: boolean
}

export async function completeStage(
  supabase: SupabaseClient,
  options: {
    appStageId: string
    applicationId: string
    status: 'successful' | 'rejected'
    endedAt?: string
    updatedBy?: string
  }
): Promise<StageOperationResult> {
  const { appStageId, applicationId, status, endedAt, updatedBy } = options
  const timestamp = endedAt || new Date().toISOString()

  const updateData: Record<string, unknown> = {
    status,
    ended_at: timestamp,
  }

  if (updatedBy) {
    updateData.updated_by = updatedBy
  }

  const { error } = await supabase
    .from('application_stages')
    .update(updateData)
    .eq('app_stage_id', appStageId)
    .eq('application_id', applicationId)

  if (error) {
    logger.error('Failed to complete stage', { error, appStageId, applicationId })
    return { success: false, error: `Failed to complete stage: ${error.message}` }
  }

  return { success: true }
}

export async function createStageEntry(
  supabase: SupabaseClient,
  options: {
    applicationId: string
    stageId: string
    status: StageStatus
    startedAt?: string
    endedAt?: string
    notes?: string
    updatedBy?: string
  }
): Promise<StageOperationResult> {
  const {
    applicationId,
    stageId,
    status,
    startedAt,
    endedAt,
    notes = '',
    updatedBy,
  } = options

  const insertData: Record<string, unknown> = {
    application_id: applicationId,
    stage_id: stageId,
    status,
    started_at: startedAt || new Date().toISOString(),
    notes,
  }

  if (endedAt) {
    insertData.ended_at = endedAt
  }

  if (updatedBy) {
    insertData.updated_by = updatedBy
  }

  const { data, error } = await supabase
    .from('application_stages')
    .insert(insertData)
    .select('app_stage_id')
    .single()

  if (error) {
    logger.error('Failed to create stage entry', { error, applicationId, stageId })
    return { success: false, error: `Failed to create stage: ${error.message}` }
  }

  return { success: true, stageId: data.app_stage_id }
}

export async function upsertStageEntry(
  supabase: SupabaseClient,
  options: {
    applicationId: string
    stageId: string
    status: StageStatus
    startedAt?: string
  }
): Promise<StageOperationResult> {
  const { applicationId, stageId, status, startedAt } = options
  const timestamp = startedAt || new Date().toISOString()

  const { data: existingStage } = await supabase
    .from('application_stages')
    .select('app_stage_id')
    .eq('application_id', applicationId)
    .eq('stage_id', stageId)
    .maybeSingle()

  if (existingStage) {
    const { error } = await supabase
      .from('application_stages')
      .update({
        status,
        started_at: timestamp,
      })
      .eq('app_stage_id', existingStage.app_stage_id)

    if (error) {
      logger.error('Failed to update existing stage', { error, applicationId, stageId })
      return { success: false, error: `Failed to update stage: ${error.message}` }
    }

    return { success: true, stageId: existingStage.app_stage_id }
  }

  return createStageEntry(supabase, {
    applicationId,
    stageId,
    status,
    startedAt: timestamp,
  })
}

export async function updateFinalOutcome(
  supabase: SupabaseClient,
  applicationId: string,
  outcome: Outcome
): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .update({ final_outcome: outcome })
    .eq('application_id', applicationId)

  if (error) {
    logger.error('Failed to update final_outcome', { error, applicationId, outcome })
  }
}

export async function getNextStage(
  supabase: SupabaseClient,
  currentOrderIndex: number,
  excludeStages: string[] = [STAGE_NAMES.REJECTED, STAGE_NAMES.WITHDRAWN]
): Promise<StageInfo | null> {
  let query = supabase
    .from('stages')
    .select('stage_id, stage_name, order_index, success_flag')
    .gt('order_index', currentOrderIndex)
    .order('order_index', { ascending: true })
    .limit(1)

  for (const stageName of excludeStages) {
    query = query.neq('stage_name', stageName)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return null
  }

  return {
    stageId: data.stage_id,
    stageName: data.stage_name,
    orderIndex: data.order_index,
    successFlag: data.success_flag === 'true',
  }
}

export async function getStageByName(
  supabase: SupabaseClient,
  stageName: string
): Promise<{ stageId: string } | null> {
  const { data, error } = await supabase
    .from('stages')
    .select('stage_id')
    .eq('stage_name', stageName)
    .single()

  if (error || !data) {
    return null
  }

  return { stageId: data.stage_id }
}

export async function getCurrentStageInfo(
  supabase: SupabaseClient,
  appStageId: string,
  applicationId: string
): Promise<StageInfo | null> {
  const { data, error } = await supabase
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
    .eq('app_stage_id', appStageId)
    .eq('application_id', applicationId)
    .single()

  if (error || !data) {
    return null
  }

  const stageInfo = data.stages as unknown as {
    stage_id: string
    stage_name: string
    order_index: number
    success_flag: string
  }

  return {
    stageId: stageInfo.stage_id,
    stageName: stageInfo.stage_name,
    orderIndex: stageInfo.order_index,
    successFlag: stageInfo.success_flag === 'true',
  }
}

export async function closeActiveStage(
  supabase: SupabaseClient,
  applicationId: string,
  updatedBy?: string
): Promise<StageOperationResult> {
  const { data: activeStage } = await supabase
    .from('application_stages')
    .select('app_stage_id')
    .eq('application_id', applicationId)
    .eq('status', 'inProgress')
    .maybeSingle()

  if (!activeStage) {
    return { success: true } // No active stage to close
  }

  return completeStage(supabase, {
    appStageId: activeStage.app_stage_id,
    applicationId,
    status: 'successful',
    updatedBy,
  })
}
