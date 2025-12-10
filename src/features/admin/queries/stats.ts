'use server'

import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth'
import { isAdminRole } from '../constants'
import { logger } from '@/lib/logger'
import type { AdminStats } from '../types'

export async function getAdminStats(): Promise<AdminStats> {
  const defaultStats: AdminStats = {
    totalUsers: 0,
    usersByRole: {},
    usersByStatus: {},
    recentSignups: 0,
    activeUsersCount: 0,
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return defaultStats
    }

    if (!isAdminRole(session.user.role)) {
      return defaultStats
    }

    // Use service role client since we've already verified admin status
    // This bypasses RLS which would otherwise create a circular dependency
    const supabase = createCacheClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('user_id, role, status, signup_date')

    if (error) {
      logger.error('Error fetching admin stats', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      return defaultStats
    }

    const totalUsers = users?.length || 0

    const usersByRole: Record<string, number> = {}
    const usersByStatus: Record<string, number> = {}

    for (const user of users || []) {
      const role = user.role || 'unassigned'
      usersByRole[role] = (usersByRole[role] || 0) + 1

      const status = user.status || 'active'
      usersByStatus[status] = (usersByStatus[status] || 0) + 1
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentSignups = (users || []).filter((u) => {
      if (!u.signup_date) return false
      const signupDate = new Date(u.signup_date)
      return signupDate >= sevenDaysAgo
    }).length

    return {
      totalUsers,
      usersByRole,
      usersByStatus,
      recentSignups,
      activeUsersCount: usersByStatus['active'] || 0,
    }
  } catch (error) {
    logger.error('Unexpected error in getAdminStats', { error })
    return defaultStats
  }
}
