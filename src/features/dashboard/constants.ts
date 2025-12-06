import type { ChipVariant } from '@/design-system/components'

export const STALE_THRESHOLD_DAYS = 20
export const MAX_STALE_APPLICATIONS = 5
export const MAX_RECENT_ACTIVITY = 10
export const MAX_RECENT_APPLICATIONS = 5
export const MAX_RECENT_OUTCOMES = 3
export const CACHE_REVALIDATE_SECONDS = 300

export const CACHE_TAGS = {
  DASHBOARD: 'dashboard',
  APPLICATIONS: 'applications',
  DASHBOARD_STATS: 'dashboard-stats',
} as const

export type ActivityType = 'application_created' | 'stage_updated' | 'offer_received' | 'rejection' | 'withdrawal'

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  application_created: 'Applied',
  stage_updated: 'Updated',
  offer_received: 'Offer',
  rejection: 'Rejected',
  withdrawal: 'Withdrawn',
}

export const ACTIVITY_TYPE_TO_CHIP_VARIANT: Record<ActivityType, ChipVariant> = {
  application_created: 'inProgress',
  stage_updated: 'upcoming',
  offer_received: 'offer',
  rejection: 'rejected',
  withdrawal: 'withdrawn',
}

export const DASHBOARD_CONFIG = {
  staleThresholdDays: STALE_THRESHOLD_DAYS,
  maxStaleApplications: MAX_STALE_APPLICATIONS,
  maxRecentActivity: MAX_RECENT_ACTIVITY,
  maxRecentApplications: MAX_RECENT_APPLICATIONS,
  maxRecentOutcomes: MAX_RECENT_OUTCOMES,
  cacheRevalidateSeconds: CACHE_REVALIDATE_SECONDS,
  cacheTags: CACHE_TAGS,
} as const

export type DashboardConfig = typeof DASHBOARD_CONFIG
