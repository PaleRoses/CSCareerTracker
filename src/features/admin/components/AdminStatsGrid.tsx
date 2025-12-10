'use client'

import { Grid } from '@/design-system/components'
import { StatCard } from '@/features/shared'
import {
  PeopleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  WarningIcon,
} from '@/design-system/icons'
import { colors } from '@/design-system/tokens'
import type { AdminStats } from '../types'

interface AdminStatsGridProps {
  stats: AdminStats
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <Grid container spacing={3} className="mb-6">
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PeopleIcon />}
          color={colors.primary.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Active Users"
          value={stats.activeUsersCount}
          icon={<CheckCircleIcon />}
          color={colors.success.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="New This Week"
          value={stats.recentSignups}
          icon={<TrendingUpIcon />}
          color={colors.warning.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Suspended"
          subtitle={`${stats.usersByStatus['disabled'] || 0} disabled`}
          value={stats.usersByStatus['suspended'] || 0}
          icon={<WarningIcon />}
          color={colors.error.DEFAULT}
        />
      </Grid>
    </Grid>
  )
}
