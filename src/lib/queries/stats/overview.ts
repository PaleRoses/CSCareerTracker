'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type OverviewStats } from '../core/types'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '../core/cache'
import { logger } from '@/lib/logger'

export async function getOverviewStats(): Promise<OverviewStats> {
  const session = await auth()

  if (!session?.user?.id) {
    return getEmptyStats()
  }

  return getCachedOverviewStats(session.user.id)
}

const getCachedOverviewStats = unstable_cache(
  async (userId: string): Promise<OverviewStats> => {
    const supabase = createCacheClient()

    // Fetch just the fields we need for counting
    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        final_outcome,
        application_stages (
          status
        )
      `)
      .eq('user_id', userId)

    if (error) {
      logger.error('Error fetching overview stats', { error })
      return getEmptyStats()
    }

    const apps = data || []

    const totalApplications = apps.length
    const offersReceived = apps.filter((a) => a.final_outcome === 'offer').length
    const rejectedApplications = apps.filter((a) => a.final_outcome === 'rejected').length
    const withdrawnApplications = apps.filter((a) => a.final_outcome === 'withdrawn').length

    const pendingApplications = apps.filter((a) => {
      const stages = (a.application_stages as Array<{ status: string }>) || []
      return stages.some((s) => s.status === 'inProgress')
    }).length

    const responded = offersReceived + rejectedApplications + withdrawnApplications
    const responseRate = totalApplications > 0
      ? Math.round((responded / totalApplications) * 100)
      : 0

    return {
      totalApplications,
      offersReceived,
      pendingApplications,
      rejectedApplications,
      withdrawnApplications,
      responseRate,
    }
  },
  ['overview-stats'],
  {
    tags: [QUERY_CACHE_TAGS.STATS, QUERY_CACHE_TAGS.APPLICATIONS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)

function getEmptyStats(): OverviewStats {
  return {
    totalApplications: 0,
    offersReceived: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    withdrawnApplications: 0,
    responseRate: 0,
  }
}
