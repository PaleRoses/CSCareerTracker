'use client'

import { Box, Flex, Text, Chip } from '@/design-system/components'
import { RefreshIcon, CheckCircleIcon } from '@/design-system/icons'
import type { ReapplicationStats } from '../types'
import ReportCard from './ReportCard'
import { formatDate } from '@/lib/utils'

interface ReapplicationsCardProps {
  data: ReapplicationStats[]
}

export function ReapplicationsCard({ data }: ReapplicationsCardProps) {
  return (
    <ReportCard
      title="Reapplication Tracker"
      subtitle="Companies you've applied to multiple times"
      isEmpty={data.length === 0}
      emptyMessage="No repeat applications found"
    >
      <Box className="space-y-3">
        {data.slice(0, 5).map((company) => (
          <Flex
            key={company.companyId}
            justify="between"
            align="center"
            className={`p-3 rounded-lg border ${
              company.successfulReapplication
                ? 'bg-success/5 border-success/20'
                : 'bg-surface-variant/30 border-border/50'
            }`}
          >
            <Flex align="center" gap={2}>
              {company.successfulReapplication ? (
                <CheckCircleIcon className="w-5 h-5 text-success" />
              ) : (
                <RefreshIcon className="w-5 h-5 text-foreground/40" />
              )}
              <Box>
                <Text weight="medium">{company.companyName}</Text>
                <Text variant="caption" className="text-foreground/60">
                  {formatDate(company.firstApplicationDate)} → {formatDate(company.lastApplicationDate)}
                </Text>
              </Box>
            </Flex>

            <Flex align="center" gap={2}>
              <Chip
                label={`${company.applicationCount} applications`}
                variant={company.applicationCount >= 3 ? 'warning' : 'default'}
                size="small"
              />
              <Text variant="caption" className="text-foreground/50">
                {company.daysBetweenApplications} days span
              </Text>
            </Flex>
          </Flex>
        ))}
      </Box>
    </ReportCard>
  )
}

export default ReapplicationsCard
