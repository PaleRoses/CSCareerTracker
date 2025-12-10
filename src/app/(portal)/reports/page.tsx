import { Box, Flex, Grid } from '@/design-system/components'
import { PageHeader } from '@/features/shared'
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

import {
  getOverviewStats,
  getMonthlyTrends,
  getOfferRateByCompany,
  getConversionRates,
  getAverageTimeInStage,
  getSuccessRateByRole,
  getHiddenGemCompanies,
} from '@/features/reports/queries'

import { QueryPreview } from '@/features/shared/dev'

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
        <QueryPreview query="overview-stats">
          <OverviewStatsCard stats={overviewStats} />
        </QueryPreview>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="monthly-trends">
            <MonthlyTrendsChart data={monthlyTrends} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="conversion-rates">
            <ConversionFunnel data={conversionRates} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <QueryPreview query="offer-rate-by-company">
            <OfferRateTable data={offerRates} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="time-in-stage">
            <TimeInStageChart data={timeInStage} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="success-rate-by-role">
            <SuccessByRoleCard data={successByRole} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <QueryPreview query="hidden-gems">
            <HiddenGemsCard data={hiddenGems} />
          </QueryPreview>
        </Grid>
      </Grid>
    </Box>
  )
}
