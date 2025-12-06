'use client'

import { Box, Flex, Text } from '@/design-system/components'
import type { RoleStats } from '../types'
import ReportCard from './ReportCard'

interface SuccessByRoleCardProps {
  data: RoleStats[]
}

export function SuccessByRoleCard({ data }: SuccessByRoleCardProps) {
  const maxApplications = Math.max(...data.map(d => d.totalApplications), 1)

  return (
    <ReportCard
      title="Success by Role Type"
      subtitle="How different role types perform"
      isEmpty={data.length === 0}
      emptyMessage="No role data available"
    >
      <Box className="space-y-4">
        {data.map((role) => {
          const barWidth = (role.totalApplications / maxApplications) * 100
          const successColor = role.successRate >= 50
            ? 'text-success'
            : role.successRate >= 25
              ? 'text-warning'
              : 'text-foreground/60'

          return (
            <Box key={role.rolePattern}>
              <Flex justify="between" className="mb-1">
                <Text variant="body2" weight="medium">
                  {role.rolePattern}
                </Text>
                <Flex gap={3}>
                  <Text variant="caption" className="text-foreground/60">
                    {role.totalApplications} apps
                  </Text>
                  <Text variant="caption" className={successColor}>
                    {role.successRate}% success
                  </Text>
                </Flex>
              </Flex>

              <Box className="h-5 bg-surface-variant/30 rounded-md overflow-hidden">
                <Flex className="h-full">
                  {role.offers > 0 && (
                    <Box
                      className="bg-success/80"
                      style={{ width: `${(role.offers / role.totalApplications) * barWidth}%` }}
                    />
                  )}
                  {role.rejections > 0 && (
                    <Box
                      className="bg-error/50"
                      style={{ width: `${(role.rejections / role.totalApplications) * barWidth}%` }}
                    />
                  )}
                  <Box
                    className="bg-primary/40"
                    style={{
                      width: `${((role.totalApplications - role.offers - role.rejections) / role.totalApplications) * barWidth}%`
                    }}
                  />
                </Flex>
              </Box>

              <Flex gap={4} className="mt-1">
                <Text variant="caption" className="text-success">
                  {role.offers} offers
                </Text>
                <Text variant="caption" className="text-error/70">
                  {role.rejections} rejected
                </Text>
              </Flex>
            </Box>
          )
        })}
      </Box>
    </ReportCard>
  )
}

export default SuccessByRoleCard
