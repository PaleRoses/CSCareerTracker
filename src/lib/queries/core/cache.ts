import { unstable_cache } from 'next/cache'

export const QUERY_CACHE_TAGS = {
  APPLICATIONS: 'applications',
  APPLICATION_BY_ID: (id: string) => `application-${id}`,
  STATS: 'stats',
  DASHBOARD: 'dashboard',
  COMPANIES: 'companies',
  JOBS: 'jobs',
} as const

export const DEFAULT_REVALIDATE_SECONDS = 60
export const LONG_REVALIDATE_SECONDS = 300

export const DEFAULT_STALE_THRESHOLD_DAYS = 14
export const MAX_STALE_APPLICATIONS = 10

type CacheOptions = {
  keyParts: string[]
  tags: string[]
  revalidate?: number
}

export function createCachedQuery<TArgs extends unknown[], TResult>(
  queryFn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions
): (...args: TArgs) => Promise<TResult> {
  return unstable_cache(queryFn, options.keyParts, {
    tags: options.tags,
    revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
  })
}

export function createFilterCacheKey(filters: Record<string, unknown>): string {
  const parts = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value)}`)

  return parts.length > 0 ? parts.join('|') : 'no-filters'
}
