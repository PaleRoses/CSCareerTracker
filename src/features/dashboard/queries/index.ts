export {
  getDashboardStats,
  type StageDistribution,
  type StaleApplication,
  type ActivityItem,
  type DashboardStats,
} from './dashboard'

export { getStaleApplications } from './stale'

export {
  DEFAULT_STALE_THRESHOLD_DAYS,
  MAX_STALE_APPLICATIONS,
} from '@/lib/queries/core/cache'
