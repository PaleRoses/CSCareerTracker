import Link from 'next/link'
import { Box, Button, Text } from '@/design-system/components'
import { AddIcon } from '@/design-system/icons'
import { PageHeader } from '@/features/shared'
import { JobsTable } from '@/features/jobs'
import { getJobs } from '@/features/jobs/queries'
import { auth } from '@/features/auth/auth'
import { ROUTES } from '@/config/routes'
import { pluralize } from '@/lib/utils'
import { QueryPreview } from '@/features/shared/dev'

export default async function RecruiterJobsPage() {
  const session = await auth()
  const userId = session?.user?.id

  const jobs = await getJobs({
    postedBy: userId,
    includeArchived: true,
  })

  const active = jobs.filter(job => job.isActive)
  const archived = jobs.filter(job => !job.isActive)

  return (
    <Box>
      <PageHeader
        title="My Job Postings"
        subtitle={`You have ${active.length} active ${pluralize(active.length, 'job')} posted`}
        action={
          <Link href={ROUTES.recruiter.newJob}>
            <Button variant="gradient" startIcon={<AddIcon />} className="animate-glow-gradient">
              Post New Job
            </Button>
          </Link>
        }
      />

      <QueryPreview query="jobs-list">
        {jobs.length === 0 ? (
          <Box className="text-center py-12">
            <Text variant="body1" className="text-foreground/60 mb-4">
              You haven&apos;t posted any jobs yet.
            </Text>
            <Link href={ROUTES.recruiter.newJob}>
              <Button variant="gradient" startIcon={<AddIcon />} className="animate-glow-gradient">
                Post Your First Job
              </Button>
            </Link>
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
            <JobsTable jobs={jobs} canManageJobs currentUserId={userId} />
          </>
        )}
      </QueryPreview>
    </Box>
  )
}
