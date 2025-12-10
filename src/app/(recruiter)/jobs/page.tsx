import { Box, Text } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { JobsTable } from '@/features/jobs'
import { getJobs } from '@/features/jobs/queries'
import { getCompanies } from '@/features/applications/queries'
import { auth } from '@/features/auth/auth'
import { pluralize } from '@/lib/utils'
import { QueryPreview } from '@/features/shared/dev'
import { RecruiterJobsActions } from '@/features/recruiter'

export default async function RecruiterJobsPage() {
  const session = await auth()
  const userId = session?.user?.id

  const [jobs, companies] = await Promise.all([
    getJobs({
      postedBy: userId,
      includeArchived: true,
    }),
    getCompanies(),
  ])

  const active = jobs.filter(job => job.isActive)
  const archived = jobs.filter(job => !job.isActive)

  const companyOptions = companies.map((c) => ({
    id: c.id,
    label: c.name,
  }))

  return (
    <Box>
      <PageHeader
        title="My Job Postings"
        subtitle={`You have ${active.length} active ${pluralize(active.length, 'job')} posted`}
        action={<RecruiterJobsActions companies={companyOptions} />}
      />

      <QueryPreview query="jobs-list">
        {jobs.length === 0 ? (
          <Box className="text-center py-12">
            <Text variant="body1" className="text-foreground/60 mb-4">
              You haven&apos;t posted any jobs yet.
            </Text>
            <RecruiterJobsActions companies={companyOptions} />
          </Box>
        ) : (
          <>
            {archived.length > 0 && (
              <Box className="mb-4">
                <Text variant="body2" className="text-foreground/60">
                  Showing {active.length} active and {archived.length} archived {pluralize(archived.length, 'job')}
                </Text>
              </Box>
            )}
            <JobsTable jobs={jobs} canManageJobs currentUserId={userId} companies={companyOptions} />
          </>
        )}
      </QueryPreview>
    </Box>
  )
}
