import { Box, Card, CardContent } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { getCompanies } from '@/features/applications/queries'
import { QueryPreview } from '@/features/shared/dev'
import { JobFormRouterWrapper } from '@/features/recruiter'
import { ROUTES } from '@/config/routes'

export default async function NewJobPage() {
  const companies = await getCompanies()

  const companyOptions = companies.map(c => ({
    id: c.id,
    label: c.name,
  }))

  return (
    <Box>
      <PageHeader
        title="Post New Job"
        subtitle="Create a new job posting for candidates to apply to"
      />

      <QueryPreview query="companies-list">
        <Box className="max-w-2xl mx-auto">
          <Card>
            <CardContent>
              <JobFormRouterWrapper
                companies={companyOptions}
                successRoute={ROUTES.jobBrowser}
                cancelRoute={ROUTES.recruiter.jobs}
              />
            </CardContent>
          </Card>
        </Box>
      </QueryPreview>
    </Box>
  )
}
