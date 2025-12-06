'use client'

import { Box, Flex, Text, Chip } from '@/design-system/components'
import { StarIcon } from '@/design-system/icons'
import type { HiddenGem } from '../types'
import ReportCard from './ReportCard'

interface HiddenGemsCardProps {
  data: HiddenGem[]
}

export function HiddenGemsCard({ data }: HiddenGemsCardProps) {
  return (
    <ReportCard
      title="Hidden Gems"
      subtitle="Companies with high offer rates and low competition"
      isEmpty={data.length === 0}
      emptyMessage="No hidden gem companies found"
    >
      <Box className="space-y-3">
        {data.slice(0, 5).map((company) => (
          <Flex
            key={company.companyId}
            justify="between"
            align="center"
            className="p-3 rounded-lg bg-success/5 border border-success/20"
          >
            <Flex align="center" gap={2}>
              <StarIcon className="w-5 h-5 text-warning" />
              <Box>
                <Text weight="medium">{company.companyName}</Text>
                <Text variant="caption" className="text-foreground/60">
                  {company.totalApplications} total applications
                </Text>
              </Box>
            </Flex>

            <Flex align="center" gap={2}>
              <Chip
                label={`${company.offerRate}% offer rate`}
                variant="success"
                size="small"
              />
              {company.avgResponseDays && (
                <Text variant="caption" className="text-foreground/50">
                  ~{company.avgResponseDays} days response
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
      </Box>
    </ReportCard>
  )
}

export default HiddenGemsCard
