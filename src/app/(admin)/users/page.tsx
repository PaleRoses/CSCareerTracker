import { Box } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
import { UsersList, getUsers } from '@/features/admin'

interface UsersPageProps {
  searchParams: Promise<{
    search?: string
    role?: string
    status?: string
    page?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const pageNum = params.page ? parseInt(params.page) : 1
  const limit = 25

  const filters = {
    search: params.search,
    role: params.role as 'applicant' | 'recruiter' | 'admin' | 'techno_warlord' | 'all' | undefined,
    status: params.status as 'active' | 'suspended' | 'disabled' | 'all' | undefined,
    limit,
    offset: (pageNum - 1) * limit,
  }

  const users = await getUsers(filters)

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users found`}
      />
      <UsersList users={users} />
    </Box>
  )
}
