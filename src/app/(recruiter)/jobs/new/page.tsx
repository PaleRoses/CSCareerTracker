import { Box, Card, CardContent } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { getCompanies } from '@/features/applications/queries'
import { QueryPreview } from '@/components/dev'
import JobPostingFormWrapper from './JobPostingFormWrapper'

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
              <JobPostingFormWrapper companies={companyOptions} />
            </CardContent>
          </Card>
        </Box>
      </QueryPreview>
    </Box>
  )
}
