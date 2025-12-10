'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateCompanyCaches } from '../utils/cache-utils'
import { invalidateJobCaches } from '@/features/jobs/utils'
import { DeleteCompanySchema, type ActionState } from '../schemas'
import {
  validationError,
  authError,
  databaseError,
  notFoundError,
  unexpectedError,
} from '@/lib/actions/error-utils'
import { logger } from '@/lib/logger'

export async function deleteCompanyAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return authError('You must be logged in to delete a company')
    }

    if (!hasPrivilegedAccess(session.user.role)) {
      return authError('You do not have permission to delete companies')
    }

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const rawData = {
      companyId: formData.get('companyId'),
      confirmation: formData.get('confirmation') === 'true',
    }

    const validation = DeleteCompanySchema.safeParse(rawData)
    if (!validation.success) {
      return validationError(validation.error)
    }

    const { companyId } = validation.data

    // Verify company exists
    const { data: existing, error: fetchError } = await supabase
      .from('companies')
      .select('company_id, company_name')
      .eq('company_id', companyId)
      .single()

    if (fetchError || !existing) {
      return notFoundError('Company')
    }

    // Check for associated jobs
    const { count: jobCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    if (jobCount && jobCount > 0) {
      return {
        success: false,
        error: `Cannot delete company with ${jobCount} associated job${jobCount > 1 ? 's' : ''}. Delete the jobs first or mark them inactive.`,
      }
    }

    // Delete the company (cascades to any remaining references via FK)
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('company_id', companyId)

    if (deleteError) {
      logger.error('Failed to delete company', { error: deleteError, companyId })
      return databaseError(deleteError, 'delete company')
    }

    invalidateCompanyCaches()
    invalidateJobCaches()
    logger.info('Company deleted', { companyId, companyName: existing.company_name, deletedBy: userId })

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in deleteCompanyAction', { error })
    return unexpectedError(error, 'deleteCompanyAction')
  }
}
