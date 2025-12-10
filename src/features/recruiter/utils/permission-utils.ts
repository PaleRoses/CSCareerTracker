import type { createUserClient } from '@/lib/supabase/server'

type OwnershipResult =
  | { authorized: true }
  | { authorized: false; error: string }

export async function verifyRecruiterOwnership(
  supabase: ReturnType<typeof createUserClient>,
  applicationId: string,
  userId: string
): Promise<OwnershipResult> {
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select(`
      application_id,
      jobs!inner (
        posted_by
      )
    `)
    .eq('application_id', applicationId)
    .single()

  if (appError || !application) {
    return { authorized: false, error: 'Application not found' }
  }

  const jobs = application.jobs as unknown as { posted_by: string | null }
  if (jobs?.posted_by !== userId) {
    return { authorized: false, error: 'You do not have permission to manage this candidate' }
  }

  return { authorized: true }
}
