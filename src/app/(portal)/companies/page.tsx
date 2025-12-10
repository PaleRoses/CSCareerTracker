import { Box } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { CompaniesTable, getCompaniesWithStats } from '@/features/companies'
import { QueryPreview } from '@/features/shared/dev'

export const metadata = {
  title: 'Companies | Career Tracker',
  description: 'Browse companies and their job listings',
}

export default async function CompaniesPage() {
  const companies = await getCompaniesWithStats()

  return (
    <Box>
      <PageHeader
        title="Companies"
        subtitle="Browse companies and view their open positions"
      />
      <QueryPreview query="companies-with-stats">
        <CompaniesTable companies={companies} />
      </QueryPreview>
    </Box>
  )
}
