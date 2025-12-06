import { Box, Card, CardContent, Text } from '@/design-system/components'

interface CandidatePipelineProps {
  candidatesByStage: Record<string, number>
}

export function CandidatePipeline({ candidatesByStage }: CandidatePipelineProps) {
  const hasData = Object.keys(candidatesByStage).length > 0

  return (
    <Card className="mb-6">
      <CardContent>
        <Text variant="body1" className="font-semibold mb-4">
          Candidate Pipeline
        </Text>

        {hasData ? (
          <Box className="flex gap-4 flex-wrap">
            {Object.entries(candidatesByStage).map(([stage, count]) => (
              <Box key={stage} className="bg-background rounded-lg px-4 py-3 text-center min-w-[100px]">
                <Text variant="body1" className="font-bold text-2xl">
                  {count}
                </Text>
                <Text variant="caption" className="text-foreground/60">
                  {stage}
                </Text>
              </Box>
            ))}
          </Box>
        ) : (
          <Text variant="body2" className="text-foreground/60">
            No candidates in pipeline yet.
          </Text>
        )}
      </CardContent>
    </Card>
  )
}
