'use server'

import { auth } from '@/features/auth/auth'
import { isAdminRole } from '../constants'
import { createAdminClient } from '@/lib/supabase/server'
import { DeleteUserSchema } from '../schemas/user-management.schema'
import {
  validationError,
  authError,
  databaseError,
  unexpectedError,
  type ActionState,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

export async function deleteUserAction(
  _prevState: ActionState<void>,
  formData: FormData
): Promise<ActionState<void>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in')
    }

    if (!isAdminRole(session.user.role)) {
      return authError('Only administrators can delete users')
    }

    const rawData = {
      userId: formData.get('userId'),
      confirmation: formData.get('confirmation') === 'true',
    }

    const validation = DeleteUserSchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { userId } = validation.data
    const adminUserId = session.user.id
    const supabase = await createAdminClient()

    if (userId === adminUserId) {
      return authError('You cannot delete your own account')
    }

    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('email, fname, lname, role')
      .eq('user_id', userId)
      .single()

    if (fetchError || !targetUser) {
      return { success: false, error: 'User not found' }
    }

    if (targetUser.role === 'techno_warlord') {
      return authError('Cannot delete techno_warlord accounts')
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      logger.error('Failed to delete user', { error: deleteError })
      return databaseError(deleteError, 'delete user')
    }

    logger.info('User deleted', {
      adminUserId,
      targetUserId: userId,
      targetEmail: targetUser.email,
    })

    revalidatePath('/users')

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in deleteUserAction', { error })
    return unexpectedError(error, 'deleteUserAction')
  }
}
