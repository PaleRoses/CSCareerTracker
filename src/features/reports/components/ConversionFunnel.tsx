'use client'

import { Box, Flex, Text } from '@/design-system/components'
import { ArrowForwardIcon } from '@/design-system/icons'
import type { StageConversion } from '../types'
import ReportCard from './ReportCard'
import { getThresholdColor } from '../utils/chart-utils'

interface ConversionFunnelProps {
  data: StageConversion[]
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  return (
    <ReportCard
      title="Stage Conversion Rates"
      subtitle="How applications progress through stages"
      isEmpty={data.length === 0}
      emptyMessage="No conversion data available"
    >
      <Box className="space-y-4">
        {data.map((conversion, index) => {
          const colorClass = getThresholdColor(conversion.conversionRate)

          return (
            <Box key={index} className="space-y-2">
              <Flex align="center" gap={2} className="text-sm">
                <Text weight="medium" className="text-foreground/80">
                  {conversion.fromStage}
                </Text>
                <ArrowForwardIcon className="w-4 h-4 text-foreground/40" />
                <Text weight="medium" className="text-foreground/80">
                  {conversion.toStage}
                </Text>
              </Flex>

              <Flex align="center" gap={3}>
                <Box className="flex-1 h-8 bg-surface-variant/30 rounded-md overflow-hidden">
                  <Box
                    className={`h-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${conversion.conversionRate}%` }}
                  />
                </Box>
                <Text variant="body2" weight="bold" className="w-14 text-right">
                  {conversion.conversionRate}%
                </Text>
              </Flex>

              <Text variant="caption" className="text-foreground/50">
                {conversion.successes} of {conversion.totalAttempts} applications advanced
              </Text>
            </Box>
          )
        })}
      </Box>
    </ReportCard>
  )
}

export default ConversionFunnel
