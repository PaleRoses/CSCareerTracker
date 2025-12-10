'use server'

import { auth } from '@/features/auth/auth'
import { isAdminRole } from '../constants'
import { createUserClient } from '@/lib/supabase/server'
import { UpdateUserRoleSchema } from '../schemas/user-management.schema'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

type UpdateRoleResult = {
  userId: string
  newRole: string
}

export async function updateUserRoleAction(
  _prevState: ActionState<UpdateRoleResult>,
  formData: FormData
): Promise<ActionState<UpdateRoleResult>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!isAdminRole(session.user.role)) {
      return authError('Only administrators can change user roles')
    }

    const rawData = {
      userId: formData.get('userId'),
      newRole: formData.get('newRole'),
    }

    const validation = UpdateUserRoleSchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { userId, newRole } = validation.data
    const adminUserId = session.user.id
    const supabase = createUserClient(adminUserId)

    if (userId === adminUserId) {
      return authError('You cannot change your own role')
    }

    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('role, email')
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
      .update({ role: newRole })
      .eq('user_id', userId)

    if (updateError) {
      logger.error('Failed to update user role', { error: updateError })
      return databaseError(updateError, 'update user role')
    }

    logger.info('User role updated', {
      adminUserId,
      targetUserId: userId,
      oldRole: targetUser.role,
      newRole,
    })

    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return {
      success: true,
      data: { userId, newRole },
    }
  } catch (error) {
    logger.error('Unexpected error in updateUserRoleAction', { error })
    return unexpectedError(error, 'updateUserRoleAction')
  }
}
