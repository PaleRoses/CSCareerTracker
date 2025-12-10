import Link from 'next/link'
import { Box, Button, Grid, Card, CardContent, Text, Heading } from '@/design-system/components'
import PageHeader from '@/components/ui/PageHeader'
import { PeopleIcon, TrendingUpIcon } from '@/design-system/icons'
import { AdminStatsGrid, getAdminStats } from '@/features/admin'
import { ROUTES } from '@/config/routes'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <Box>
      <PageHeader
        title="Admin Dashboard"
        subtitle="System overview and user management"
        action={
          <Link href={ROUTES.admin.users}>
            <Button variant="primary" startIcon={<PeopleIcon />}>
              Manage Users
            </Button>
          </Link>
        }
      />

      <AdminStatsGrid stats={stats} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="bg-background-glass border border-border">
            <CardContent>
              <Heading level={4} className="mb-4">
                Users by Role
              </Heading>
              <Box className="space-y-3">
                {Object.entries(stats.usersByRole).map(([role, count]) => (
                  <Box key={role} className="flex justify-between items-center">
                    <Text variant="body2" className="capitalize">
                      {role.replace('_', ' ')}
                    </Text>
                    <Text variant="body2" className="font-medium">
                      {count}
                    </Text>
                  </Box>
                ))}
                {Object.keys(stats.usersByRole).length === 0 && (
                  <Text variant="body2" color="muted">
                    No user data available
                  </Text>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="bg-background-glass border border-border">
            <CardContent>
              <Heading level={4} className="mb-4">
                Quick Actions
              </Heading>
              <Box className="space-y-2">
                <Link href={ROUTES.admin.users} className="block">
                  <Button variant="outlined" fullWidth startIcon={<PeopleIcon />}>
                    View All Users
                  </Button>
                </Link>
                <Link href={ROUTES.reports} className="block">
                  <Button variant="outlined" fullWidth startIcon={<TrendingUpIcon />}>
                    View Reports
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
