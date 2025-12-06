import { Box, Grid, Text } from "@/design-system/components";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import StageChart from "@/features/dashboard/components/StageChart";
import StaleApplications from "@/features/dashboard/components/StaleApplications";
import EventsList from "@/features/dashboard/components/EventsList";
import { auth } from "@/features/auth/auth";
import { getDashboardStats } from "@/lib/queries";
import { transformDashboardData } from "@/features/dashboard/services/dashboard-transformer";
import { UI_STRINGS } from "@/lib/constants/ui-strings";

export default async function DashboardPage() {
  // Layout guarantees auth - session.user is always present
  const session = (await auth())!;
  const user = session.user!;

  const dashboardData = await getDashboardStats();
  const { stats, stageDistribution, staleApplications } = transformDashboardData(dashboardData);

  const greeting = UI_STRINGS.pages.dashboard.greeting(user.name);

  return (
    <Box>
      <PageHeader
        title={UI_STRINGS.pages.dashboard.title}
        subtitle={greeting}
      />

      <Text variant="body2" color="secondary">
        Signed in as {user.email ?? "unknown user"}.
      </Text>

      <StatsGrid stats={stats} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <StageChart stageDistribution={stageDistribution} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StaleApplications staleApplications={staleApplications} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <EventsList activities={dashboardData.recentActivity} />
        </Grid>
      </Grid>
    </Box>
  );
}
