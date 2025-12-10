import { updateTag } from 'next/cache'
import { QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'

/**
 * Invalidate company-related caches.
 */
export function invalidateCompanyCaches(): void {
  updateTag(QUERY_CACHE_TAGS.COMPANIES)
}
