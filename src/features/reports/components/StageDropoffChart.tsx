'use client'

import { Box, Flex, Text } from '@/design-system/components'
import type { StageDropoff } from '../types'
import ReportCard from './ReportCard'
import { normalizeToPercentage } from '../utils/chart-utils'

interface StageDropoffChartProps {
  data: StageDropoff[]
}

export function StageDropoffChart({ data }: StageDropoffChartProps) {
  const maxReached = Math.max(...data.map(d => d.reachedCount), 1)

  return (
    <ReportCard
      title="Stage Dropoff Analysis"
      subtitle="Where candidates fall out of the pipeline"
      isEmpty={data.length === 0}
      emptyMessage="No dropoff data available"
    >
      <Box className="space-y-4">
        {data.map((stage) => {
          const reachedWidth = normalizeToPercentage(stage.reachedCount, maxReached)
          const droppedWidth = normalizeToPercentage(stage.droppedCount, maxReached)

          return (
            <Box key={stage.stageName}>
              <Flex justify="between" className="mb-1">
                <Text variant="body2" weight="medium">
                  {stage.stageName}
                </Text>
                <Text variant="body2" weight="bold" className={stage.dropoffRate > 50 ? 'text-error' : stage.dropoffRate > 25 ? 'text-warning' : 'text-foreground/60'}>
                  {stage.dropoffRate}% dropoff
                </Text>
              </Flex>

              <Box className="h-6 bg-surface-variant/30 rounded-md overflow-hidden relative">
                {/* Reached bar (background) */}
                <Box
                  className="h-full bg-primary/30 absolute top-0 left-0 transition-all duration-300"
                  style={{ width: `${reachedWidth}%` }}
                />
                {/* Dropped bar (overlay) */}
                <Box
                  className="h-full bg-error/70 absolute top-0 left-0 transition-all duration-300"
                  style={{ width: `${droppedWidth}%` }}
                />
              </Box>

              <Flex justify="between" className="mt-1">
                <Text variant="caption" className="text-foreground/50">
                  {stage.reachedCount} reached
                </Text>
                <Text variant="caption" className="text-error/70">
                  {stage.droppedCount} dropped
                </Text>
              </Flex>
            </Box>
          )
        })}
      </Box>
    </ReportCard>
  )
}

export default StageDropoffChart
