import { Box, Card, CardContent } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { getCompanies } from '@/lib/queries'
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

      <Box className="max-w-2xl mx-auto">
        <Card>
          <CardContent>
            <JobPostingFormWrapper companies={companyOptions} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
