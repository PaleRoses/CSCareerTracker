import { revalidatePath, updateTag } from 'next/cache'
import { QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'

/**
 * Invalidate all application-related caches.
 * Uses updateTag for unstable_cache data (Next.js 16 Server Action API)
 * + revalidatePath for page cache.
 */
export function invalidateApplicationCaches(): void {
  updateTag(QUERY_CACHE_TAGS.APPLICATIONS)
  updateTag(QUERY_CACHE_TAGS.DASHBOARD)
  updateTag(QUERY_CACHE_TAGS.STATS)

  revalidatePath('/applications', 'page')
  revalidatePath('/dashboard', 'page')
}

/**
 * Invalidate caches for a specific application.
 */
export function invalidateApplicationById(applicationId: string): void {
  updateTag(QUERY_CACHE_TAGS.APPLICATION_BY_ID(applicationId))
  revalidatePath(`/applications/${applicationId}`, 'page')
  invalidateApplicationCaches()
}

/**
 * @deprecated Use invalidateApplicationCaches or invalidateApplicationById
 */
export function invalidateCacheTag(_tag: string): void {
  invalidateApplicationCaches()
}

/**
 * Invalidate job-related caches.
 */
export function invalidateJobCaches(): void {
  updateTag(QUERY_CACHE_TAGS.JOBS)
  revalidatePath('/job-browser', 'page')
}
