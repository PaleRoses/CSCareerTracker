'use server'

import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/actions/auth-utils'
import { authError, databaseError, unexpectedError } from '@/lib/actions/error-utils'
import { invalidateApplicationById, invalidateApplicationCaches } from '@/lib/actions/cache-utils'
import {
  DeleteApplicationSchema,
  type ActionState,
} from '../schemas/application.schema'

/**
 * Delete a job application
 *
 * Permanently removes the application and all associated stages.
 * User can only delete their own applications (RLS enforced).
 *
 * On success, redirects to /applications list.
 */
export async function deleteApplicationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const authContext = await requireAuth()
    if (!authContext) {
      return authError('You must be logged in to delete an application')
    }
    const { supabase } = authContext

    const id = formData.get('id')
    const validation = DeleteApplicationSchema.safeParse({ id })

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid application ID',
      }
    }

    // Stages deleted via ON DELETE CASCADE, RLS enforces ownership
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('application_id', validation.data.id)

    if (error) {
      return databaseError(error, 'delete application')
    }

    invalidateApplicationById(validation.data.id)

    return {
      success: true,
    }
  } catch (error) {
    return unexpectedError(error, 'deleteApplicationAction')
  }
}

/**
 * Delete application and redirect
 * Use this variant when you want automatic redirect to applications list
 *
 * @deprecated Use deleteApplication() with client-side router.refresh() instead.
 * redirect() throws an exception that gets swallowed by startTransition.
 */
export async function deleteApplicationAndRedirect(
  id: string
): Promise<never> {
  const authContext = await requireAuth()
  if (!authContext) {
    redirect('/') // Redirect to login
  }
  const { supabase } = authContext

  await supabase
    .from('applications')
    .delete()
    .eq('application_id', id) // RLS enforces ownership

  invalidateApplicationCaches()

  redirect('/applications')
}

/**
 * Delete application without redirect
 *
 * Use this variant with client-side router.refresh() for instant UI updates.
 * This avoids the redirect() exception being swallowed by startTransition.
 */
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
