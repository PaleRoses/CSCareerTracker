/**
 * Core Query Exports
 *
 * Types, utilities, and helpers for the query layer.
 */

// Types
export * from './types'

// Caching utilities
export {
  QUERY_CACHE_TAGS,
  DEFAULT_REVALIDATE_SECONDS,
  LONG_REVALIDATE_SECONDS,
  createCachedQuery,
  createFilterCacheKey,
} from './cache'

// Transformation utilities
export {
  APPLICATION_SELECT_QUERY,
  APPLICATION_LIST_SELECT_QUERY,
  transformDbToApplication,
  extractCompanyName,
  extractCompanyId,
  extractCurrentStage,
} from './transform'
export type { RawApplicationRow } from './transform'

// Auth utilities
export { isAdmin } from './auth-utils'
