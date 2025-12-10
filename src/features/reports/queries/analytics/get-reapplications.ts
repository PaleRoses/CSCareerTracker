'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'
import { unstable_cache } from 'next/cache'
import { type ReapplicationStats } from '../../types'
import { logger } from '@/lib/logger'
import { QUERY_CACHE_TAGS, DEFAULT_REVALIDATE_SECONDS } from '@/lib/queries/core/cache'

export async function getReapplications(): Promise<ReapplicationStats[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  return getCachedReapplications(session.user.id)
}

const getCachedReapplications = unstable_cache(
  async (userId: string): Promise<ReapplicationStats[]> => {
    const supabase = createCacheClient()

    const { data, error } = await supabase
      .from('applications')
      .select(`
        application_id,
        application_date,
        final_outcome,
        jobs (
          company_id,
          companies (
            company_id,
            company_name
          )
        )
      `)
      .eq('user_id', userId)
      .order('application_date', { ascending: true })

    if (error) {
      logger.error('Error fetching reapplications', { error })
      return []
    }

    type AppRow = {
      application_id: string
      application_date: string
      final_outcome: string
      jobs: {
        company_id: string
        companies: { company_id: string; company_name: string } | null
      } | null
    }

    const apps = (data || []) as unknown as AppRow[]

    const companyApps = new Map<string, {
      companyName: string
      applications: { date: string; outcome: string }[]
    }>()

    for (const app of apps) {
      const companyId = app.jobs?.company_id
      const companyName = app.jobs?.companies?.company_name
      if (!companyId || !companyName) continue

      const existing = companyApps.get(companyId) || {
        companyName,
        applications: [],
      }

      existing.applications.push({
        date: app.application_date,
        outcome: app.final_outcome,
      })

      companyApps.set(companyId, existing)
    }

    const results: ReapplicationStats[] = []

    for (const [companyId, data] of companyApps) {
      if (data.applications.length < 2) continue

      const sorted = data.applications.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const firstDate = new Date(sorted[0].date)
      const lastDate = new Date(sorted[sorted.length - 1].date)
      const daysBetween = Math.floor(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const hasSuccess = sorted.slice(1).some(a => a.outcome === 'offer')

      results.push({
        companyId,
        companyName: data.companyName,
        applicationCount: sorted.length,
        firstApplicationDate: sorted[0].date,
        lastApplicationDate: sorted[sorted.length - 1].date,
        successfulReapplication: hasSuccess,
        daysBetweenApplications: daysBetween,
      })
    }

    return results.sort((a, b) => b.applicationCount - a.applicationCount)
  },
  ['reapplication-tracking'],
  {
    tags: [QUERY_CACHE_TAGS.STATS],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  }
)
