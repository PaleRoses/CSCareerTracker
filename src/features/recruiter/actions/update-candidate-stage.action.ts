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
import { updateFinalOutcome } from '@/features/applications/services/stage-operations'
import { verifyRecruiterOwnership } from '../utils'

type UpdateStageResult = {
  stageId: string
}

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
      return { success: false, error: 'Missing required fields' }
    }

    const ownershipCheck = await verifyRecruiterOwnership(supabase, applicationId, userId)
    if (!ownershipCheck.authorized) {
      return authError(ownershipCheck.error)
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
      await updateFinalOutcome(supabase, applicationId, 'rejected')
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
