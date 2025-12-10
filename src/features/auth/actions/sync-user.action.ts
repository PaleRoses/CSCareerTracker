'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { SyncUserSchema, type SyncUserInput } from '../schemas/auth.schema'
import { logger } from '@/lib/logger'
import { splitFullName } from '../utils'

export async function syncUserToSupabase(
  userData: SyncUserInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const validation = SyncUserSchema.safeParse(userData)

    if (!validation.success) {
      logger.error('Invalid user data for sync', { issues: validation.error.issues })
      return {
        success: false,
        error: 'Invalid user data',
      }
    }

    const { id, email, name, provider } = validation.data

    const supabase = await createAdminClient()
    const { fname, lname } = splitFullName(name)

    const { error } = await supabase
      .from('users')
      .upsert(
        {
          user_id: id,
          email,
          fname,
          lname,
          password_hash: 'oauth', // Placeholder for OAuth users
          metadata: provider ? { provider } : {},
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      )

    if (error) {
      logger.error('Error syncing user to Supabase', { error })
      return {
        success: false,
        error: `Failed to sync user: ${error.message}`,
      }
    }

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in syncUserToSupabase', { error })
    return {
      success: false,
      error: 'Unexpected error during user sync',
    }
  }
}

export async function checkUserProfile(
  userId: string
): Promise<{ exists: boolean; error?: string }> {
  try {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      return { exists: false, error: error.message }
    }

    return { exists: !!data }
  } catch (error) {
    logger.error('Error checking user profile', { error })
    return { exists: false, error: 'Failed to check profile' }
  }
}
