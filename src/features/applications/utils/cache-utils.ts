import { revalidatePath, updateTag } from 'next/cache'
import { QUERY_CACHE_TAGS } from '@/lib/queries/core/cache'

export function invalidateApplicationCaches(): void {
  updateTag(QUERY_CACHE_TAGS.APPLICATIONS)
  updateTag(QUERY_CACHE_TAGS.DASHBOARD)
  updateTag(QUERY_CACHE_TAGS.STATS)

  revalidatePath('/applications', 'page')
  revalidatePath('/dashboard', 'page')
}

export function invalidateApplicationById(applicationId: string): void {
  updateTag(QUERY_CACHE_TAGS.APPLICATION_BY_ID(applicationId))
  revalidatePath(`/applications/${applicationId}`, 'page')
  invalidateApplicationCaches()
}
