'use server'

import { auth } from '@/features/auth/auth'
import { isAdminRole } from '../constants'
import { createAdminClient } from '@/lib/supabase/server'
import { UpdateUserStatusSchema } from '../schemas/user-management.schema'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

type UpdateStatusResult = {
  userId: string
  newStatus: string
}

export async function updateUserStatusAction(
  _prevState: ActionState<UpdateStatusResult>,
  formData: FormData
): Promise<ActionState<UpdateStatusResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!isAdminRole(session.user.role)) {
      return authError('Only administrators can change user status')
    }

    const rawData = {
      userId: formData.get('userId'),
      newStatus: formData.get('newStatus'),
      reason: formData.get('reason') || undefined,
    }

    const validation = UpdateUserStatusSchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { userId, newStatus, reason } = validation.data
    const adminUserId = session.user.id
    const supabase = await createAdminClient()

    if (userId === adminUserId) {
      return authError('You cannot change your own status')
    }

    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('status, role, email')
      .eq('user_id', userId)
      .single()

    if (fetchError || !targetUser) {
      return { success: false, error: 'User not found' }
    }

    if (targetUser.role === 'techno_warlord') {
      return authError('Cannot modify techno_warlord accounts')
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('user_id', userId)

    if (updateError) {
      logger.error('Failed to update user status', { error: updateError })
      return databaseError(updateError, 'update user status')
    }

    logger.info('User status updated', {
      adminUserId,
      targetUserId: userId,
      oldStatus: targetUser.status,
      newStatus,
      reason,
    })

    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return {
      success: true,
      data: { userId, newStatus },
    }
  } catch (error) {
    logger.error('Unexpected error in updateUserStatusAction', { error })
    return unexpectedError(error, 'updateUserStatusAction')
  }
}
