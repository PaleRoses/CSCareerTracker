'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import type { UserRole } from '@/lib/supabase/types'
import { ROLE_OPTIONS, type RoleOption, type SetRoleResult } from '../constants'
import { splitFullName } from '../utils'

export async function setUserRole(role: RoleOption): Promise<SetRoleResult> {
  if (!ROLE_OPTIONS.some(opt => opt.value === role)) {
    return { success: false, error: 'Invalid role selected' }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  const userId = session.user.id
  const supabase = createCacheClient()

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.error('Error fetching user for role update', { error: fetchError, userId })
      return { success: false, error: 'Failed to fetch user' }
    }

    if (!existingUser) {
      const { fname, lname } = splitFullName(session.user.name)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          user_id: userId,
          email: session.user.email || '',
          fname,
          lname,
          role: role as UserRole,
          password_hash: 'oauth',
        })

      if (insertError) {
        logger.error('Error creating user with role', { error: insertError, userId })
        return { success: false, error: 'Failed to create user' }
      }

      logger.info('Created new user with role', { userId, role })
      revalidatePath('/')
      return { success: true, role }
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ role: role as UserRole })
      .eq('user_id', userId)

    if (updateError) {
      logger.error('Error updating user role', { error: updateError, userId })
      return { success: false, error: 'Failed to update role' }
    }

    logger.info('Updated user role', { userId, role })
    revalidatePath('/')
    return { success: true, role }
  } catch (error) {
    logger.error('Unexpected error in setUserRole', { error, userId })
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getUserRole(): Promise<RoleOption | null> {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const supabase = createCacheClient()

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data.role as RoleOption
}

export async function resetUserRole(): Promise<{ success: boolean }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false }
  }

  const supabase = createCacheClient()

  const { error } = await supabase
    .from('users')
    .update({ role: null })
    .eq('user_id', session.user.id)

  if (error) {
    logger.error('Error resetting user role', { error, userId: session.user.id })
    return { success: false }
  }

  logger.info('Reset user role', { userId: session.user.id })
  revalidatePath('/')
  return { success: true }
}
