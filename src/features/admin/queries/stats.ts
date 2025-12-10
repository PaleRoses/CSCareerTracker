'use server'

import { createUserClient } from '@/lib/supabase/server'
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

    const userId = session.user.id
    const supabase = createUserClient(userId)

    const { data: users, error } = await supabase
      .from('users')
      .select('user_id, role, status, signup_date')

    if (error) {
      logger.error('Error fetching admin stats', { error })
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
