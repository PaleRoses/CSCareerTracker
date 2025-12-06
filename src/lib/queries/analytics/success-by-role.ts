'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type RoleStats } from '../core/types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'
import { logger } from '@/lib/logger'

const ROLE_PATTERNS = [
  { pattern: /software engineer/i, label: 'Software Engineer' },
  { pattern: /frontend|front-end|front end/i, label: 'Frontend' },
  { pattern: /backend|back-end|back end/i, label: 'Backend' },
  { pattern: /full.?stack/i, label: 'Full Stack' },
  { pattern: /data scientist/i, label: 'Data Scientist' },
  { pattern: /data engineer/i, label: 'Data Engineer' },
  { pattern: /machine learning|ml engineer/i, label: 'ML Engineer' },
  { pattern: /devops|sre|platform/i, label: 'DevOps/Platform' },
  { pattern: /product manager|pm\b/i, label: 'Product Manager' },
  { pattern: /designer|ux|ui/i, label: 'Designer' },
  { pattern: /manager|lead|director/i, label: 'Management' },
  { pattern: /intern/i, label: 'Intern' },
] as const

function extractRolePattern(positionTitle: string): string {
  for (const { pattern, label } of ROLE_PATTERNS) {
    if (pattern.test(positionTitle)) {
      return label
    }
  }
  return 'Other'
}

export async function getSuccessRateByRole(): Promise<RoleStats[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedSuccessRates(session.user.id)
}

const getCachedSuccessRates = unstable_cache(
  async (userId: string): Promise<RoleStats[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select('position_title, final_outcome')
      .eq('user_id', userId)

    if (error) {
      logger.error('Error fetching success rates by role', { error })
      return []
    }

    const apps = data || []

    const roleMap = new Map<string, {
      total: number
      offers: number
      rejections: number
    }>()

    for (const app of apps) {
      const rolePattern = extractRolePattern(app.position_title)

      const existing = roleMap.get(rolePattern) || {
        total: 0,
        offers: 0,
        rejections: 0,
      }

      existing.total++

      if (app.final_outcome === 'offer') {
        existing.offers++
      } else if (app.final_outcome === 'rejected') {
        existing.rejections++
      }

      roleMap.set(rolePattern, existing)
    }

    const results: RoleStats[] = []

    for (const [rolePattern, stats] of roleMap) {
      results.push({
        rolePattern,
        totalApplications: stats.total,
        offers: stats.offers,
        rejections: stats.rejections,
        successRate: stats.total > 0
          ? Math.round((stats.offers / stats.total) * 100)
          : 0,
      })
    }

    return results.sort((a, b) => b.totalApplications - a.totalApplications)
  },
  ['success-rate-by-role'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
