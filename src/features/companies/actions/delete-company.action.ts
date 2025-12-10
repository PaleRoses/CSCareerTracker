'use server'

import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'
import { createUserClient } from '@/lib/supabase/server'
import { invalidateCompanyCaches } from '../utils/cache-utils'
import { invalidateJobCaches } from '@/features/jobs/utils'
import { invalidateApplicationCaches } from '@/features/applications/utils/cache-utils'
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

    // Delete the company (cascades to jobs, applications, and stages via FK)
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
    invalidateApplicationCaches()
    logger.info('Company deleted (cascaded to jobs and applications)', { companyId, companyName: existing.company_name, deletedBy: userId })

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in deleteCompanyAction', { error })
    return unexpectedError(error, 'deleteCompanyAction')
  }
}
