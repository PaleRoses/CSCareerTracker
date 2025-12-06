import { Box, Flex, Grid } from '@/design-system/components'
import { PageHeader } from '@/components/ui'
import {
  MonthlyTrendsChart,
  OfferRateTable,
  ConversionFunnel,
  TimeInStageChart,
  HiddenGemsCard,
  SuccessByRoleCard,
  OverviewStatsCard,
  ExportButtons,
} from '@/features/reports'

import { getOverviewStats } from '@/lib/queries/stats/overview'
import { getMonthlyTrends } from '@/lib/queries/analytics/monthly-trends'
import { getOfferRateByCompany } from '@/lib/queries/analytics/offer-rate'
import { getConversionRates } from '@/lib/queries/stats/conversion-rates'
import { getAverageTimeInStage } from '@/lib/queries/stats/time-in-stage'
import { getSuccessRateByRole } from '@/lib/queries/analytics/success-by-role'
import { getHiddenGemCompanies } from '@/lib/queries/admin/hidden-gems'

export const metadata = {
  title: 'Reports | Career Tracker',
  description: 'Analytics and insights for your job search',
}

export default async function ReportsPage() {
  const [
    overviewStats,
    monthlyTrends,
    offerRates,
    conversionRates,
    timeInStage,
    successByRole,
    hiddenGems,
  ] = await Promise.all([
    getOverviewStats(),
    getMonthlyTrends(),
    getOfferRateByCompany(),
    getConversionRates(),
    getAverageTimeInStage(),
    getSuccessRateByRole(),
    getHiddenGemCompanies(),
  ])

  return (
    <Box>
      <Flex justify="between" align="start" className="mb-6 flex-wrap gap-4">
        <PageHeader
          title="Reports"
          subtitle="Analytics and insights for your job search journey"
        />
        <ExportButtons />
      </Flex>

      <Box className="mb-6">
        <OverviewStatsCard stats={overviewStats} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MonthlyTrendsChart data={monthlyTrends} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ConversionFunnel data={conversionRates} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OfferRateTable data={offerRates} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TimeInStageChart data={timeInStage} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SuccessByRoleCard data={successByRole} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <HiddenGemsCard data={hiddenGems} />
        </Grid>
      </Grid>
    </Box>
  )
}
