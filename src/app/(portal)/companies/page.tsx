import { Box } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { CompaniesTable, AddCompanyButton, getCompaniesWithStats } from '@/features/companies'
import { QueryPreview } from '@/features/shared/dev'
import { auth } from '@/features/auth/auth'
import { hasPrivilegedAccess } from '@/features/auth/constants'

export const metadata = {
  title: 'Companies | Career Tracker',
  description: 'Browse companies and their job listings',
}

export default async function CompaniesPage() {
  const [companies, session] = await Promise.all([
    getCompaniesWithStats(),
    auth(),
  ])

  const canManageCompanies = hasPrivilegedAccess(session?.user?.role)

  return (
    <Box>
      <PageHeader
        title="Companies"
        subtitle="Browse companies and view their open positions"
        action={canManageCompanies ? <AddCompanyButton /> : undefined}
      />
      <QueryPreview query="companies-with-stats">
        <CompaniesTable companies={companies} canManage={canManageCompanies} />
      </QueryPreview>
    </Box>
  )
}
