import { Box, Card, CardContent, Stack, Heading, Text, Chip } from '@/design-system/components'
import { formatDate } from '@/lib/utils'
import type { CandidateStage } from '../types'

interface StageHistoryTimelineProps {
  stages: CandidateStage[]
}

function getStageChipVariant(status: CandidateStage['status']) {
  if (status === 'successful') return 'success'
  if (status === 'rejected') return 'error'
  return 'primary'
}

function getStageDotClass(status: CandidateStage['status']) {
  if (status === 'successful') return 'bg-success'
  if (status === 'rejected') return 'bg-error'
  return 'bg-primary'
}

export function StageHistoryTimeline({ stages }: StageHistoryTimelineProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap={3}>
          <Heading level={5}>Stage History</Heading>

          {stages.map((stage, index) => (
            <Box
              key={stage.id}
              className={`relative pl-6 pb-4 ${
                index < stages.length - 1 ? 'border-l-2 border-divider' : ''
              }`}
            >
              <Box
                className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full ${getStageDotClass(stage.status)}`}
              />

              <Box>
                <Text variant="body2" className="font-semibold">
                  {stage.name}
                </Text>
                <Text variant="caption" className="text-foreground/60">
                  {formatDate(stage.startedAt)}
                  {stage.endedAt && ` - ${formatDate(stage.endedAt)}`}
                </Text>
                <Chip
                  label={stage.status}
                  size="small"
                  variant={getStageChipVariant(stage.status)}
                  className="mt-1"
                />
                {stage.notes && (
                  <Text variant="body2" className="mt-2 text-foreground/80">
                    {stage.notes}
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
