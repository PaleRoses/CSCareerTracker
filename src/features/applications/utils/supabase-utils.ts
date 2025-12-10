import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Update the updated_at timestamp of an application.
 * Call this after making changes to application stages or notes.
 */
export async function touchApplication(
  supabase: SupabaseClient,
  applicationId: string
): Promise<void> {
  await supabase
    .from('applications')
    .update({ updated_at: new Date().toISOString() })
    .eq('application_id', applicationId)
}

/**
 * Verify that the current user owns the given application.
 * Returns true if the user owns the application, false otherwise.
 */
export async function verifyApplicationOwnership(
  supabase: SupabaseClient,
  applicationId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('applications')
    .select('application_id')
    .eq('application_id', applicationId)
    .eq('user_id', userId)
    .single()

  return !error && !!data
}
