/**
 * Company Resolution Utility
 *
 * Resolves a company by ID or name, creating a new one if necessary.
 * Consolidates duplicate logic from create-application and create-job actions.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { invalidateCompanyCaches } from './cache-utils'
import { logger } from '@/lib/logger'

export type ResolveCompanyResult =
  | { success: true; companyId: string }
  | { success: false; error: string }

export type ResolveCompanyOptions = {
  companyId?: string
  companyName?: string
  /** Optional locations to set when creating a new company */
  locations?: string[]
}

/**
 * Resolve or create a company by ID or name
 *
 * If companyId is provided, uses it directly.
 * If only companyName is provided, looks up existing company by name (case-insensitive).
 * If no match found, creates a new company.
 *
 * @example
 * const result = await resolveCompany(supabase, { companyName: 'Acme Corp' })
 * if (!result.success) return { success: false, error: result.error }
 * const { companyId } = result
 */
export async function resolveCompany(
  supabase: SupabaseClient,
  options: ResolveCompanyOptions
): Promise<ResolveCompanyResult> {
  const { companyId, companyName, locations = [] } = options

  // If companyId provided, use it directly
  if (companyId) {
    return { success: true, companyId }
  }

  // Must have companyName if no companyId
  if (!companyName) {
    return {
      success: false,
      error: 'Could not resolve company. Please select or enter a company name.',
    }
  }

  // Check for existing company (case-insensitive match)
  const { data: existingCompany } = await supabase
    .from('companies')
    .select('company_id')
    .ilike('company_name', companyName)
    .maybeSingle()

  if (existingCompany) {
    return { success: true, companyId: existingCompany.company_id }
  }

  // Create new company
  const { data: newCompany, error: companyError } = await supabase
    .from('companies')
    .insert({
      company_name: companyName,
      website: '',
      ...(locations.length > 0 && { locations }),
    })
    .select('company_id')
    .single()

  if (companyError) {
    logger.error('Failed to create company', { error: companyError, companyName })
    return { success: false, error: `Failed to create company: ${companyError.message}` }
  }

  invalidateCompanyCaches()
  logger.info('Company created', { companyId: newCompany.company_id, companyName })

  return { success: true, companyId: newCompany.company_id }
}
