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
  ResponseTimeTable,
  StageDropoffChart,
  ReapplicationsCard,
  CompanyConsistencyTable,
  OfferAcceptanceTable,
} from '@/features/reports'

import {
  getOverviewStats,
  getMonthlyTrends,
  getOfferRateByCompany,
  getConversionRates,
  getAverageTimeInStage,
  getSuccessRateByRole,
  getHiddenGemCompanies,
  getResponseTimeByCompany,
  getStageDropoff,
  getReapplications,
  getCompanyConsistencyStats,
  getOfferAcceptanceRatio,
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
    responseTime,
    stageDropoff,
    reapplications,
    companyConsistency,
    offerAcceptance,
  ] = await Promise.all([
    getOverviewStats(),
    getMonthlyTrends(),
    getOfferRateByCompany(),
    getConversionRates(),
    getAverageTimeInStage(),
    getSuccessRateByRole(),
    getHiddenGemCompanies(),
    getResponseTimeByCompany(),
    getStageDropoff(),
    getReapplications(),
    getCompanyConsistencyStats(),
    getOfferAcceptanceRatio(),
  ])

  const hasAdminData = companyConsistency.length > 0 || offerAcceptance.length > 0

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

        {/* New Analytics Section */}
        <Grid size={{ xs: 12 }}>
          <QueryPreview query="response-time">
            <ResponseTimeTable data={responseTime} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="stage-dropoff">
            <StageDropoffChart data={stageDropoff} />
          </QueryPreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <QueryPreview query="reapplications">
            <ReapplicationsCard data={reapplications} />
          </QueryPreview>
        </Grid>

        {/* Admin-Only Section */}
        {hasAdminData && (
          <>
            <Grid size={{ xs: 12, lg: 6 }}>
              <QueryPreview query="company-consistency">
                <CompanyConsistencyTable data={companyConsistency} />
              </QueryPreview>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <QueryPreview query="offer-acceptance">
                <OfferAcceptanceTable data={offerAcceptance} />
              </QueryPreview>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}
