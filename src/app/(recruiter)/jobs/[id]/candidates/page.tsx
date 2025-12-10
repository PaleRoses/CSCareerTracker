import { Box, Text } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { CandidatesList } from '@/features/recruiter'
import { getCandidates } from '@/features/recruiter/queries'
import { getJobs } from '@/features/jobs/queries'
import { auth } from '@/features/auth/auth'
import { QueryPreview } from '@/components/dev'
import { notFound } from 'next/navigation'

interface CandidatesPageProps {
  params: Promise<{ id: string }>
}

export default async function JobCandidatesPage({ params }: CandidatesPageProps) {
  const { id: jobId } = await params
  const session = await auth()
  const userId = session?.user?.id

  const jobs = await getJobs({ postedBy: userId })
  const job = jobs.find(j => j.id === jobId)

  if (!job) {
    notFound()
  }

  const candidates = await getCandidates({ jobId })

  return (
    <Box>
      <PageHeader
        title={`Candidates for ${job.title}`}
        subtitle={`${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} at ${job.companyName}`}
      />

      <QueryPreview query="recruiter-candidates">
        {candidates.length === 0 ? (
          <Box className="text-center py-12">
            <Text variant="body1" className="text-foreground/60">
              No candidates have applied for this position yet.
            </Text>
          </Box>
        ) : (
          <CandidatesList candidates={candidates} jobId={jobId} />
        )}
      </QueryPreview>
    </Box>
  )
}
