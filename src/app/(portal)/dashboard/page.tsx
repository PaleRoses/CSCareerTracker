import { Box, Grid, Text } from "@/design-system/components";
import { PageHeader } from "@/features/shared";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import StageChart from "@/features/dashboard/components/StageChart";
import StaleApplications from "@/features/dashboard/components/StaleApplications";
import EventsList from "@/features/dashboard/components/EventsList";
import { auth } from "@/features/auth/auth";
import { getDashboardStats } from "@/features/dashboard/queries";
import { UI_STRINGS } from "@/lib/constants/ui-strings";
import { QueryPreview } from "@/features/shared/dev";

export default async function DashboardPage() {
  const session = (await auth())!; // Layout guarantees auth
  const user = session.user!;

  const dashboardData = await getDashboardStats();
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

      <QueryPreview query="dashboard-stats">
        <StatsGrid
          totalApplications={dashboardData.totalApplications}
          offersReceived={dashboardData.offersReceived}
          pendingApplications={dashboardData.pendingApplications}
          responseRate={dashboardData.responseRate}
        />
      </QueryPreview>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <QueryPreview query="stage-distribution">
            <StageChart stageDistribution={dashboardData.stageDistribution} />
          </QueryPreview>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QueryPreview query="stale-applications">
            <StaleApplications staleApplications={dashboardData.staleApplications} />
          </QueryPreview>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <QueryPreview query="dashboard-stats">
            <EventsList activities={dashboardData.recentActivity} />
          </QueryPreview>
        </Grid>
      </Grid>
    </Box>
  );
}
