/**
 * Core query infrastructure types
 *
 * Feature-specific types have been moved to their respective feature modules:
 * - ApplicationFilters -> @/features/applications/types
 * - Dashboard types -> @/features/dashboard/types
 * - Report types -> @/features/reports/types
 */

export type DateRange = {
  from: string
  to: string
}

export type QueryResult<T> = {
  data: T[]
  total: number
  hasMore: boolean
}
