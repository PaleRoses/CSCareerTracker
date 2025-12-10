import { Box, Text } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { CandidatesList, StageSummaryBar } from '@/features/recruiter'
import { getCandidates, getCandidateCountsByStage } from '@/features/recruiter/queries'
import { QueryPreview } from '@/features/shared/dev'

export default async function AllCandidatesPage() {
  const [candidates, stageCounts] = await Promise.all([
    getCandidates(),
    getCandidateCountsByStage(),
  ])

  const totalActive = Object.values(stageCounts).reduce((sum, count) => sum + count, 0)

  return (
    <Box>
      <PageHeader
        title="All Candidates"
        subtitle={`${totalActive} active candidate${totalActive !== 1 ? 's' : ''} across all your job postings`}
      />

      <QueryPreview query="candidate-counts-by-stage">
        <StageSummaryBar stageCounts={stageCounts} />
      </QueryPreview>

      <QueryPreview query="recruiter-candidates">
        {candidates.length === 0 ? (
          <Box className="text-center py-12">
            <Text variant="body1" className="text-foreground/60">
              No candidates have applied to your job postings yet.
            </Text>
          </Box>
        ) : (
          <CandidatesList candidates={candidates} />
        )}
      </QueryPreview>
    </Box>
  )
}
