'use client'

import { Box, Flex, Text } from '@/design-system/components'
import type { TimeInStage } from '../types'
import ReportCard from './ReportCard'
import { normalizeToPercentage } from '../utils/chart-utils'

interface TimeInStageChartProps {
  data: TimeInStage[]
}

export function TimeInStageChart({ data }: TimeInStageChartProps) {
  const maxDays = Math.max(...data.map(d => d.avgDays), 1)

  return (
    <ReportCard
      title="Time in Each Stage"
      subtitle="Average days spent in each stage"
      isEmpty={data.length === 0}
      emptyMessage="No stage timing data available"
    >
      <Box className="space-y-4">
        {data.map((stage) => {
          const barWidth = normalizeToPercentage(stage.avgDays, maxDays)

          return (
            <Box key={stage.stageName}>
              <Flex justify="between" className="mb-1">
                <Text variant="body2" weight="medium">
                  {stage.stageName}
                </Text>
                <Text variant="body2" weight="bold" className="text-primary">
                  {stage.avgDays.toFixed(1)} days
                </Text>
              </Flex>

              <Box className="h-6 bg-surface-variant/30 rounded-md overflow-hidden">
                <Box
                  className="h-full bg-secondary/70 transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </Box>

              <Flex justify="between" className="mt-1">
                <Text variant="caption" className="text-foreground/50">
                  Min: {stage.minDays} days
                </Text>
                <Text variant="caption" className="text-foreground/50">
                  Max: {stage.maxDays} days
                </Text>
                <Text variant="caption" className="text-foreground/50">
                  {stage.sampleSize} samples
                </Text>
              </Flex>
            </Box>
          )
        })}
      </Box>
    </ReportCard>
  )
}

export default TimeInStageChart
