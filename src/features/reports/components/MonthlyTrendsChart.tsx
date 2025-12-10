'use client'

import { Box, Flex, Text } from '@/design-system/components'
import type { MonthlyStats } from '../types'
import ReportCard from './ReportCard'
import { formatMonth, normalizeToPercentage } from '../utils/chart-utils'

interface MonthlyTrendsChartProps {
  data: MonthlyStats[]
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  if (data.length === 0) {
    return (
      <ReportCard
        title="Monthly Trends"
        subtitle="Application activity over time"
        isEmpty
        emptyMessage="No application data available"
      />
    )
  }

  const maxApplications = Math.max(...data.map(d => d.applications))

  return (
    <ReportCard
      title="Monthly Trends"
      subtitle="Application activity over time"
    >
      <Box className="space-y-3">
        {data.slice(-6).map((month) => {
          const barWidth = normalizeToPercentage(month.applications, maxApplications)

          return (
            <Box key={month.month}>
              <Flex justify="between" className="mb-1">
                <Text variant="body2" weight="medium">
                  {formatMonth(month.month)}
                </Text>
                <Flex gap={3}>
                  <Text variant="caption" className="text-foreground/60">
                    {month.applications} apps
                  </Text>
                  <Text variant="caption" className="text-success">
                    {month.offers} offers
                  </Text>
                  <Text variant="caption" className="text-error/70">
                    {month.rejections} rejected
                  </Text>
                </Flex>
              </Flex>
              <Box className="h-6 bg-surface-variant/30 rounded-md overflow-hidden">
                <Flex className="h-full">
                  <Box
                    className="bg-primary/80 transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </Flex>
              </Box>
              {month.successRate > 0 && (
                <Text variant="caption" className="text-foreground/50 mt-1">
                  {month.successRate}% success rate
                </Text>
              )}
            </Box>
          )
        })}
      </Box>
    </ReportCard>
  )
}

export default MonthlyTrendsChart
