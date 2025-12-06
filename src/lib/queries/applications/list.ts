'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type Application } from '@/features/applications/schemas/application.schema'
import { type ApplicationFilters, type QueryResult } from '../core/types'
import { APPLICATION_SELECT_QUERY, transformDbToApplication } from '../core/transform'
import { logger } from '@/lib/logger'
import { QUERY_CACHE_TAGS, createFilterCacheKey, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'

export async function getApplications(
  filters: ApplicationFilters = {}
): Promise<Application[]> {
  const session = await auth()

  if (!session?.user?.id) {
    logger.warn('getApplications: No authenticated user')
    return []
  }

  // Create a cache key based on filters
  const filterKey = createFilterCacheKey(filters)

  return getCachedApplications(session.user.id, filters, filterKey)
}

export async function getApplicationsPaginated(
  filters: ApplicationFilters = {}
): Promise<QueryResult<Application>> {
  const session = await auth()

  if (!session?.user?.id) {
    return { data: [], total: 0, hasMore: false }
  }

  const supabase = createCacheClient()

  // Build query with filters
  let query = supabase
    .from('applications')
    .select(APPLICATION_SELECT_QUERY, { count: 'exact' })
    .eq('user_id', session.user.id)

  // Apply filters
  query = applyFilters(query, filters)

  // Apply pagination
  const limit = filters.limit ?? 50
  const offset = filters.offset ?? 0
  query = query.range(offset, offset + limit - 1)

  // Execute
  const { data, error, count } = await query.order('application_date', { ascending: false })

  if (error) {
    logger.error('Error fetching applications', { error })
    return { data: [], total: 0, hasMore: false }
  }

  const applications = (data || []).map(transformDbToApplication)
  const total = count ?? 0

  return {
    data: applications,
    total,
    hasMore: offset + applications.length < total,
  }
}

const getCachedApplications = unstable_cache(
  async (
    userId: string,
    filters: ApplicationFilters,
    _filterKey: string // Used for cache key differentiation
  ): Promise<Application[]> => {
    const supabase = createCacheClient()

    // Build base query
    let query = supabase
      .from('applications')
      .select(APPLICATION_SELECT_QUERY)
      .eq('user_id', userId)

    // Apply filters
    query = applyFilters(query, filters)

    // Apply limit if specified
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1)
    }

    // Execute with ordering
    const { data, error } = await query.order('application_date', { ascending: false })

    if (error) {
      logger.error('Error fetching applications', { error })
      return []
    }

    // Transform to Application type
    const applications = (data || []).map(transformDbToApplication)

    // Apply client-side filters that Supabase can't handle directly
    return applyClientSideFilters(applications, filters)
  },
  ['applications-list'],
  {
    tags: [QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)

// Using `any` for query type because Supabase's generic types don't play well with function wrappers
function applyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: ApplicationFilters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // Date range filters
  if (filters.dateFrom) {
    query = query.gte('application_date', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('application_date', filters.dateTo)
  }

  // Outcome filter
  if (filters.outcome) {
    if (filters.outcome === 'pending') {
      // Pending means final_outcome = 'pending' (DB default)
      query = query.eq('final_outcome', 'pending')
    } else {
      query = query.eq('final_outcome', filters.outcome)
    }
  }

  // Position title partial match
  if (filters.positionTitle) {
    query = query.ilike('position_title', `%${filters.positionTitle}%`)
  }

  return query
}

// Client-side filters for fields Supabase can't filter on joined tables
function applyClientSideFilters(
  applications: Application[],
  filters: ApplicationFilters
): Application[] {
  let filtered = applications

  // Company name filter (requires traversing join)
  if (filters.companyName) {
    const search = filters.companyName.toLowerCase()
    filtered = filtered.filter((app) =>
      app.company.toLowerCase().includes(search)
    )
  }

  // Company ID filter
  if (filters.companyId) {
    // Note: We'd need to include companyId in Application type for this
    // For now, skip - this is a TODO for enhancement
  }

  // Current stage filter
  if (filters.currentStage) {
    const stageName = filters.currentStage.toLowerCase()
    filtered = filtered.filter((app) => {
      const current = app.stages.find((s) => s.status === 'inProgress')
      return current?.name.toLowerCase().includes(stageName)
    })
  }

  return filtered
}
