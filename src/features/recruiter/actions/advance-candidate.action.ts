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
import {
  getStageByName,
  createStageEntry,
  updateFinalOutcome,
} from '@/features/applications/services/stage-operations'
import { STAGE_NAMES } from '@/features/applications/config'
import { verifyRecruiterOwnership } from '../utils'

type AdvanceCandidateResult = {
  stageId: string
}

export async function advanceCandidateAction(
  _prevState: ActionState<AdvanceCandidateResult>,
  formData: FormData
): Promise<ActionState<AdvanceCandidateResult>> {
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
      return { success: false, error: 'Missing required fields' }
    }

    const ownershipCheck = await verifyRecruiterOwnership(supabase, applicationId, userId)
    if (!ownershipCheck.authorized) {
      return authError(ownershipCheck.error)
    }

    const nextStage = await getStageByName(supabase, nextStageName)
    if (!nextStage) {
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

    const createResult = await createStageEntry(supabase, {
      applicationId,
      stageId: nextStage.stageId,
      status: 'inProgress',
      notes: notes || '',
      updatedBy: userId,
    })

    if (!createResult.success) {
      return databaseError({ message: createResult.error } as Error, 'create new stage')
    }

    if (nextStageName === STAGE_NAMES.OFFER) {
      await updateFinalOutcome(supabase, applicationId, 'offer')
    }

    revalidatePath('/jobs/[id]/candidates', 'page')
    revalidatePath('/candidates', 'page')

    return {
      success: true,
      data: { stageId: createResult.stageId! },
    }
  } catch (error) {
    logger.error('Unexpected error in advanceCandidateAction', { error })
    return unexpectedError(error, 'advanceCandidateAction')
  }
}
