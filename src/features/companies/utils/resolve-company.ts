import type { SupabaseClient } from '@supabase/supabase-js'
import { invalidateCompanyCaches } from './cache-utils'
import { logger } from '@/lib/logger'

export type ResolveCompanyResult =
  | { success: true; companyId: string }
  | { success: false; error: string }

export type ResolveCompanyOptions = {
  companyId?: string
  companyName?: string
  locations?: string[]
}

export async function resolveCompany(
  supabase: SupabaseClient,
  options: ResolveCompanyOptions
): Promise<ResolveCompanyResult> {
  const { companyId, companyName, locations = [] } = options

  if (companyId) {
    return { success: true, companyId }
  }

  if (!companyName) {
    return {
      success: false,
      error: 'Could not resolve company. Please select or enter a company name.',
    }
  }

  const { data: existingCompany } = await supabase
    .from('companies')
    .select('company_id')
    .ilike('company_name', companyName)
    .maybeSingle()

  if (existingCompany) {
    return { success: true, companyId: existingCompany.company_id }
  }

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
