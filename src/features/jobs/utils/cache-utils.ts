import { revalidatePath, updateTag } from 'next/cache'
import { QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'

/**
 * Invalidate job-related caches.
 */
export function invalidateJobCaches(): void {
  updateTag(QUERY_CACHE_TAGS.JOBS)
  revalidatePath('/job-browser', 'page')
}
