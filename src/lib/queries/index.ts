// Application Queries
export {
  getApplications,
  getApplicationsPaginated,
  getApplication,
  getApplicationWithTag,
  applicationExists,
  getCompanies,
  type CompanyOption,
} from './applications'

// Statistics Queries
export {
  getOverviewStats,
  getStageDistribution,
  getStaleApplications,
  getAverageTimeInStage,
  getConversionRates,
  getDashboardStats,
  DEFAULT_STALE_THRESHOLD_DAYS,
  MAX_STALE_APPLICATIONS,
} from './stats'

// Analytics Queries
export {
  getOfferRateByCompany,
  getResponseTimeByCompany,
  getSuccessRateByRole,
  getReapplications,
  getMonthlyTrends,
  getStageDropoff,
} from './analytics'

// Admin Queries (require admin role)
export {
  getCompanyConsistencyStats,
  getHiddenGemCompanies,
  getOfferAcceptanceRatio,
} from './admin'

// Export Utilities
export {
  generateApplicationsCSV,
  generateApplicationsCSVBlob,
  extractCalendarEvents,
  generateCalendar,
  generateCalendarBlob,
} from './exports'

// Types
export type {
  ApplicationFilters,
  DateRange,
  QueryResult,
  OverviewStats,
  StageDistribution,
  StaleApplication,
  ActivityItem,
  DashboardStats,
  CompanyStats,
  StageConversion,
  TimeInStage,
  RoleStats,
  CalendarEvent,
  ReapplicationStats,
  MonthlyStats,
  StageDropoff,
  CompanyConsistency,
  HiddenGem,
  OfferAcceptance,
} from './core'

// Utilities
export {
  QUERY_CACHE_TAGS,
  createFilterCacheKey,
  APPLICATION_SELECT_QUERY,
  transformDbToApplication,
} from './core'
