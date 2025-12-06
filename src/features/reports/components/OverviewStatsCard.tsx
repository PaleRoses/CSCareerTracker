'use client'

import { Card, CardContent, Grid, Heading, Text } from '@/design-system/components'
import type { OverviewStats } from '@/lib/queries/core/types'

interface OverviewStatsCardProps {
  stats: OverviewStats
}

interface StatItemProps {
  value: number | string
  label: string
  color?: string
}

function StatItem({ value, label, color = 'text-primary' }: StatItemProps) {
  return (
    <div className="text-center">
      <Heading level={3} className={color}>
        {value}
      </Heading>
      <Text variant="body2" className="text-foreground/60">
        {label}
      </Text>
    </div>
  )
}

export function OverviewStatsCard({ stats }: OverviewStatsCardProps) {
  return (
    <Card>
      <CardContent>
        <Heading level={3} className="mb-4">
          Overview
        </Heading>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={stats.totalApplications}
              label="Total Applications"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={stats.offersReceived}
              label="Offers"
              color="text-success"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={stats.pendingApplications}
              label="Pending"
              color="text-warning"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={stats.rejectedApplications}
              label="Rejected"
              color="text-error/70"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={stats.withdrawnApplications}
              label="Withdrawn"
              color="text-foreground/50"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <StatItem
              value={`${stats.responseRate}%`}
              label="Response Rate"
              color="text-secondary"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OverviewStatsCard
