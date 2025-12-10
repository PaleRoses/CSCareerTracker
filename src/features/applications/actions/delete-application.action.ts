'use server'

import { requireAuth } from '@/lib/actions/auth-utils'
import { invalidateApplicationCaches } from '../utils/cache-utils'

export async function deleteApplication(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authContext = await requireAuth()
    if (!authContext) {
      return { success: false, error: 'You must be logged in to delete an application' }
    }
    const { supabase } = authContext

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('application_id', id) // RLS enforces ownership

    if (error) {
      return { success: false, error: error.message }
    }

    invalidateApplicationCaches()

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
