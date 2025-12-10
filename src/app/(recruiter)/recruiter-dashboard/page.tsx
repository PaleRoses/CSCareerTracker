import Link from 'next/link'
import { Box, Button } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { AddIcon } from '@/design-system/icons'
import { RecruiterStatsGrid, CandidatePipeline, RecruiterQuickCards } from '@/features/recruiter'
import { getRecruiterStats } from '@/features/recruiter/queries'
import { ROUTES } from '@/config/routes'
import { QueryPreview } from '@/components/dev'

export default async function RecruiterDashboardPage() {
  const stats = await getRecruiterStats()

  return (
    <Box>
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Manage your job postings and candidates"
        action={
          <Link href={ROUTES.recruiter.newJob}>
            <Button variant="primary" startIcon={<AddIcon />}>
              Post New Job
            </Button>
          </Link>
        }
      />

      <QueryPreview query="recruiter-stats">
        <Box>
          <RecruiterStatsGrid stats={stats} />
          <CandidatePipeline candidatesByStage={stats.candidatesByStage} />
          <RecruiterQuickCards candidatesByOutcome={stats.candidatesByOutcome} />
        </Box>
      </QueryPreview>
    </Box>
  )
}
