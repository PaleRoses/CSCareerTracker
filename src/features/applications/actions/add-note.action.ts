'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { touchApplication, verifyApplicationOwnership } from '../utils/supabase-utils'
import { authError, notFoundError, validationError } from '@/lib/actions/error-utils'
import { invalidateApplicationById } from '../utils/cache-utils'
import { AddNoteSchema, type ActionState } from '../schemas/application.schema'
import { logger } from '@/lib/logger'

export async function addNoteAction(
  _prevState: ActionState<string>,
  formData: FormData
): Promise<ActionState<string>> {
  try {
    const authContext = await requireAuth()
    if (!authContext) {
      return authError('You must be logged in to add a note')
    }
    const { userId, supabase } = authContext

    const rawData = {
      applicationId: formData.get('applicationId'),
      stageId: formData.get('stageId'),
      note: formData.get('note'),
    }

    const validation = AddNoteSchema.safeParse(rawData)

    if (!validation.success) {
      return validationError(validation.error, validation.error.issues[0]?.message || 'Invalid note')
    }

    const { applicationId, stageId, note } = validation.data

    const isOwner = await verifyApplicationOwnership(supabase, applicationId, userId)
    if (!isOwner) {
      return notFoundError('Application')
    }

    const { data: stage, error: fetchError } = await supabase
      .from('application_stages')
      .select('notes')
      .eq('app_stage_id', stageId)
      .eq('application_id', applicationId)
      .single()

    if (fetchError || !stage) {
      return {
        success: false,
        error: 'Stage not found',
      }
    }

    const today = new Date().toISOString().split('T')[0]
    const formattedNote = `[${today}] ${note}`
    const currentNotes = stage.notes || ''
    const updatedNotes = currentNotes
      ? `${currentNotes}\n${formattedNote}`
      : formattedNote

    const { error: updateError } = await supabase
      .from('application_stages')
      .update({
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('app_stage_id', stageId)
      .eq('application_id', applicationId)

    if (updateError) {
      logger.error('Error adding note', { error: updateError, applicationId, stageId })
      return {
        success: false,
        error: 'Failed to add note. Please try again.',
      }
    }

    await touchApplication(supabase, applicationId)
    invalidateApplicationById(applicationId)

    return {
      success: true,
      data: formattedNote,
    }
  } catch (error) {
    logger.error('Unexpected error in addNoteAction', { error })
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

export async function updateStageNotesAction(
  applicationId: string,
  stageId: string,
  notes: string
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

  const { error: updateError } = await supabase
    .from('application_stages')
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('app_stage_id', stageId)
    .eq('application_id', applicationId)

  if (updateError) {
    return { success: false, error: 'Failed to update notes' }
  }

  invalidateApplicationById(applicationId)

  return { success: true }
}
