import { Box } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { RecruiterStatsGrid, CandidatePipeline, RecruiterQuickCards, RecruiterJobsActions } from '@/features/recruiter'
import { getRecruiterStats } from '@/features/recruiter/queries'
import { getCompanies } from '@/features/applications/queries'
import { QueryPreview } from '@/features/shared/dev'

export default async function RecruiterDashboardPage() {
  const [stats, companies] = await Promise.all([
    getRecruiterStats(),
    getCompanies(),
  ])

  const companyOptions = companies.map((c) => ({
    id: c.id,
    label: c.name,
  }))

  return (
    <Box>
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Manage your job postings and candidates"
        action={<RecruiterJobsActions companies={companyOptions} />}
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
