import { Box } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { ApplicationDetailsCard, StageHistoryTimeline } from '@/features/recruiter'
import { getCandidateDetail } from '@/lib/queries/recruiter'
import { notFound } from 'next/navigation'

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { id: applicationId } = await params
  const candidate = await getCandidateDetail(applicationId)

  if (!candidate) {
    notFound()
  }

  return (
    <Box>
      <PageHeader title={candidate.userName} subtitle={candidate.userEmail} />

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Box className="lg:col-span-2">
          <ApplicationDetailsCard candidate={candidate} />
        </Box>
        <Box>
          <StageHistoryTimeline stages={candidate.stages} />
        </Box>
      </Box>
    </Box>
  )
}
