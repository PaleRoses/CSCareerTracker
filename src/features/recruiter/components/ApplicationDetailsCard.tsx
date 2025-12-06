import { Box, Card, CardContent, Stack, Heading, Text, Chip, Divider } from '@/design-system/components'
import { CandidateStageUpdater } from './CandidateStageUpdater'
import { OUTCOME_VARIANTS } from '../constants'
import { formatDate } from '@/lib/utils'
import type { Candidate } from '../types'

interface ApplicationDetailsCardProps {
  candidate: Candidate
}

export function ApplicationDetailsCard({ candidate }: ApplicationDetailsCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap={4}>
          <Heading level={4}>Application Details</Heading>

          <Box className="grid grid-cols-2 gap-4">
            <Box>
              <Text variant="caption" className="text-foreground/60">
                Position
              </Text>
              <Text variant="body1" className="font-medium">
                {candidate.positionTitle}
              </Text>
            </Box>

            <Box>
              <Text variant="caption" className="text-foreground/60">
                Applied
              </Text>
              <Text variant="body1" className="font-medium">
                {formatDate(candidate.applicationDate)}
              </Text>
            </Box>

            <Box>
              <Text variant="caption" className="text-foreground/60">
                Current Stage
              </Text>
              <Text variant="body1" className="font-medium">
                {candidate.currentStage}
              </Text>
            </Box>

            <Box>
              <Text variant="caption" className="text-foreground/60">
                Outcome
              </Text>
              <Chip
                label={candidate.outcome}
                variant={OUTCOME_VARIANTS[candidate.outcome]}
                size="small"
              />
            </Box>
          </Box>

          <Divider />

          <CandidateStageUpdater candidate={candidate} />
        </Stack>
      </CardContent>
    </Card>
  )
}
