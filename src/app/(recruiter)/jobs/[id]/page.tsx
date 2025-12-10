import { notFound } from 'next/navigation'
import { Box, Card, CardContent } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { getJob } from '@/features/jobs/queries'
import { getCompanies } from '@/features/applications/queries'
import { QueryPreview } from '@/features/shared/dev'
import JobEditFormWrapper from './JobEditFormWrapper'

interface EditJobPageProps {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params

  const [job, companies] = await Promise.all([
    getJob(id),
    getCompanies(),
  ])

  if (!job) {
    notFound()
  }

  const companyOptions = companies.map(c => ({
    id: c.id,
    label: c.name,
  }))

  return (
    <Box>
      <PageHeader
        title="Edit Job"
        subtitle={`Update ${job.title} at ${job.companyName}`}
      />

      <QueryPreview query="job-detail">
        <Box className="max-w-2xl mx-auto">
          <Card>
            <CardContent>
              <JobEditFormWrapper
                companies={companyOptions}
                initialJob={job}
              />
            </CardContent>
          </Card>
        </Box>
      </QueryPreview>
    </Box>
  )
}
