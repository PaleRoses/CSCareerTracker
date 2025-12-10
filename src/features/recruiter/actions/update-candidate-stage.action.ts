'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import {
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'

type UpdateStageResult = {
  stageId: string
}

interface _UpdateCandidateStageInput {
  applicationId: string
  stageId: string  // Current stage to update
  newStatus: 'successful' | 'rejected'
  notes?: string
}

interface _AdvanceCandidateInput {
  applicationId: string
  nextStageName: string
  notes?: string
}

/**
 * Update a candidate's current stage status (mark as successful or rejected)
 */
export async function updateCandidateStageAction(
  _prevState: ActionState<UpdateStageResult>,
  formData: FormData
): Promise<ActionState<UpdateStageResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to update candidate stages')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const applicationId = formData.get('applicationId') as string
    const stageId = formData.get('stageId') as string
    const newStatus = formData.get('newStatus') as 'successful' | 'rejected'
    const notes = formData.get('notes') as string | null

    if (!applicationId || !stageId || !newStatus) {
      return {
        success: false,
        error: 'Missing required fields',
      }
    }

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        application_id,
        jobs!inner (
          posted_by
        )
      `)
      .eq('application_id', applicationId)
      .single()

    if (appError || !application) {
      return { success: false, error: 'Application not found' }
    }

    const jobs = application.jobs as unknown as { posted_by: string | null }
    const postedBy = jobs?.posted_by
    if (postedBy !== userId) {
      return authError('You do not have permission to update this candidate')
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
      ended_at: new Date().toISOString(),
      updated_by: userId,
    }

    if (notes) {
      updateData.notes = notes
    }

    const { error: updateError } = await supabase
      .from('application_stages')
      .update(updateData)
      .eq('app_stage_id', stageId)

    if (updateError) {
      logger.error('Failed to update stage', { error: updateError })
      return databaseError(updateError, 'update stage')
    }

    if (newStatus === 'rejected') {
      const { error: outcomeError } = await supabase
        .from('applications')
        .update({ final_outcome: 'rejected' })
        .eq('application_id', applicationId)

      if (outcomeError) {
        logger.error('Failed to update application outcome', { error: outcomeError })
      }
    }

    revalidatePath('/jobs/[id]/candidates', 'page')
    revalidatePath('/candidates', 'page')

    return {
      success: true,
      data: { stageId },
    }
  } catch (error) {
    logger.error('Unexpected error in updateCandidateStageAction', { error })
    return unexpectedError(error, 'updateCandidateStageAction')
  }
}

/**
 * Advance a candidate to the next stage
 */
export async function advanceCandidateAction(
  _prevState: ActionState<UpdateStageResult>,
  formData: FormData
): Promise<ActionState<UpdateStageResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to advance candidates')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const applicationId = formData.get('applicationId') as string
    const nextStageName = formData.get('nextStageName') as string
    const notes = formData.get('notes') as string | null

    if (!applicationId || !nextStageName) {
      return {
        success: false,
        error: 'Missing required fields',
      }
    }

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        application_id,
        jobs!inner (
          posted_by
        )
      `)
      .eq('application_id', applicationId)
      .single()

    if (appError || !application) {
      return { success: false, error: 'Application not found' }
    }

    const jobs = application.jobs as unknown as { posted_by: string | null }
    const postedBy = jobs?.posted_by
    if (postedBy !== userId) {
      return authError('You do not have permission to advance this candidate')
    }

    const { data: nextStage, error: stageError } = await supabase
      .from('stages')
      .select('stage_id')
      .eq('stage_name', nextStageName)
      .single()

    if (stageError || !nextStage) {
      return { success: false, error: 'Stage not found' }
    }

    const { error: closeError } = await supabase
      .from('application_stages')
      .update({
        status: 'successful',
        ended_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('application_id', applicationId)
      .is('ended_at', null)

    if (closeError) {
      logger.error('Failed to close current stage', { error: closeError })
      return databaseError(closeError, 'close current stage')
    }

    const { data: newStageEntry, error: createError } = await supabase
      .from('application_stages')
      .insert({
        application_id: applicationId,
        stage_id: nextStage.stage_id,
        started_at: new Date().toISOString(),
        status: 'inProgress',
        notes: notes || '',
        updated_by: userId,
      })
      .select('app_stage_id')
      .single()

    if (createError) {
      logger.error('Failed to create new stage', { error: createError })
      return databaseError(createError, 'create new stage')
    }

    if (nextStageName === 'Offer') {
      const { error: offerError } = await supabase
        .from('applications')
        .update({ final_outcome: 'offer' })
        .eq('application_id', applicationId)

      if (offerError) {
        logger.error('Failed to update application to offer', { error: offerError })
      }
    }

    revalidatePath('/jobs/[id]/candidates', 'page')
    revalidatePath('/candidates', 'page')

    return {
      success: true,
      data: { stageId: newStageEntry.app_stage_id },
    }
  } catch (error) {
    logger.error('Unexpected error in advanceCandidateAction', { error })
    return unexpectedError(error, 'advanceCandidateAction')
  }
}
