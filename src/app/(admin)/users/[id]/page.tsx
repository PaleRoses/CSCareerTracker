import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Box, Grid, Button } from '@/design-system/components'
import { ArrowBackIcon } from '@/design-system/icons'
import PageHeader from '@/components/ui/PageHeader'
import { UserDetailCard, getUserDetail } from '@/features/admin'
import { UserActionsCard } from './UserActionsCard'
import { ROUTES } from '@/config/routes'

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const user = await getUserDetail(id)

  if (!user) {
    notFound()
  }

  return (
    <Box>
      <Box className="mb-4">
        <Link href={ROUTES.admin.users}>
          <Button variant="ghost" startIcon={<ArrowBackIcon />} size="small">
            Back to Users
          </Button>
        </Link>
      </Box>
      <PageHeader
        title="User Details"
        subtitle={`${user.fname} ${user.lname}`}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <UserDetailCard user={user} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <UserActionsCard user={user} />
        </Grid>
      </Grid>
    </Box>
  )
}
