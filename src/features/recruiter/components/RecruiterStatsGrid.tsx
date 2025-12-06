'use client'

import { Grid } from '@/design-system/components'
import StatCard from '@/components/ui/StatCard'
import { WorkIcon, PersonIcon, TrendingUpIcon, CheckCircleIcon } from '@/design-system/icons'
import { colors } from '@/design-system/tokens'
import type { RecruiterStats } from '../types'

interface RecruiterStatsGridProps {
  stats: RecruiterStats
}

export function RecruiterStatsGrid({ stats }: RecruiterStatsGridProps) {
  return (
    <Grid container spacing={3} className="mb-6">
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Jobs Posted"
          subtitle={`${stats.activeJobsCount} active`}
          value={stats.totalJobsPosted}
          icon={<WorkIcon />}
          color={colors.primary.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Candidates"
          value={stats.totalCandidates}
          icon={<PersonIcon />}
          color={colors.secondary.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="New This Week"
          value={stats.recentApplications}
          icon={<TrendingUpIcon />}
          color={colors.warning.DEFAULT}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Offers Extended"
          value={stats.candidatesByOutcome['offer'] || 0}
          icon={<CheckCircleIcon />}
          color={colors.success.DEFAULT}
        />
      </Grid>
    </Grid>
  )
}
