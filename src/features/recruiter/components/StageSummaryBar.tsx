import { Box, Text } from '@/design-system/components'

interface StageSummaryBarProps {
  stageCounts: Record<string, number>
}

export function StageSummaryBar({ stageCounts }: StageSummaryBarProps) {
  if (Object.keys(stageCounts).length === 0) {
    return null
  }

  return (
    <Box className="flex gap-4 mb-6 flex-wrap">
      {Object.entries(stageCounts).map(([stage, count]) => (
        <Box key={stage} className="bg-background-paper px-4 py-2 rounded-lg">
          <Text variant="caption" className="text-foreground/60">
            {stage}
          </Text>
          <Text variant="body1" className="font-bold text-lg">
            {count}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
