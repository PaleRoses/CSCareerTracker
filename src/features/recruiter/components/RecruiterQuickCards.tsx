import Link from 'next/link'
import { Box, Card, CardContent, Stack, Text, Button, Grid } from '@/design-system/components'
import { ROUTES } from '@/config/routes'

interface RecruiterQuickCardsProps {
  candidatesByOutcome: Record<string, number>
}

export function RecruiterQuickCards({ candidatesByOutcome }: RecruiterQuickCardsProps) {
  const hasOutcomes = Object.keys(candidatesByOutcome).length > 0

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Stack gap={3}>
              <Text variant="body1" className="font-semibold">
                Quick Actions
              </Text>
              <Stack gap={2}>
                <Link href={ROUTES.recruiter.jobs}>
                  <Button variant="ghost" fullWidth className="justify-start">
                    View My Job Postings
                  </Button>
                </Link>
                <Link href="/candidates">
                  <Button variant="ghost" fullWidth className="justify-start">
                    View All Candidates
                  </Button>
                </Link>
                <Link href={ROUTES.jobBrowser}>
                  <Button variant="ghost" fullWidth className="justify-start">
                    Browse All Jobs
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Stack gap={3}>
              <Text variant="body1" className="font-semibold">
                Outcome Summary
              </Text>
              {hasOutcomes ? (
                <Box className="space-y-2">
                  {Object.entries(candidatesByOutcome).map(([outcome, count]) => (
                    <Box key={outcome} className="flex justify-between items-center">
                      <Text variant="body2" className="capitalize">
                        {outcome}
                      </Text>
                      <Text variant="body2" className="font-semibold">
                        {count}
                      </Text>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Text variant="body2" className="text-foreground/60">
                  No outcomes recorded yet.
                </Text>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
